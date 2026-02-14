'use client';

import { useState, useEffect } from 'react';
import { getImages, deleteImage } from '@/app/actions';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

type ImageData = {
    id: string;
    url: string;
    publicId: string;
    filename: string;
    mimeType: string;
    width?: number | null;
    height?: number | null;
    createdAt: Date;
    uploadedBy: string;
};

export default function ImagesPage() {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        const data = await getImages();
        setImages(data);
        setLoading(false);
    };

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Image URL copied to clipboard!');
        } catch (_error) {
            toast.error('Failed to copy URL');
        }
    };

    const handleCopyMarkdown = async (url: string) => {
        try {
            await navigator.clipboard.writeText(`![image](${url})`);
            toast.success('Markdown copied to clipboard!');
        } catch (_error) {
            toast.error('Failed to copy markdown');
        }
    };

    const handleDelete = async (id: string, publicId: string) => {
        if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
            return;
        }

        setDeleting(id);
        const result = await deleteImage(id, publicId);

        if (result.success) {
            toast.success(result.message);
            setImages((prev) => prev.filter((img) => img.id !== id));
        } else {
            toast.error(result.message);
        }
        setDeleting(null);
    };

    return (
        <div className="container" style={{ paddingBottom: 80 }}>
            <div className="admin-header">
                <div>
                    <h1>Image Gallery</h1>
                    <p className="subtitle">Manage all uploaded images</p>
                </div>
                <Link href="/admin" className="btn btn-secondary">
                    ← Back to Admin
                </Link>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading images...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <h2>No images yet</h2>
                    <p>Upload images by creating a new post or pasting them directly into the editor.</p>
                    <Link href="/admin/new" className="btn btn-primary">
                        Create New Post
                    </Link>
                </div>
            ) : (
                <div className="image-grid">
                    {images.map((image) => (
                        <div key={image.id} className="image-card">
                            <div className="image-preview">
                                <Image
                                    src={image.url}
                                    alt={image.filename}
                                    width={image.width || 400}
                                    height={image.height || 300}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            <div className="image-info">
                                <div className="image-meta">
                                    <p className="image-filename" title={image.filename}>
                                        {image.filename}
                                    </p>
                                    <p className="image-date">{new Date(image.createdAt).toLocaleDateString()}</p>
                                    {image.width && image.height && (
                                        <p className="image-dimensions">
                                            {image.width} × {image.height}
                                        </p>
                                    )}
                                </div>

                                <div className="image-actions">
                                    <button
                                        onClick={() => handleCopyUrl(image.url)}
                                        className="btn-icon"
                                        title="Copy URL"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleCopyMarkdown(image.url)}
                                        className="btn-icon"
                                        title="Copy Markdown"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id, image.publicId)}
                                        className="btn-icon btn-danger"
                                        title="Delete"
                                        disabled={deleting === image.id}
                                    >
                                        {deleting === image.id ? (
                                            <div className="spinner-sm" />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
