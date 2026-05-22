export const chaiProducts = [
  {
    slug: "tea-stall-chai",
    name: "Tea Stall Chai Standard",
    grade: "Special",
    blend: "D1 + PD",
    description: "Economy D1 dust — maximum yield per cup, built for high-volume roadside stalls.",
    pricePerKg: 275,
    prices: { 1: 275, 3: 825, 5: 1350, 10: 2650, 20: 5000 } as Record<number, number>,
  },
  {
    slug: "kadak-chai",
    name: "Tea Stall Chai Premium",
    grade: "Special",
    blend: "OF + PD + BP",
    description: "Pekoe Dust — deep mahogany colour, bold full-bodied flavour. The hallmark of a proper kadak cup.",
    pricePerKg: 350,
    prices: { 1: 350, 3: 1050, 5: 1690, 10: 3300, 20: 6500 } as Record<number, number>,
    delivery: { upTo5kg: 150, above5kg: 400 } as { upTo5kg: number; above5kg: number },
  },
  {
    slug: "hotel-chai",
    name: "Hotel Chai",
    grade: "PF1",
    blend: "OF + PD + BP",
    description: "Pekoe Fannings — quick brewing, consistent cup after cup. Reliable for hotel pantries and canteens.",
    pricePerKg: 240,
  },
  {
    slug: "3-star-hotel-chai",
    name: "3-Star Hotel Chai",
    grade: "BP1",
    blend: "BP + BOP + BOPSM",
    description: "Broken Pekoe — strong liquor, full body. A noticeable step above the standard hotel cup.",
    pricePerKg: 320,
  },
  {
    slug: "5-star-hotel-chai",
    name: "5-Star Hotel Chai",
    grade: "BOPF",
    blend: "BP + BOP + BOPSM + Leaf",
    description: "Broken Orange Pekoe Fannings — balanced, bright, refined. The mark of luxury hospitality.",
    pricePerKg: 435,
  },
] as const;

export type ChaiProduct = (typeof chaiProducts)[number];
