export const ORDER_STATUSES = ["pending", "processing", "completed", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];