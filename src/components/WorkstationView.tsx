"use client";

import { useState } from "react";
import NavBar from "./NavBar";
import PhotoUpload from "./PhotoUpload";
import TextInput from "./TextInput";
import ValuationResult, { type ValuationData } from "./ValuationResult";
import RecordCard from "./RecordCard";
import RecordDetailModal, { type RecordDetail } from "./RecordDetailModal";

type View = "landing" | "workstation" | "collection";
type InputMode = "photo" | "text";
type SortField = "date" | "price" | "demand";

interface WorkstationViewProps {
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
  uploadKey: number;
}

export default function WorkstationView({
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
  sort,
  onSortChange,
  onDeleteRecord,
  uploadKey,
}: WorkstationViewProps) {
  const [selectedRecord, setSelectedRecord] = useState<RecordDetail | null>(null);

  return (
    <div className="view-workstation flex flex-col" style={{ height: "100vh", width: "100%" }}>
      <NavBar activeView="workstation" onNavigate={onNavigate} />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className="sidebar-accent relative flex flex-col overflow-y-auto"
          style={{
            width: "var(--sidebar-width)",
            minWidth: "var(--sidebar-width)",
            background: "var(--sidebar-bg)",
            borderRight: "1px solid var(--border)",
          }}
        >
          <div className="flex-1 flex flex-col" style={{ padding: "28px 24px" }}>
            {/* Section label */}
            <div
              className="text-terracotta font-bold uppercase mb-3.5"
              style={{ fontSize: "0.78rem", letterSpacing: "0.06em" }}
            >
              Identify a Record
            </div>

            {/* Mode toggle */}
            <div
              className="flex gap-0.5 mb-4"
              style={{
                background: "rgba(232, 220, 200, 0.6)",
                borderRadius: 10,
                padding: 3,
              }}
            >
              <button
                onClick={() => onModeChange("photo")}
                className="flex-1 cursor-pointer border-none font-semibold transition-all"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  background: mode === "photo" ? "var(--terracotta)" : "transparent",
                  color: mode === "photo" ? "#fff" : "var(--muted2)",
                  boxShadow:
                    mode === "photo"
                      ? "0 2px 8px rgba(204, 85, 0, 0.2)"
                      : "none",
                }}
              >
                Photo
              </button>
              <button
                onClick={() => onModeChange("text")}
                className="flex-1 cursor-pointer border-none font-semibold transition-all"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  background: mode === "text" ? "var(--terracotta)" : "transparent",
                  color: mode === "text" ? "#fff" : "var(--muted2)",
                  boxShadow:
                    mode === "text"
                      ? "0 2px 8px rgba(204, 85, 0, 0.2)"
                      : "none",
                }}
              >
                Text
              </button>
            </div>

            {/* Input */}
            {mode === "photo" ? (
              <PhotoUpload
                key={uploadKey}
                variant="compact"
                onPhotoSelected={onPhotoSelected}
                disabled={loading}
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                <TextInput
                  variant="compact"
                  value={textQuery}
                  onChange={onTextChange}
                  onSubmit={onValuate}
                  disabled={loading}
                />
                <button
                  onClick={onValuate}
                  disabled={!canValuate || loading}
                  className="btn-gradient w-full"
                  style={{
                    padding: "12px 20px",
                    fontSize: "0.85rem",
                    borderRadius: 10,
                  }}
                >
                  {loading ? "Valuating..." : "Valuate"}
                </button>
              </div>
            )}

            {/* Valuate button for photo mode */}
            {mode === "photo" && (
              <button
                onClick={onValuate}
                disabled={!canValuate || loading}
                className="btn-gradient w-full mt-4"
                style={{
                  padding: "12px 20px",
                  fontSize: "0.85rem",
                  borderRadius: 10,
                }}
              >
                {loading ? "Valuating..." : "Valuate"}
              </button>
            )}

            {/* Footer */}
            <div
              className="mt-auto pt-6 text-muted2 leading-relaxed"
              style={{ fontSize: "0.7rem" }}
            >
              <span className="block">Powered by Discogs data</span>
              <span className="block">Built with Claude Code</span>
            </div>
          </div>
        </aside>

        {/* Main panel */}
        <main
          className="flex-1 overflow-y-auto min-w-0 ws-scrollbar"
          style={{ padding: "36px 48px" }}
        >
          {/* Loading state — spinning vinyl */}
          {loading && !result && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="vinyl-spinner mb-5" />
              <p className="text-muted font-medium" style={{ fontSize: "0.95rem" }}>
                Identifying record...
              </p>
              <p className="text-muted2 mt-1" style={{ fontSize: "0.8rem" }}>
                Searching Discogs marketplace
              </p>
            </div>
          )}

          {/* Result */}
          {result && (
            <ValuationResult
              variant="workstation"
              data={result}
              onSave={onSave}
              saving={saving}
              saved={saved}
            />
          )}

          {/* Empty state when no result */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="vinyl-logo mb-4" style={{ width: 64, height: 64 }} />
              <h2 className="font-display font-bold text-text text-xl mb-2">
                Ready to valuate
              </h2>
              <p className="text-muted2 text-sm max-w-sm">
                Upload a photo or search by text in the sidebar to identify and
                valuate a vinyl record.
              </p>
            </div>
          )}

          {/* Collection section */}
          {records.length > 0 && (
            <>
              {/* Divider */}
              <div className="collection-divider mb-6">
                <span className="font-display font-bold text-terracotta whitespace-nowrap" style={{ fontSize: "1.1rem" }}>
                  Your Collection
                </span>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[0.85rem] font-semibold text-muted">
                  <strong className="text-text">{records.length}</strong> records
                  saved
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[0.78rem] text-muted2 font-medium">
                    Sort:
                  </span>
                  <div
                    className="flex gap-0.5"
                    style={{
                      background: "var(--card)",
                      borderRadius: 8,
                      padding: 3,
                      border: "1px solid var(--border)",
                    }}
                  >
                    {(["date", "price", "demand"] as SortField[]).map((field) => (
                      <button
                        key={field}
                        onClick={() => onSortChange(field)}
                        className="cursor-pointer border-none capitalize transition-all"
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          background:
                            sort === field ? "var(--terracotta)" : "transparent",
                          color: sort === field ? "#fff" : "var(--muted2)",
                          boxShadow:
                            sort === field
                              ? "0 1px 3px rgba(204, 85, 0, 0.2)"
                              : "none",
                        }}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div
                className="grid gap-5 pb-12 ws-grid-responsive"
                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
              >
                {records.map((rec) => (
                  <RecordCard
                    key={rec.id}
                    variant="grid"
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
            </>
          )}
        </main>
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
