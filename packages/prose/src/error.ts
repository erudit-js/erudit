export class EruditProseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EruditProseError';
  }
}
