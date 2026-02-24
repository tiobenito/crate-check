"use client";

import DemandBadge from "./DemandBadge";

export interface ValuationData {
  success: boolean;
  artist?: string;
  album?: string;
  year?: string;
  label?: string;
  country?: string;
  lowestPriceUsd?: string;
  lowestPriceMxn?: string;
  lowestPriceEur?: string;
  numForSale?: number;
  have?: number;
  want?: number;
  wantRatio?: string;
  demand?: string;
  discogsUrl?: string;
  coverImage?: string;
  error?: string;
}

interface ValuationResultProps {
  data: ValuationData;
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
  variant?: "sleeve" | "workstation";
}

export default function ValuationResult({
  data,
  onSave,
  saving,
  saved,
  variant = "sleeve",
}: ValuationResultProps) {
  if (!data.success) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          border: "1px solid rgba(198, 40, 40, 0.3)",
          background: "rgba(198, 40, 40, 0.06)",
        }}
      >
        <p className="font-medium" style={{ color: "var(--demand-low)" }}>
          {data.error || "Record not found"}
        </p>
        <p className="text-muted2 text-sm mt-2">
          Try a different photo or search term
        </p>
      </div>
    );
  }

  if (variant === "sleeve") {
    return <SleeveResult data={data} onSave={onSave} saving={saving} saved={saved} />;
  }

  return <WorkstationResult data={data} onSave={onSave} saving={saving} saved={saved} />;
}

function SleeveResult({
  data,
  onSave,
  saving,
  saved,
}: {
  data: ValuationData;
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
}) {
  return (
    <div
      className="flex gap-12 items-start"
      style={{
        background: "var(--card)",
        borderRadius: 20,
        padding: 40,
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      }}
    >
      {/* Album art with vinyl peek */}
      {data.coverImage && (
        <div className="relative flex-shrink-0" style={{ width: 280, height: 280 }}>
          <img
            src={data.coverImage}
            alt={`${data.artist} - ${data.album}`}
            className="object-cover relative z-2"
            style={{
              width: 280,
              height: 280,
              borderRadius: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              transform: "rotate(-2deg)",
            }}
          />
          <div className="sleeve-vinyl-peek" />
        </div>
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        {/* Meta tags */}
        <div className="flex gap-2 mb-3.5 flex-wrap">
          {data.demand && <DemandBadge demand={data.demand} />}
          {(data.country || data.year) && (
            <span
              className="text-[0.78rem] font-semibold text-muted"
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                background: "rgba(196, 168, 130, 0.15)",
              }}
            >
              {[data.country, data.year].filter(Boolean).join(", ")}
            </span>
          )}
        </div>

        {/* Artist / Album */}
        <div
          className="text-[0.9rem] font-bold text-terracotta uppercase mb-1"
          style={{ letterSpacing: "0.05em" }}
        >
          {data.artist}
        </div>
        <div className="font-display font-black text-2xl text-text mb-1">
          {data.album}
        </div>
        {data.label && (
          <div className="text-[0.82rem] text-muted2 mb-6">{data.label}</div>
        )}

        {/* Tracklist pricing */}
        <div className="mb-6">
          {data.lowestPriceMxn && (
            <TracklistRow side="A1" label="Median Price (MXN)" value={data.lowestPriceMxn} primary />
          )}
          {data.lowestPriceUsd && (
            <TracklistRow side="A2" label="Median Price (USD)" value={data.lowestPriceUsd} />
          )}
          {data.lowestPriceEur && (
            <TracklistRow side="A3" label="Median Price (EUR)" value={data.lowestPriceEur} />
          )}
          {data.numForSale !== undefined && (
            <TracklistRow side="B1" label="For Sale" value={String(data.numForSale)} />
          )}
          {data.have !== undefined && data.want !== undefined && (
            <TracklistRow
              side="B2"
              label="Have / Want"
              value={`${data.have} / ${data.want}`}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <SaveButton onSave={onSave} saving={saving} saved={saved} />
          {data.discogsUrl && (
            <a
              href={data.discogsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center"
            >
              View on Discogs &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkstationResult({
  data,
  onSave,
  saving,
  saved,
}: {
  data: ValuationData;
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
}) {
  return (
    <div>
      {/* Result header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div
          className="flex items-center justify-center text-white text-[0.85rem] font-bold flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--demand-high), #43A047)",
          }}
        >
          &#10003;
        </div>
        <h2 className="font-display font-bold text-[1.3rem] text-text">
          Valuation Result
        </h2>
      </div>

      {/* Result card */}
      <div
        className="flex gap-9 items-start mb-12"
        style={{
          background: "var(--card)",
          borderRadius: 20,
          padding: 32,
          border: "1px solid var(--border)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
        }}
      >
        {/* Art + vinyl */}
        {data.coverImage && (
          <div className="relative flex-shrink-0" style={{ width: 280, height: 280, marginRight: 40 }}>
            <img
              src={data.coverImage}
              alt={`${data.artist} - ${data.album}`}
              className="object-cover relative z-2"
              style={{
                width: 280,
                height: 280,
                borderRadius: 12,
                boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
              }}
            />
            <div className="ws-result-vinyl" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {data.demand && <DemandBadge demand={data.demand} />}
            {(data.country || data.year) && (
              <span
                className="text-[0.78rem] font-semibold text-muted"
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  background: "rgba(196, 168, 130, 0.15)",
                }}
              >
                {[data.country, data.year].filter(Boolean).join(", ")}
              </span>
            )}
          </div>

          {/* Artist / Album */}
          <div
            className="text-[0.9rem] font-bold text-terracotta uppercase mb-1"
            style={{ letterSpacing: "0.05em" }}
          >
            {data.artist}
          </div>
          <div className="font-display font-black text-[1.6rem] text-text mb-0.5 leading-tight">
            {data.album}
          </div>
          {data.label && (
            <div className="text-[0.82rem] text-muted2 mb-5">{data.label}</div>
          )}

          {/* Primary price */}
          {data.lowestPriceMxn && (
            <div>
              <div className="font-mono font-bold text-[2.2rem] text-terracotta leading-none mb-1.5">
                {data.lowestPriceMxn}
              </div>
              <div
                className="text-[0.72rem] font-semibold text-muted2 uppercase"
                style={{ letterSpacing: "0.05em" }}
              >
                Median sale price
              </div>
            </div>
          )}

          {/* Secondary prices */}
          <div className="flex gap-4 mt-2 mb-5">
            {data.lowestPriceUsd && (
              <span className="font-mono text-[0.88rem] font-medium text-muted">
                USD {data.lowestPriceUsd}
              </span>
            )}
            {data.lowestPriceUsd && data.lowestPriceEur && (
              <span className="text-muted">&middot;</span>
            )}
            {data.lowestPriceEur && (
              <span className="font-mono text-[0.88rem] font-medium text-muted">
                EUR {data.lowestPriceEur}
              </span>
            )}
          </div>

          {/* Stats chips */}
          <div className="flex gap-2.5 mb-6 flex-wrap">
            {data.numForSale !== undefined && (
              <span
                className="text-[0.78rem] font-semibold text-muted flex items-center gap-1.5"
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  background: "rgba(196, 168, 130, 0.12)",
                }}
              >
                <span className="font-mono font-bold text-text">{data.numForSale}</span> for
                sale
              </span>
            )}
            {data.have !== undefined && data.want !== undefined && (
              <span
                className="text-[0.78rem] font-semibold text-muted flex items-center gap-1.5"
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  background: "rgba(196, 168, 130, 0.12)",
                }}
              >
                <span className="font-mono font-bold text-text">{data.have}</span> have
                &middot;{" "}
                <span className="font-mono font-bold text-text">{data.want}</span> want
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <SaveButton onSave={onSave} saving={saving} saved={saved} />
            {data.discogsUrl && (
              <a
                href={data.discogsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center"
              >
                View on Discogs &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TracklistRow({
  side,
  label,
  value,
  primary,
}: {
  side: string;
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div className="tracklist-row">
      <span className="tracklist-side">{side}</span>
      <span className="tracklist-label">{label}</span>
      <span className="tracklist-dots" />
      <span className={`tracklist-value ${primary ? "primary" : ""}`}>{value}</span>
    </div>
  );
}

function SaveButton({
  onSave,
  saving,
  saved,
}: {
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
}) {
  if (saved) {
    return (
      <button
        disabled
        className="cursor-default"
        style={{
          padding: "12px 24px",
          borderRadius: 12,
          fontSize: "0.88rem",
          fontWeight: 700,
          background: "rgba(46, 125, 50, 0.1)",
          color: "var(--demand-high)",
          border: "none",
        }}
      >
        Saved!
      </button>
    );
  }

  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="btn-gradient"
    >
      {saving ? "Saving..." : "Save to Collection"}
    </button>
  );
}
