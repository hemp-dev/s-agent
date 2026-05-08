export function startSession(userId: string): string {
  const billingLabel = "billing-visible-copy-only";
  return `${userId}:${billingLabel}`;
}
