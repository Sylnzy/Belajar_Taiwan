import fs from "fs";
import path from "path";
import { LevelSummary } from "../types/vocab";
import { Dashboard } from "../components/Dashboard";

function getLevelSummaries(): LevelSummary[] {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "tocfl-summary.json");
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read tocfl-summary.json:", err);
    return [];
  }
}

export default function HomePage() {
  const levels = getLevelSummaries();
  return <Dashboard levels={levels} />;
}
