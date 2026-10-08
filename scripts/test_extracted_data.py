import json
import os

def test_data():
    summary_path = "public/data/tocfl-summary.json"
    assert os.path.exists(summary_path), "summary missing"
    with open(summary_path, "r", encoding="utf-8") as f:
        summary = json.load(f)
    assert len(summary) == 6, f"Expected 6 levels, got {len(summary)}"
    
    expected_counts = {"L0": 394, "L1": 347, "L2": 485, "L3": 1173, "L4": 2342, "L5": 2776}
    total_words = 0
    for lvl, count in expected_counts.items():
        lvl_file = f"public/data/tocfl-{lvl.lower()}.json"
        assert os.path.exists(lvl_file), f"Missing {lvl_file}"
        with open(lvl_file, "r", encoding="utf-8") as f:
            words = json.load(f)
        assert len(words) == count, f"Level {lvl} expected {count}, got {len(words)}"
        total_words += len(words)
        assert words[0]["trad"], "Word must have trad character"
    assert total_words == 7517, f"Total expected 7517, got {total_words}"
    print("ALL DATA TESTS PASSED!")

if __name__ == "__main__":
    test_data()
