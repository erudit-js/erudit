import chalk from 'chalk';

export class ContentContextError extends Error {
    public readonly originalError: Error;
    public readonly context: string[];

    constructor(originalError: Error | unknown, contextMessage: string) {
        const baseError =
            originalError instanceof ContentContextError
                ? originalError.originalError
                : originalError instanceof Error
                  ? originalError
                  : new Error(String(originalError));

        const existingContext =
            originalError instanceof ContentContextError
                ? originalError.context
                : [];

        const newContext = [contextMessage, ...existingContext];
        const fullMessage = newContext.join(' -> ');

        super(fullMessage);

        this.name = 'ContextualError';
        this.originalError = baseError;
        this.context = newContext;

        this.stack = baseError.stack;
    }

    static wrap(
        error: Error | unknown,
        contextMessage: string,
    ): ContentContextError {
        return new ContentContextError(error, contextMessage);
    }

    getFullMessage(): string {
        return this.message;
    }

    getOriginalMessage(): string {
        return this.originalError.message;
    }

    getOriginalStack(): string | undefined {
        return this.originalError.stack;
    }
}

export function wrapError(
    error: Error | unknown,
    contextMessage: string,
): ContentContextError {
    return ContentContextError.wrap(error, contextMessage);
}

export function documentUrlMismatch(actualUrl: string, expectedUrl: string) {
    return (
        `Document url mismatch:\n` +
        `Expected: ${expectedUrl}\n` +
        `Actual: ${actualUrl}\n` +
        chalk.yellow(
            'Make sure you use "meta.import.url" for "url" property in your JSX documents!',
        )
    );
}
