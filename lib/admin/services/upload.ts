// services/uploads.ts
import apiClient from "@/lib/apiClient";
import { normalize } from "./utils";

interface UploadResult {
    url: string;
    folder: string;
}

export async function uploadImage(
    file: File,
    folder: "plans" | "products" = "products",
): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    // ADD THE HEADERS OBJECT HERE
    const response = await apiClient.post("/upload/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });

    return normalize<UploadResult>(response as any);
}