"use client";

import { useCallback, useState, useRef } from "react";

interface PhotoUploadProps {
  onPhotoSelected: (base64: string) => void;
  disabled?: boolean;
  variant?: "platter" | "compact";
}

export default function PhotoUpload({
  onPhotoSelected,
  disabled,
  variant = "platter",
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64 = result.split(",")[1];
        onPhotoSelected(base64);
      };
      reader.readAsDataURL(file);
    },
    [onPhotoSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleClear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (variant === "platter") {
    return (
      <div className="flex flex-col items-center">
        <div
          className={`record-platter ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          style={isDragging ? { borderColor: "var(--bright)", transform: "scale(1.02)" } : {}}
        >
          {preview ? (
            <img
              src={preview}
              alt="Record preview"
              className="w-full h-full object-cover rounded-full absolute inset-0"
              style={{ zIndex: 2 }}
            />
          ) : (
            <>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.5, marginBottom: 12 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-base font-semibold text-text mb-1">
                Place your record here
              </span>
              <span className="text-[0.8rem] text-muted2">
                Click or drag to upload a photo
              </span>
              <div className="flex gap-1.5 mt-3.5">
                {["JPG", "PNG", "HEIC", "WebP"].map((fmt) => (
                  <span
                    key={fmt}
                    className="font-mono text-[0.65rem] font-medium px-2 py-0.5 rounded-md text-muted"
                    style={{ background: "rgba(196, 168, 130, 0.2)" }}
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        {preview && !disabled && (
          <button
            onClick={handleClear}
            className="mt-3 text-sm text-muted2 hover:text-terracotta transition-colors cursor-pointer bg-transparent border-none"
          >
            Clear photo
          </button>
        )}
      </div>
    );
  }

  // Compact variant (workstation sidebar)
  return (
    <div>
      <div
        className={`text-center cursor-pointer transition-all duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{
          border: "2px dashed var(--terracotta)",
          borderRadius: 14,
          padding: "32px 16px",
          background: "rgba(204, 85, 0, 0.03)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Record preview"
            className="mx-auto max-h-36 rounded-lg object-contain"
          />
        ) : (
          <>
            <div className="text-[1.8rem] mb-2 opacity-50">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="text-[0.85rem] font-semibold text-muted mb-1">
              Upload a photo
            </div>
            <div className="text-[0.72rem] text-muted2">
              Click or drag and drop
            </div>
            <div className="flex gap-1 justify-center mt-2.5">
              {["JPG", "PNG", "HEIC", "WebP"].map((fmt) => (
                <span
                  key={fmt}
                  className="font-mono text-[0.6rem] font-medium px-1.5 py-0.5 rounded text-muted2"
                  style={{ background: "rgba(196, 168, 130, 0.2)" }}
                >
                  {fmt}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      {preview && !disabled && (
        <button
          onClick={handleClear}
          className="mt-2 text-xs text-muted2 hover:text-terracotta transition-colors cursor-pointer bg-transparent border-none"
        >
          Clear photo
        </button>
      )}
    </div>
  );
}
