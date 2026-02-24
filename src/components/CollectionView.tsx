"use client";

import { useState } from "react";
import NavBar from "./NavBar";
import RecordCard from "./RecordCard";
import RecordDetailModal, { type RecordDetail } from "./RecordDetailModal";

type View = "landing" | "workstation" | "collection";
type SortField = "date" | "price" | "demand";

interface CollectionViewProps {
  onNavigate: (view: View) => void;
  records: Array<{
    id: string;
    artist: string;
    album: string;
    year?: string | null;
    label?: string | null;
    country?: string | null;
    lowestPriceMxn?: string | null;
    lowestPriceUsd?: string | null;
    lowestPriceEur?: string | null;
    numForSale?: number | null;
    have?: number | null;
    want?: number | null;
    wantRatio?: string | null;
    demand?: string | null;
    coverImage?: string | null;
    discogsUrl?: string | null;
    valuatedAt?: string | number | null;
  }>;
  sort: SortField;
  onSortChange: (sort: SortField) => void;
  onDeleteRecord: (id: string) => void;
  isLoading: boolean;
  error: unknown;
}

export default function CollectionView({
  onNavigate,
  records,
  sort,
  onSortChange,
  onDeleteRecord,
  isLoading,
  error,
}: CollectionViewProps) {
  const [selectedRecord, setSelectedRecord] = useState<RecordDetail | null>(null);

  if (error) {
    return (
      <div className="view-collection">
        <NavBar activeView="collection" onNavigate={onNavigate} />
        <div className="text-center py-20">
          <p style={{ color: "var(--demand-low)" }}>Failed to load collection</p>
          <p className="text-muted2 text-sm mt-1">Check your Instant App ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-collection">
      <NavBar activeView="collection" onNavigate={onNavigate} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 100px" }}>
        {/* Header */}
        <div className="flex items-end justify-between mb-9 flex-wrap gap-4">
          <div>
            <h1
              className="font-display font-black text-text leading-none"
              style={{ fontSize: "2.4rem" }}
            >
              My Collection
            </h1>
            <p className="text-muted2 mt-1.5" style={{ fontSize: "1rem" }}>
              {records.length} record{records.length !== 1 && "s"} saved
            </p>
          </div>
          {records.length > 0 && (
            <div className="flex items-center gap-2.5">
              <span className="text-[0.85rem] text-muted2 font-medium">
                Sort by:
              </span>
              <div
                className="flex gap-0.5"
                style={{
                  background: "var(--card)",
                  borderRadius: 10,
                  padding: 4,
                  border: "1px solid var(--border)",
                }}
              >
                {(
                  [
                    { field: "date" as SortField, label: "Date Added" },
                    { field: "price" as SortField, label: "Price" },
                    { field: "demand" as SortField, label: "Demand" },
                  ] as const
                ).map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => onSortChange(field)}
                    className="cursor-pointer border-none transition-all"
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      background:
                        sort === field ? "var(--terracotta)" : "transparent",
                      color: sort === field ? "#fff" : "var(--muted2)",
                      boxShadow:
                        sort === field
                          ? "0 2px 6px rgba(204, 85, 0, 0.2)"
                          : "none",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="vinyl-spinner mx-auto mb-4" />
            <p className="text-muted2 mt-3">Loading collection...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <div className="vinyl-logo mx-auto mb-4" style={{ width: 64, height: 64 }} />
            <p className="font-display font-bold text-text text-lg mb-2">
              No records yet
            </p>
            <p className="text-muted2 mb-6">
              Valuate your first record and save it to start your collection!
            </p>
            <button
              onClick={() => onNavigate("workstation")}
              className="btn-gradient"
            >
              Valuate a Record
            </button>
          </div>
        ) : (
          <div
            className="grid gap-6 coll-grid-responsive"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {records.map((rec) => (
              <RecordCard
                key={rec.id}
                variant="collection"
                artist={rec.artist}
                album={rec.album}
                year={rec.year ?? undefined}
                lowestPriceMxn={rec.lowestPriceMxn ?? undefined}
                lowestPriceUsd={rec.lowestPriceUsd ?? undefined}
                demand={rec.demand ?? undefined}
                coverImage={rec.coverImage ?? undefined}
                onDelete={() => onDeleteRecord(rec.id)}
                onClick={() => setSelectedRecord(rec as RecordDetail)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Record detail modal */}
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDelete={(id) => {
            onDeleteRecord(id);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
}
