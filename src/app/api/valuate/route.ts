import { NextRequest, NextResponse } from "next/server";

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface RecordMetadata {
  success: boolean;
  artist?: string;
  album?: string;
  year?: string | null;
  label?: string | null;
  catalog_number?: string | null;
  confidence?: string;
  notes?: string;
  error?: string;
}

async function extractFromPhoto(base64: string): Promise<RecordMetadata> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64,
              },
            },
            {
              type: "text",
              text: `You are analyzing a vinyl record photo for a collector. Extract the following information from the record label, cover, or spine visible in the image:

1. Artist name
2. Album title
3. Year (if visible)
4. Record label (e.g., Musart, Peerless, Discos CBS)
5. Catalog number (if visible)

Return ONLY valid JSON in this exact format, no other text:
{
  "artist": "Artist Name",
  "album": "Album Title",
  "year": "1984" or null,
  "label": "Record Label" or null,
  "catalog_number": "ABC-123" or null,
  "confidence": "high" or "medium" or "low",
  "notes": "Any relevant notes about what you could or couldn't read"
}

If you cannot identify the record at all, return:
{
  "error": "Could not identify record",
  "notes": "Explanation of what was visible"
}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const claudeData = await response.json();
  const content = claudeData.content[0].text;

  let jsonStr = content;
  if (content.includes("```")) {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) jsonStr = match[1];
  }

  const metadata = JSON.parse(jsonStr.trim());

  if (metadata.error) {
    return { success: false, error: metadata.error, notes: metadata.notes };
  }

  return {
    success: true,
    artist: metadata.artist,
    album: metadata.album,
    year: metadata.year,
    label: metadata.label,
    catalog_number: metadata.catalog_number,
    confidence: metadata.confidence,
    notes: metadata.notes,
  };
}

function parseTextQuery(text: string): RecordMetadata {
  let artist = null;
  let album = null;

  if (text.toLowerCase().includes(" by ")) {
    const parts = text.split(/ by /i);
    album = parts[0].trim();
    artist = parts[1].trim();
  } else if (text.includes(" - ")) {
    const parts = text.split(" - ");
    artist = parts[0].trim();
    album = parts[1].trim();
  } else {
    album = text;
  }

  return { success: true, artist: artist ?? undefined, album: album ?? undefined };
}

async function discogsSearch(artist: string | undefined, album: string): Promise<{
  found: boolean;
  release_id?: number;
  cover_image?: string;
}> {
  const q = [album, artist].filter(Boolean).join(" ");
  const url = new URL("https://api.discogs.com/database/search");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "release");
  url.searchParams.set("format", "vinyl");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Discogs token=${DISCOGS_TOKEN}` },
  });

  if (!res.ok) throw new Error(`Discogs search error: ${res.status}`);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    return { found: false };
  }

  // Prefer a result that matches the year if we have one
  const best = data.results[0];
  return {
    found: true,
    release_id: best.id,
    cover_image: best.cover_image,
  };
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ success: false, error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }
  if (!DISCOGS_TOKEN) {
    return NextResponse.json({ success: false, error: "DISCOGS_TOKEN not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { type, photo, text } = body;

    // Step 1: Identify the record
    let metadata: RecordMetadata;
    if (type === "photo" && photo) {
      metadata = await extractFromPhoto(photo);
    } else if (type === "text" && text) {
      metadata = parseTextQuery(text.trim());
    } else {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    if (!metadata.success) {
      return NextResponse.json({ success: false, error: metadata.error || "Could not identify record" });
    }

    if (!metadata.album) {
      return NextResponse.json({ success: false, error: "Could not determine album name" });
    }

    // Step 2: Find on Discogs
    const searchResult = await discogsSearch(metadata.artist, metadata.album);

    if (!searchResult.found || !searchResult.release_id) {
      return NextResponse.json({
        success: false,
        error: "Not found on Discogs",
        artist: metadata.artist,
        album: metadata.album,
        year: metadata.year,
        label: metadata.label,
      });
    }

    const releaseId = searchResult.release_id;
    const discogsAuth = { Authorization: `Discogs token=${DISCOGS_TOKEN}` };

    // Step 3: Fetch release details, marketplace stats, and exchange rates in parallel
    const [releaseRes, statsRes, ratesRes] = await Promise.all([
      fetch(`https://api.discogs.com/releases/${releaseId}`, { headers: discogsAuth }),
      fetch(`https://api.discogs.com/marketplace/stats/${releaseId}`, { headers: discogsAuth }),
      fetch("https://open.er-api.com/v6/latest/USD"),
    ]);

    if (!releaseRes.ok || !statsRes.ok) {
      throw new Error("Discogs API error fetching release details");
    }

    const [release, stats, ratesData] = await Promise.all([
      releaseRes.json(),
      statsRes.json(),
      ratesRes.ok ? ratesRes.json() : { rates: null },
    ]);

    const rates = ratesData.rates;

    // Step 4: Format output (mirrors n8n Format Output node exactly)
    const artistRaw = release.artists?.[0]?.name || metadata.artist || "Unknown";
    const artist = artistRaw.replace(/\s*\(\d+\)\s*$/, "");

    const have = release.community?.have || 0;
    const want = release.community?.want || 0;
    const numForSale = stats.num_for_sale || 0;
    const wantRatio = numForSale > 0 ? want / numForSale : 0;

    const genres = searchResult.cover_image ? [] : (release.genres || []);
    const styles = release.styles || [];
    const genreStyle = [...(release.genres || []), ...styles].join(", ");

    let demand: string;
    if (wantRatio >= 2) demand = "High";
    else if (wantRatio >= 1) demand = "Good";
    else if (wantRatio >= 0.5) demand = "Medium";
    else demand = "Low";

    const price = stats.lowest_price?.value || release.lowest_price || null;
    const currency = stats.lowest_price?.currency || "EUR";

    let priceUSD: number | null = null;
    let priceMXN: number | null = null;
    let priceEUR: number | null = null;

    if (price && rates) {
      if (currency === "USD") {
        priceUSD = price;
      } else if (rates[currency]) {
        priceUSD = price / rates[currency];
      } else {
        priceUSD = price;
      }
      priceEUR = priceUSD! * rates.EUR;
      priceMXN = priceUSD! * rates.MXN;
    }

    return NextResponse.json({
      success: true,
      artist,
      album: release.title || metadata.album,
      year: release.year ? String(release.year) : metadata.year ?? undefined,
      label: release.labels?.[0]?.name || metadata.label || null,
      country: release.country || null,
      genreStyle,
      lowestPriceUsd: priceUSD ? `$${priceUSD.toFixed(2)}` : null,
      lowestPriceMxn: priceMXN ? `$${priceMXN.toFixed(0)} MXN` : null,
      lowestPriceEur: priceEUR ? `€${priceEUR.toFixed(2)}` : null,
      numForSale,
      have,
      want,
      wantRatio: wantRatio.toFixed(1),
      demand,
      discogsUrl: release.uri || `https://www.discogs.com/release/${releaseId}`,
      coverImage: searchResult.cover_image || release.images?.[0]?.uri || null,
    });
  } catch (err) {
    console.error("Valuate error:", err);
    return NextResponse.json(
      { success: false, error: "Valuation failed. Please try again." },
      { status: 500 }
    );
  }
}
