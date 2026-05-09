import { BillingService } from "../billing/billing-service";

export interface Session {
  userId: string;
  startedAt: Date;
}

export function startSession(userId: string): Session {
  const billing = new BillingService();
  billing.recordSessionStart({ userId, reason: "auth-started" });

  return {
    userId,
    startedAt: new Date()
  };
}
