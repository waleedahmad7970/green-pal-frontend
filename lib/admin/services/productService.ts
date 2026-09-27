// services/productService.ts
import apiClient from "@/lib/apiClient";

export interface Product {
    _id?: string;
    id?: string;
    model: string;
    productName: string;
    category: string;
    image: string;
    colors: string[];
    capacity: string;
    inputOutput: string;
    shellMaterial: string;
    outputInterface: string;
    inputInterface: string;
    protection: string[];
    converterEfficiency: string;
    chargeTime: string;
    batteryCycleTimes: string;
    batteryMaterial: string;
    maxChargeDischargeCurrent: string;
    certification: string;
    safetyPerformance: string;
    functionalCharacteristics: string;
    size: string;
    weight: string;
    packageSize: string;
    grossWeight: string;
    pricing: { qty: string; price: number }[];
}

export async function fetchProducts() {
    const response = await apiClient.get("/products");

    // Universal extractor: handles both wrapped Axios responses and auto-unwrapped interceptors
    const body = response?.data || response;
    const target = body?.data || body;

    return Array.isArray(target) ? target : [];
}

export async function createProduct(data: Product) {
    const response = await apiClient.post("/products", data);
    const body = response?.data || response;
    return body?.data || body;
}

export async function updateProduct(id: string, data: Partial<Product>) {
    const response = await apiClient.put(`/products/${id}`, data);
    const body = response?.data || response;
    return body?.data || body;
}

export async function deleteProduct(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response?.data || response;
}