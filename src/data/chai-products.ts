export const chaiProducts = [
  {
    slug: "tea-stall-chai",
    name: "Tea Stall Chai",
    grade: "D1",
    blend: "D1 + PD",
    description: "Economy D1 dust — maximum yield per cup, built for high-volume roadside stalls.",
    pricePerKg: 155,
  },
  {
    slug: "kadak-chai",
    name: "Kadak Chai",
    grade: "PD",
    blend: "OF + PD + BP",
    description: "Pekoe Dust — deep mahogany colour, bold full-bodied flavour. The hallmark of a proper kadak cup.",
    pricePerKg: 195,
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
