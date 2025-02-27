import React from "react";
import { toast } from "sonner";

export function useUploadFileToPinataHook() {
  const [isUploading, setIsUploading] = React.useState(false);

  const onUpload = async (files: File[]) => {
    const uploaded: string[] = [];
    setIsUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const options = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        };

        const response = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          options
        );

        const pinataResponse = await response.json();
        const fileUrl = pinataResponse.IpfsHash;

        if (!pinataResponse || !fileUrl) {
          throw new Error("Failed to upload file(s) to Pinata");
        }

        uploaded.push(fileUrl);
      }
      return uploaded;
    } catch (error) {
      console.error("Error uploading file(s) to Pinata:", error);
      toast.error("Failed to upload file(s) to Pinata.");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    onUpload,
    isUploading,
  };
}
