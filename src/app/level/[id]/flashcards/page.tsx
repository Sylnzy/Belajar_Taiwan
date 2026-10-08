import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { VocabWord, LevelSummary } from "../../../../types/vocab";
import { FlashcardSRS } from "../../../../components/FlashcardSRS";

interface PageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return [
    { id: "l0" },
    { id: "l1" },
    { id: "l2" },
    { id: "l3" },
    { id: "l4" },
    { id: "l5" },
  ];
}

function getLevelData(levelId: string): { levelInfo: LevelSummary; words: VocabWord[] } | null {
  const normLevel = levelId.toLowerCase();
  const summaryPath = path.join(process.cwd(), "public", "data", "tocfl-summary.json");
  const wordsPath = path.join(process.cwd(), "public", "data", `tocfl-${normLevel}.json`);

  if (!fs.existsSync(summaryPath) || !fs.existsSync(wordsPath)) {
    return null;
  }

  const summaries: LevelSummary[] = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
  const levelInfo = summaries.find((s) => s.level.toLowerCase() === normLevel);
  if (!levelInfo) return null;

  const words: VocabWord[] = JSON.parse(fs.readFileSync(wordsPath, "utf-8"));
  return { levelInfo, words };
}

export default function FlashcardsPage({ params }: PageProps) {
  const data = getLevelData(params.id);
  if (!data) notFound();

  return <FlashcardSRS levelInfo={data.levelInfo} words={data.words} />;
}
