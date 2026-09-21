/**
 * Converts MongoDB `_id` into the frontend `id` field.
 */
export function normalize<T>(doc: unknown): T {
  const value = doc as Record<string, unknown>;

  const { _id, id, ...rest } = value;

  return {
    ...rest,
    id: String(_id ?? id ?? ""),
  } as T;
}

/**
 * Normalizes a list of MongoDB documents.
 */
export function normalizeList<T>(docs: unknown[]): T[] {
  return docs.map((doc) => normalize<T>(doc));
}
