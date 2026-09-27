/**
 * Normalizes a MongoDB document, converting `_id` to a string.
 */
export function normalize<T>(doc: unknown): T {
  const value = doc as Record<string, unknown>;

  return {
    ...value,
    _id: value._id ? String(value._id) : undefined,
  } as T;
}

/**
 * Normalizes a list of MongoDB documents.
 */
export function normalizeList<T>(docs: unknown[]): T[] {
  return docs.map((doc) => normalize<T>(doc));
}