import { chargeForSession } from "../billing/billing-service";

export function startSession(userId: string): string {
  chargeForSession(userId);
  return userId;
}
