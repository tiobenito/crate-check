"use client";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  variant?: "landing" | "compact";
}

export default function TextInput({
  value,
  onChange,
  onSubmit,
  disabled,
  variant = "landing",
}: TextInputProps) {
  const isCompact = variant === "compact";

  return (
    <div className="flex flex-col" style={{ gap: isCompact ? 10 : 14 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onSubmit();
        }}
        placeholder="Artist, album, or catalog number..."
        disabled={disabled}
        className="w-full bg-white text-text outline-none transition-[border-color] duration-200 disabled:opacity-50"
        style={{
          padding: isCompact ? "12px 14px" : "16px 20px",
          border: "2px solid var(--border)",
          borderRadius: isCompact ? 12 : 16,
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: isCompact ? "0.88rem" : "1rem",
          color: "var(--text)",
        }}
        onFocus={(e) =>
          (e.target.style.borderColor = "var(--terracotta)")
        }
        onBlur={(e) =>
          (e.target.style.borderColor = "var(--border)")
        }
      />
      {variant === "landing" && (
        <p className="text-muted2 text-sm">
          Enter album name, artist, or both
        </p>
      )}
    </div>
  );
}
