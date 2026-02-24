import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    records: i.entity({
      artist: i.string(),
      album: i.string(),
      year: i.string().optional(),
      label: i.string().optional(),
      country: i.string().optional(),
      lowestPriceUsd: i.string().optional(),
      lowestPriceMxn: i.string().optional(),
      lowestPriceEur: i.string().optional(),
      numForSale: i.number().optional(),
      have: i.number().optional(),
      want: i.number().optional(),
      wantRatio: i.string().optional(),
      demand: i.string().optional(),
      discogsUrl: i.string().optional(),
      coverImage: i.string().optional(),
      valuatedAt: i.date(),
    }),
  },
});

export default schema;
