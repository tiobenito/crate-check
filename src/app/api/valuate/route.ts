import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: "Webhook URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Valuation service error" },
        { status: 502 }
      );
    }

    const raw = await response.json();
    // n8n returns an array — grab the first item
    const d = Array.isArray(raw) ? raw[0] : raw;

    // Normalize snake_case → camelCase and clean up values
    const data = {
      success: true,
      artist: d.artist,
      album: d.album,
      year: d.year != null ? String(d.year) : undefined,
      label: d.label,
      country: d.country,
      lowestPriceUsd: d.lowest_price_usd ?? d.lowestPriceUsd,
      lowestPriceMxn: d.lowest_price_mxn ?? d.lowestPriceMxn,
      lowestPriceEur: d.lowest_price_eur ?? d.lowestPriceEur,
      numForSale: d.num_for_sale ?? d.numForSale,
      have: d.have,
      want: d.want,
      wantRatio: d.want_ratio ?? d.wantRatio,
      demand: (d.demand ?? "").replace(/[^\w\s]/g, "").trim(), // strip emoji
      discogsUrl: d.discogs_url ?? d.discogsUrl,
      coverImage: d.cover_image ?? d.coverImage,
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach valuation service" },
      { status: 502 }
    );
  }
}
