import apiClient from "@/lib/apiClient";

export async function uploadImageToS3(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file); // Must match the 'upload.single("image")' string

    try {
        const response: any = await apiClient.post("/upload/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data?.url || response.url;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
}