// lib/contactService.ts
import apiClient from "@/lib/apiClient";
function normalize<T>(response: any): T {
  // Check if the response exists
  if (!response) {
    throw new Error("No response received from the server.");
  }

  // If the response is an Axios-style response containing a 'data' object
  if (response.data !== undefined) {
    return response.data as T;
  }

  // If it's already a raw JSON response from a standard fetch wrapper
  return response as T;
}
export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Submits the contact form data to the backend API.
 */
export async function submitContact(data: ContactPayload): Promise<ContactResponse> {
  const response = await apiClient.post("/contact", data);
  return normalize<ContactResponse>(response as any);
}