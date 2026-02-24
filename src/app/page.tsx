"use client";

import { useState, useEffect } from "react";
import { id } from "@instantdb/react";
import db from "@/lib/db";
import LandingView from "@/components/LandingView";
import WorkstationView from "@/components/WorkstationView";
import CollectionView from "@/components/CollectionView";
import { type ValuationData } from "@/components/ValuationResult";

type View = "landing" | "workstation" | "collection";
type InputMode = "photo" | "text";
type SortField = "date" | "price" | "demand";

const demandOrder: Record<string, number> = {
  High: 4,
  Good: 3,
  Medium: 2,
  Low: 1,
};

function parsePriceCents(price?: string): number {
  if (!price) return 0;
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num * 100;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [mode, setMode] = useState<InputMode>("photo");
  const [textQuery, setTextQuery] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sort, setSort] = useState<SortField>("date");
  const [uploadKey, setUploadKey] = useState(0);

  const { data, isLoading, error } = db.useQuery({ records: {} });
  const records = data?.records ?? [];

  const sorted = [...records].sort((a, b) => {
    switch (sort) {
      case "price":
        return (
          parsePriceCents(b.lowestPriceUsd ?? undefined) -
          parsePriceCents(a.lowestPriceUsd ?? undefined)
        );
      case "demand":
        return (
          (demandOrder[b.demand ?? ""] ?? 0) -
          (demandOrder[a.demand ?? ""] ?? 0)
        );
      case "date":
      default: {
        const aTime = a.valuatedAt ? new Date(a.valuatedAt).getTime() : 0;
        const bTime = b.valuatedAt ? new Date(b.valuatedAt).getTime() : 0;
        return bTime - aTime;
      }
    }
  });

  // Control body overflow for workstation view
  useEffect(() => {
    document.body.style.overflow =
      currentView === "workstation" ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [currentView]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentView]);

  function handleNavigate(view: View) {
    setCurrentView(view);
  }

  async function handleValuate() {
    setLoading(true);
    setResult(null);
    setSaved(false);

    // Switch to workstation when valuating
    if (currentView === "landing") {
      setCurrentView("workstation");
    }

    try {
      const body =
        mode === "photo"
          ? { type: "photo", photo: photoBase64 }
          : { type: "text", text: textQuery.trim() };

      const res = await fetch("/api/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const responseData = await res.json();
      setResult(responseData);
      // Reset inputs after valuation
      setPhotoBase64(null);
      setUploadKey((k) => k + 1);
      setTextQuery("");
    } catch {
      setResult({ success: false, error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result || !result.success) return;
    setSaving(true);
    try {
      db.transact(
        db.tx.records[id()].update({
          artist: result.artist!,
          album: result.album!,
          year: result.year,
          label: result.label,
          country: result.country,
          lowestPriceUsd: result.lowestPriceUsd,
          lowestPriceMxn: result.lowestPriceMxn,
          lowestPriceEur: result.lowestPriceEur,
          numForSale: result.numForSale,
          have: result.have,
          want: result.want,
          wantRatio: result.wantRatio,
          demand: result.demand,
          discogsUrl: result.discogsUrl,
          coverImage: result.coverImage,
          valuatedAt: Date.now(),
        })
      );
      setSaved(true);
    } catch {
      // silent fail — Instant will retry
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteRecord(recordId: string) {
    db.transact(db.tx.records[recordId].delete());
  }

  const canValuate =
    mode === "photo" ? !!photoBase64 : textQuery.trim().length > 0;

  return (
    <div data-view={currentView}>
      <LandingView
        onNavigate={handleNavigate}
        mode={mode}
        onModeChange={setMode}
        textQuery={textQuery}
        onTextChange={setTextQuery}
        onPhotoSelected={setPhotoBase64}
        onValuate={handleValuate}
        loading={loading}
        canValuate={canValuate}
        result={result}
        onSave={handleSave}
        saving={saving}
        saved={saved}
        records={sorted}
        uploadKey={uploadKey}
      />
      <WorkstationView
        onNavigate={handleNavigate}
        mode={mode}
        onModeChange={setMode}
        textQuery={textQuery}
        onTextChange={setTextQuery}
        onPhotoSelected={setPhotoBase64}
        onValuate={handleValuate}
        loading={loading}
        canValuate={canValuate}
        result={result}
        onSave={handleSave}
        saving={saving}
        saved={saved}
        records={sorted}
        sort={sort}
        onSortChange={setSort}
        onDeleteRecord={handleDeleteRecord}
        uploadKey={uploadKey}
      />
      <CollectionView
        onNavigate={handleNavigate}
        records={sorted}
        sort={sort}
        onSortChange={setSort}
        onDeleteRecord={handleDeleteRecord}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
