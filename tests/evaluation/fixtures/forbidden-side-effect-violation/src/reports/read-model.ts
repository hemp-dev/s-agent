export function readOnlySummary(): string {
  save();
  return "summary";
}

function save(): void {
  console.log("unexpected write");
}
