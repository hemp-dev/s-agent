export interface Session {
  userId: string;
}

export function startSession(userId: string): Session {
  return { userId };
}
