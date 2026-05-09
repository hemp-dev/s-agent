export interface BillingEvent {
  userId: string;
  reason: string;
}

export class BillingService {
  recordSessionStart(event: BillingEvent): void {
    console.log("billing session event", event.userId, event.reason);
  }
}
