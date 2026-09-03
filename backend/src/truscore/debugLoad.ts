import { loadTruScoreEvents } from "./loadTruScoreEvents";
import { computeTruScore } from "./computeTruScore";

async function main() {
  const userId = process.argv[2];
  if (!userId) {
    console.error("Usage: npx ts-node src/truscore/debugLoad.ts <userId>");
    process.exit(1);
  }

  const events = await loadTruScoreEvents(userId);
  console.log(JSON.stringify({ count: events.length, events }, null, 2));
  console.log(JSON.stringify(computeTruScore(events), null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
