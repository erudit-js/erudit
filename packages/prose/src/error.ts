export class ProseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProseError';
    }
}
