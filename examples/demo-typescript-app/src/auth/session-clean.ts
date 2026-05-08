export interface CleanSession {
  userId: string;
  startedAt: Date;
}

export function startCleanSession(userId: string): CleanSession {
  return {
    userId,
    startedAt: new Date()
  };
}
