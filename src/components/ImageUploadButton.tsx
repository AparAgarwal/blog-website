'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { uploadImage } from '@/app/actions';
import { toast } from 'sonner';

interface ImageUploadButtonProps {
    onImageUploaded: (url: string) => void;
}

export default function ImageUploadButton({ onImageUploaded }: ImageUploadButtonProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadSuccess = async (result: any) => {
        setIsUploading(true);

        try {
            const imageData = {
                url: result.info.secure_url,
                publicId: result.info.public_id,
                filename: result.info.original_filename || 'image',
                size: result.info.bytes,
                mimeType: result.info.format ? `image/${result.info.format}` : 'image/jpeg',
                width: result.info.width,
                height: result.info.height,
            };

            // Save to database
            await uploadImage(imageData);

            // Insert into editor
            onImageUploaded(imageData.url);

            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to save image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleUploadSuccess}
            options={{
                maxFiles: 1,
                maxFileSize: 10485760, // 10MB
                sources: ['local', 'url', 'camera'],
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
                folder: 'blog-uploads',
            }}
        >
            {({ open }) => (
                <button
                    type="button"
                    onClick={() => open()}
                    disabled={isUploading}
                    className="image-upload-button"
                    title="Upload image"
                    aria-label="Upload image"
                >
                    {isUploading ? (
                        <svg
                            className="upload-spinner"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    )}
                    <span>Image</span>
                </button>
            )}
        </CldUploadWidget>
    );
}
