"use client";

import DemandBadge from "./DemandBadge";

export interface RecordDetail {
  id: string;
  artist: string;
  album: string;
  year?: string | null;
  label?: string | null;
  country?: string | null;
  lowestPriceUsd?: string | null;
  lowestPriceMxn?: string | null;
  lowestPriceEur?: string | null;
  numForSale?: number | null;
  have?: number | null;
  want?: number | null;
  wantRatio?: string | null;
  demand?: string | null;
  discogsUrl?: string | null;
  coverImage?: string | null;
  valuatedAt?: string | number | null;
}

interface RecordDetailModalProps {
  record: RecordDetail;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function RecordDetailModal({
  record,
  onClose,
  onDelete,
}: RecordDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(44, 24, 16, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[90vh] overflow-y-auto ws-scrollbar"
        style={{
          maxWidth: 720,
          margin: "0 20px",
          background: "var(--card)",
          borderRadius: 24,
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-all"
          style={{
            background: "rgba(253, 246, 227, 0.9)",
            color: "var(--muted)",
            fontSize: "1.2rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(253, 246, 227, 0.9)";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          &times;
        </button>

        {/* Album art header */}
        <div className="relative overflow-hidden" style={{ borderRadius: "24px 24px 0 0" }}>
          {record.coverImage ? (
            <div className="relative" style={{ height: 320 }}>
              {/* Blurred background */}
              <img
                src={record.coverImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "blur(40px) brightness(0.6)", transform: "scale(1.3)" }}
              />
              {/* Album art centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={record.coverImage}
                    alt={`${record.artist} - ${record.album}`}
                    className="relative z-2 object-cover"
                    style={{
                      width: 240,
                      height: 240,
                      borderRadius: 12,
                      boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                    }}
                  />
                  <div className="modal-vinyl-peek" />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: 200, background: "var(--bg)" }}
            >
              <div className="vinyl-logo" style={{ width: 80, height: 80 }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "28px 36px 36px" }}>
          {/* Tags row */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {record.demand && <DemandBadge demand={record.demand} />}
            {record.year && (
              <span
                className="text-[0.78rem] font-semibold text-muted"
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  background: "rgba(196, 168, 130, 0.15)",
                }}
              >
                {record.year}
              </span>
            )}
          </div>

          {/* Artist / Album */}
          <div
            className="text-[0.9rem] font-bold text-terracotta uppercase mb-1"
            style={{ letterSpacing: "0.05em" }}
          >
            {record.artist}
          </div>
          <div className="font-display font-black text-[1.8rem] text-text leading-tight mb-1">
            {record.album}
          </div>

          {/* Label / Country */}
          {(record.label || record.country) && (
            <div className="text-[0.85rem] text-muted2 mb-6">
              {[record.label, record.country].filter(Boolean).join(" \u2022 ")}
            </div>
          )}

          {/* Pricing section */}
          <div className="mb-6">
            <div
              className="text-[0.72rem] font-bold text-muted2 uppercase mb-3"
              style={{ letterSpacing: "0.06em" }}
            >
              Market Pricing
            </div>
            <div
              style={{
                background: "var(--bg)",
                borderRadius: 14,
                padding: "16px 20px",
                border: "1px solid var(--border)",
              }}
            >
              {record.lowestPriceMxn && (
                <div className="flex items-baseline justify-between py-1.5">
                  <span className="text-[0.85rem] text-muted">MXN</span>
                  <span className="font-mono font-bold text-[1.3rem] text-terracotta">
                    {record.lowestPriceMxn}
                  </span>
                </div>
              )}
              {record.lowestPriceUsd && (
                <div className="flex items-baseline justify-between py-1.5">
                  <span className="text-[0.85rem] text-muted">USD</span>
                  <span className="font-mono font-semibold text-[1rem] text-text">
                    {record.lowestPriceUsd}
                  </span>
                </div>
              )}
              {record.lowestPriceEur && (
                <div className="flex items-baseline justify-between py-1.5">
                  <span className="text-[0.85rem] text-muted">EUR</span>
                  <span className="font-mono font-semibold text-[1rem] text-text">
                    {record.lowestPriceEur}
                  </span>
                </div>
              )}
              {!record.lowestPriceMxn && !record.lowestPriceUsd && !record.lowestPriceEur && (
                <div className="text-[0.85rem] text-muted2 text-center py-2">
                  No pricing data available
                </div>
              )}
            </div>
          </div>

          {/* Market stats */}
          {(record.numForSale != null || record.have != null || record.want != null) && (
            <div className="mb-6">
              <div
                className="text-[0.72rem] font-bold text-muted2 uppercase mb-3"
                style={{ letterSpacing: "0.06em" }}
              >
                Market Stats
              </div>
              <div className="flex gap-3 flex-wrap">
                {record.numForSale != null && (
                  <div
                    className="flex-1 text-center"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      minWidth: 100,
                    }}
                  >
                    <div className="font-mono font-bold text-[1.2rem] text-text">
                      {record.numForSale}
                    </div>
                    <div className="text-[0.72rem] text-muted2 font-medium mt-0.5">
                      For Sale
                    </div>
                  </div>
                )}
                {record.have != null && (
                  <div
                    className="flex-1 text-center"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      minWidth: 100,
                    }}
                  >
                    <div className="font-mono font-bold text-[1.2rem] text-text">
                      {record.have}
                    </div>
                    <div className="text-[0.72rem] text-muted2 font-medium mt-0.5">
                      Have
                    </div>
                  </div>
                )}
                {record.want != null && (
                  <div
                    className="flex-1 text-center"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--border)",
                      minWidth: 100,
                    }}
                  >
                    <div className="font-mono font-bold text-[1.2rem] text-text">
                      {record.want}
                    </div>
                    <div className="text-[0.72rem] text-muted2 font-medium mt-0.5">
                      Want
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Valuated date */}
          {record.valuatedAt && (
            <div className="text-[0.78rem] text-muted2 mb-6">
              Valuated {new Date(record.valuatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {record.discogsUrl && (
              <a
                href={record.discogsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient inline-flex items-center"
              >
                View on Discogs &rarr;
              </a>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(record.id);
                  onClose();
                }}
                className="btn-outline"
                style={{ color: "var(--demand-low)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--demand-low)";
                  e.currentTarget.style.background = "rgba(198, 40, 40, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                Remove from Collection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
