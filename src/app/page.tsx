"use client";

import { useState, useEffect, useCallback } from "react";
import LandingView from "@/components/LandingView";
import WorkstationView from "@/components/WorkstationView";
import CollectionView from "@/components/CollectionView";
import { type ValuationData } from "@/components/ValuationResult";

type View = "landing" | "workstation" | "collection";
type InputMode = "photo" | "text";
type SortField = "date" | "price" | "demand";

const STORAGE_KEY = "crate-check-records";

interface RecordEntry {
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
  coverImage?: string | null;
  discogsUrl?: string | null;
  valuatedAt?: string | number | null;
}

function useLocalRecords() {
  const [records, setRecords] = useState<RecordEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecords(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback((record: Omit<RecordEntry, "id">) => {
    const entry: RecordEntry = {
      ...record,
      id: crypto.randomUUID(),
    };
    setRecords((prev) => {
      const next = [entry, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { records, save, remove };
}

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

  const { records, save, remove } = useLocalRecords();

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

  useEffect(() => {
    document.body.style.overflow =
      currentView === "workstation" ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [currentView]);

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
      save({
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
      });
      setSaved(true);
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteRecord(recordId: string) {
    remove(recordId);
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
        isLoading={false}
        error={null}
      />
    </div>
  );
}
