import zipfile
import sqlite3
import json
import os
import re
import tempfile

def clean_audio_name(audio_field: str) -> str:
    match = re.search(r'\[sound:([^\]]+)\]', audio_field)
    if match:
        return match.group(1).strip()
    return audio_field.strip()

def run_extraction():
    apkg_path = os.path.abspath("Taiwan_TOCFL_2023_wordlist_with_audio_Traditional.apkg")
    data_dir = os.path.abspath("public/data")
    audio_dir = os.path.abspath("public/audio")
    
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(audio_dir, exist_ok=True)
    
    print(f"Opening APKG: {apkg_path}")
    with zipfile.ZipFile(apkg_path, 'r') as z:
        # 1. Extract database
        db_name = 'collection.anki21' if 'collection.anki21' in z.namelist() else 'collection.anki2'
        tmp_dir = tempfile.mkdtemp()
        db_path = z.extract(db_name, path=tmp_dir)
        
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("SELECT flds FROM notes")
        rows = cur.fetchall()
        conn.close()
        
        print(f"Total notes found in database: {len(rows)}")
        
        words_by_level = {
            "L0": [],
            "L1": [],
            "L2": [],
            "L3": [],
            "L4": [],
            "L5": []
        }
        
        for r in rows:
            fields = r[0].split('\x1f')
            wid = fields[0] if len(fields) > 0 else ""
            trad = fields[1] if len(fields) > 1 else ""
            simp = fields[2] if len(fields) > 2 else ""
            pinyin = fields[3] if len(fields) > 3 else ""
            pos = fields[4] if len(fields) > 4 else ""
            meaning = fields[5] if len(fields) > 5 else ""
            variants = fields[6] if len(fields) > 6 else ""
            raw_audio = fields[7] if len(fields) > 7 else ""
            
            audio_file = clean_audio_name(raw_audio)
            
            lvl = wid.split('-')[0] if '-' in wid else "L0"
            if lvl not in words_by_level:
                words_by_level[lvl] = []
                
            words_by_level[lvl].append({
                "id": wid,
                "level": lvl,
                "trad": trad,
                "simp": simp,
                "pinyin": pinyin,
                "pos": pos,
                "meaning": meaning,
                "variants": variants,
                "audio": audio_file
            })
            
        # Write JSON per level
        level_meta = [
            {"level": "L0", "band": "Novice", "titleZh": "準備級", "titleEn": "Novice", "cefr": "Pre-A1", "studyHoursAbroad": "60 - 240"},
            {"level": "L1", "band": "Band A", "titleZh": "入門級", "titleEn": "Level 1", "cefr": "A1", "studyHoursAbroad": "240 - 480"},
            {"level": "L2", "band": "Band A", "titleZh": "基礎級", "titleEn": "Level 2", "cefr": "A2", "studyHoursAbroad": "480 - 720"},
            {"level": "L3", "band": "Band B", "titleZh": "進階級", "titleEn": "Level 3", "cefr": "B1", "studyHoursAbroad": "720 - 960"},
            {"level": "L4", "band": "Band B", "titleZh": "高階級", "titleEn": "Level 4", "cefr": "B2", "studyHoursAbroad": "960 - 1,920"},
            {"level": "L5", "band": "Band C", "titleZh": "流利級", "titleEn": "Level 5", "cefr": "C1", "studyHoursAbroad": "1,920 - 3,840"},
        ]
        
        cumulative = 0
        summary = []
        for m in level_meta:
            lvl = m["level"]
            count = len(words_by_level.get(lvl, []))
            cumulative += count
            summary.append({
                **m,
                "wordCount": count,
                "cumulativeCount": cumulative
            })
            out_json = os.path.join(data_dir, f"tocfl-{lvl.lower()}.json")
            with open(out_json, "w", encoding="utf-8") as f:
                json.dump(words_by_level[lvl], f, ensure_ascii=False, indent=2)
            print(f"Wrote {count} words to {out_json}")
            
        summary_file = os.path.join(data_dir, "tocfl-summary.json")
        with open(summary_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        print(f"Wrote summary to {summary_file}")
        
        # 2. Extract media files
        if 'media' in z.namelist():
            with z.open('media') as mf:
                media_map = json.load(mf)
            print(f"Extracting {len(media_map)} audio files...")
            
            extracted_count = 0
            for num_key, target_name in media_map.items():
                if num_key in z.namelist():
                    dest_file = os.path.join(audio_dir, target_name)
                    if not os.path.exists(dest_file):
                        with z.open(num_key) as src, open(dest_file, "wb") as dst:
                            dst.write(src.read())
                    extracted_count += 1
            print(f"Extracted/verified {extracted_count} audio files in {audio_dir}")

if __name__ == "__main__":
    run_extraction()
