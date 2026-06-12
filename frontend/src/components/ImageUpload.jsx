import { useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';

/**
 * ImageUpload — reusable drag-and-drop / click-to-upload component.
 *
 * Props:
 *   currentUrl   string    — existing image URL to preview (optional)
 *   onUpload     fn(url)   — called with the Cloudinary secure_url after upload
 *   label        string    — label text shown above the dropzone
 *   aspectRatio  string    — 'square' | 'landscape' (default: 'landscape')
 */
const ImageUpload = ({ currentUrl = '', onUpload, label = 'Upload Image', aspectRatio = 'landscape' }) => {
    const [preview, setPreview] = useState(currentUrl);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;

        // Client-side validation
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            setError('Only JPEG, PNG, WebP, or GIF images are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5 MB.');
            return;
        }

        setError('');
        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        // Upload to backend → Cloudinary
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const { data } = await axiosInstance.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setPreview(data.url);
            onUpload(data.url);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
            setPreview(currentUrl); // revert preview on failure
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        handleFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const heightClass = aspectRatio === 'square' ? 'h-32 w-32 rounded-full' : 'h-44 w-full rounded-xl';

    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-bold text-brand-mid-gray uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}

            <div
                className={`relative border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center bg-brand-light-gray/50
                    ${heightClass}
                    ${dragOver ? 'border-brand-orange bg-brand-light-orange' : 'border-brand-border-gray hover:border-brand-orange hover:bg-brand-light-orange/50'}
                `}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg">
                                {uploading ? 'Uploading...' : 'Change Image'}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center pointer-events-none">
                        {uploading ? (
                            <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-8 h-8 text-brand-mid-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <p className="text-xs font-semibold text-brand-mid-gray">
                                    Drop image here or <span className="text-brand-orange">browse</span>
                                </p>
                                <p className="text-[10px] text-brand-mid-gray/70">JPEG, PNG, WebP · Max 5 MB</p>
                            </>
                        )}
                    </div>
                )}

                {/* Uploading spinner overlay when image already set */}
                {uploading && preview && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-600 font-semibold mt-1.5">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleInputChange}
            />
        </div>
    );
};

export default ImageUpload;
