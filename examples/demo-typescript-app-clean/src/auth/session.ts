export interface Session {
  userId: string;
  startedAt: Date;
}

export function startSession(userId: string): Session {
  return {
    userId,
    startedAt: new Date()
  };
}
