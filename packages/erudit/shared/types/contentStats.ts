export interface ContentStats {
    /** Number of actual content items (topics and pages). */
    materials?: number;
    /** Keys are element schema names. Values are counts. */
    elements?: Record<string, number>;
}
