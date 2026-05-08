export function readOnlySummary(): string {
  save();
  return "summary";
}

export function calculateDiscount(): number {
  const discount = 45;
  return discount;
}

function save(): void {
  return undefined;
}
