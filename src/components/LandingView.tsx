"use client";

import NavBar from "./NavBar";
import PhotoUpload from "./PhotoUpload";
import TextInput from "./TextInput";
import ValuationResult, { type ValuationData } from "./ValuationResult";

type View = "landing" | "workstation" | "collection";
type InputMode = "photo" | "text";

interface LandingViewProps {
  onNavigate: (view: View) => void;
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  textQuery: string;
  onTextChange: (v: string) => void;
  onPhotoSelected: (base64: string) => void;
  onValuate: () => void;
  loading: boolean;
  canValuate: boolean;
  result: ValuationData | null;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  records: Array<{
    id: string;
    artist: string;
    album: string;
    coverImage?: string | null;
    lowestPriceMxn?: string | null;
  }>;
  uploadKey: number;
}

const crateRotations = ["-1.5deg", "0.8deg", "-0.5deg", "1.2deg", "-0.8deg", "0.4deg"];

export default function LandingView({
  onNavigate,
  mode,
  onModeChange,
  textQuery,
  onTextChange,
  onPhotoSelected,
  onValuate,
  loading,
  canValuate,
  result,
  onSave,
  saving,
  saved,
  records,
  uploadKey,
}: LandingViewProps) {
  return (
    <div className="view-landing">
      <NavBar activeView="landing" onNavigate={onNavigate} />

      {/* Hero */}
      <section
        className="hero-groove text-center relative overflow-hidden"
        style={{ padding: "80px 20px 40px" }}
      >
        <h1
          className="font-display font-black text-text relative z-1 mx-auto mb-4"
          style={{ fontSize: "3.2rem", lineHeight: 1.15, maxWidth: 600 }}
        >
          Know What Your{" "}
          <span className="text-terracotta">Records</span> Are Worth
        </h1>
        <p
          className="text-muted mx-auto relative z-1"
          style={{ fontSize: "1.1rem", maxWidth: 440, lineHeight: 1.6 }}
        >
          Snap a photo or search by name. Get real-time valuations powered by
          Discogs marketplace data.
        </p>
      </section>

      {/* Search section */}
      <section style={{ maxWidth: 560, margin: "40px auto 0", padding: "0 20px" }}>
        {/* Mode toggle */}
        <div
          className="flex justify-center gap-1 mx-auto w-fit mb-7"
          style={{
            background: "var(--card)",
            borderRadius: 14,
            padding: 4,
            border: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => onModeChange("photo")}
            className="cursor-pointer border-none font-semibold transition-all"
            style={{
              padding: "10px 28px",
              borderRadius: 11,
              fontSize: "0.88rem",
              background: mode === "photo" ? "var(--terracotta)" : "transparent",
              color: mode === "photo" ? "#fff" : "var(--muted)",
              boxShadow:
                mode === "photo" ? "0 2px 8px rgba(204, 85, 0, 0.25)" : "none",
            }}
          >
            Photo Search
          </button>
          <button
            onClick={() => onModeChange("text")}
            className="cursor-pointer border-none font-semibold transition-all"
            style={{
              padding: "10px 28px",
              borderRadius: 11,
              fontSize: "0.88rem",
              background: mode === "text" ? "var(--terracotta)" : "transparent",
              color: mode === "text" ? "#fff" : "var(--muted)",
              boxShadow:
                mode === "text" ? "0 2px 8px rgba(204, 85, 0, 0.25)" : "none",
            }}
          >
            Text Search
          </button>
        </div>

        {/* Input */}
        {mode === "photo" ? (
          <PhotoUpload
            key={uploadKey}
            variant="platter"
            onPhotoSelected={onPhotoSelected}
            disabled={loading}
          />
        ) : (
          <div className="flex flex-col gap-3.5" style={{ maxWidth: 480, margin: "0 auto" }}>
            <TextInput
              variant="landing"
              value={textQuery}
              onChange={onTextChange}
              onSubmit={onValuate}
              disabled={loading}
            />
            <button
              onClick={onValuate}
              disabled={!canValuate || loading}
              className="btn-gradient w-full"
              style={{ padding: "16px 32px", fontSize: "1rem", borderRadius: 14 }}
            >
              {loading ? "Valuating..." : "Valuate"}
            </button>
          </div>
        )}

        {/* Valuate button for photo mode */}
        {mode === "photo" && (
          <div className="flex justify-center mt-7">
            <button
              onClick={onValuate}
              disabled={!canValuate || loading}
              className="btn-gradient"
              style={{ padding: "16px 32px", fontSize: "1rem", borderRadius: 14 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Valuating...
                </span>
              ) : (
                "Valuate"
              )}
            </button>
          </div>
        )}
      </section>

      {/* Result */}
      {result && (
        <section style={{ maxWidth: 900, margin: "80px auto 0", padding: "0 20px 60px" }}>
          <h2
            className="font-display font-bold text-terracotta text-center mb-8"
            style={{ fontSize: "1.6rem" }}
          >
            Latest Valuation
          </h2>
          <ValuationResult
            variant="sleeve"
            data={result}
            onSave={onSave}
            saving={saving}
            saved={saved}
          />
        </section>
      )}

      {/* Collection crate */}
      {records.length > 0 && (
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px 100px" }}>
          <h2
            className="font-display font-bold text-terracotta text-center mb-8"
            style={{ fontSize: "1.6rem" }}
          >
            Your Collection
          </h2>
          <div
            className="flex justify-center relative"
            style={{ padding: "40px 20px 20px" }}
          >
            {records.slice(0, 6).map((rec, i) => (
              <div
                key={rec.id}
                className="flex-shrink-0 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:rotate-0 hover:z-10"
                style={{
                  width: 180,
                  marginLeft: i === 0 ? 0 : -24,
                  transform: `rotate(${crateRotations[i % crateRotations.length]})`,
                }}
                onClick={() => onNavigate("collection")}
              >
                <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
                  <div className="crate-vinyl-peek" />
                  {rec.coverImage ? (
                    <img
                      src={rec.coverImage}
                      alt={rec.album}
                      className="relative z-2 object-cover"
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 8,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    <div
                      className="relative z-2 flex items-center justify-center bg-card"
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 8,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="vinyl-logo" style={{ width: 40, height: 40 }} />
                    </div>
                  )}
                </div>
                <div className="text-center mt-2.5">
                  <div
                    className="text-terracotta font-bold uppercase truncate"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.03em" }}
                  >
                    {rec.artist}
                  </div>
                  <div className="font-display font-bold text-text truncate mt-0.5" style={{ fontSize: "0.82rem" }}>
                    {rec.album}
                  </div>
                  {rec.lowestPriceMxn && (
                    <div className="font-mono text-terracotta font-medium mt-1" style={{ fontSize: "0.75rem" }}>
                      {rec.lowestPriceMxn}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
