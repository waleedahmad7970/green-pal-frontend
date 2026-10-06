
import type { OrderStatus } from "@/lib/admin/constants/orderStatus";
import type { InvoiceStatus } from "@/lib/admin/constants/invoiceStatus";
export type { OrderStatus };
export type { InvoiceStatus };
export interface PaymentDetails {
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentMethod?: string;
  cardBrand?: string;
  last4?: string;
  receiptUrl?: string;
}

export interface UserRef {
  _id: string;
  name?: string;
  email?: string;
}

export interface Order {
  _id: string;
  id?: string; // Fallback mapping
  user?: UserRef | string;
  customerName: string;
  customerEmail?: string;
  locationId?: string;
  product?: string;
  item?: string;
  quantity?: number;
  total?: number;
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
}

export type LocationStatus = "live" | "installing" | "offline";

export interface Location {
  id: string;
  name: string;
  image: string;
  venue: string;
  city: string;
  bays: number;
  status: LocationStatus;
  installedAt: string;
}

export interface Purchase {
  id: string;
  supplier: string;
  item: string;
  quantity: number;
  cost: number;
  purchasedAt: string;
  received: boolean;
}


export interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
}

export interface MonthlyStat {
  month: string;
  revenue: number;
  orders: number;
  uptime: number;
}

export interface Product {
  id?: string;
  _id?: string;
  model: string;
  productName: string;
  category: string;
  image: string;
  slots: number;
  stationColor: string[];
  maxPower: string;
  networkSupport: string;
  material: string;
  powerInput: string;
  powerProtection: string;
  certification: string;
  singlePowerOutput: string;
  adsSizeAndResolution: string;
  temperature: string;
  workingHumidity: string;
  paymentMethods: string[];
  functionalCharacteristics: string;
  weight: string;
  singleGrossWeight: string;
  packageSize: string;
  price: number
  //pricing: { qty: string; price: number }[];
}


export interface Plan {
  id: string;
  model: string;
  productName: string;
  category: string;
  image: string;
  slots: number;
  stationColor: string[];
  maxPower: string;
  networkSupport: string;
  material: string;
  powerInput: string;
  powerProtection: string;
  certification: string;
  singlePowerOutput: string;
  adsSizeAndResolution: string;
  temperature: string;
  workingHumidity: string;
  paymentMethods: string[];
  functionalCharacteristics: string;
  weight: string;
  singleGrossWeight: string;
  packageSize: string;
  price: number
  //pricing: { qty: string; price: number }[];
}
