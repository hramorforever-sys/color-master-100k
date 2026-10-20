export type Region = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  number: number;
  targetColor: string;
};

export type Illustration = {
  id: number;
  title: string;
  category: string;
  level: string;
  svg: string;
  regions: Region[];
};

const categories = [
  { name: 'Animals', items: ['Lion Cub', 'Dancing Panda', 'Arctic Fox', 'Forest Owl', 'River Otter', 'Sunset Gecko', 'Butterfly Pair', 'Penguin Parade', 'Rabbit Meadow', 'Meerkat Family'] },
  { name: 'Nature', items: ['Wildflower Bloom', 'Mountain Lake', 'Sunrise Dunes', 'Autumn Leaves', 'Garden Rain', 'Forest Trail', 'Cloud Valley', 'Cactus Grove', 'Winter Birch', 'River Stones'] },
  { name: 'Vehicles', items: ['City Bus', 'Race Car', 'Milk Truck', 'Helicopter', 'Submarine', 'Train Story', 'Vintage Bike', 'Fire Engine', 'School Bus', 'Rocket Ship'] },
  { name: 'Fantasy', items: ['Dragon Egg', 'Castle Spire', 'Moon Mage', 'Elf Lantern', 'Fairy Garden', 'Crystal Crown', 'Wizard Tower', 'Sun Dragon', 'Mystic Gate', 'Forest Sprite'] },
  { name: 'Underwater Life', items: ['Coral Reef', 'Turtle Haven', 'Jelly Bloom', 'Octopus Joy', 'School of Fish', 'Sea Star', 'Dolphin Leap', 'Kelp Forest', 'Pearl Diver', 'Wave Shell'] },
  { name: "Children's Drawings", items: ['Smiling Kite', 'Toy Parade', 'Rainbow Rocket', 'Happy Castle', 'Cloud Friends', 'Cupcake Garden', 'Animal Picnic', 'Candy Castle', 'Dinosaur Play', 'Moon Lantern'] },
  { name: 'Geometric Patterns', items: ['Mandala Bloom', 'Stellar Wave', 'Retro Tiles', 'Lattice Bloom', 'Orbital Pattern', 'Dice Mosaic', 'Star Spiral', 'Sunburst Grid', 'Triangle Dream', 'Circle Dance'] },
  { name: 'Islamic Art', items: ['Star Dome', 'Arabesque Door', 'Tile Garden', 'Lantern Arch', 'Moon Motif', 'Lotus Tile', 'Crescent Hall', 'Pattern Crown', 'Rosette Frame', 'Mosaic Fountain'] },
  { name: 'World Landmarks', items: ['Eiffel Tower', 'Statue of Liberty', 'Pyramids', 'Big Ben', 'Colosseum', 'Sphinx Gate', 'Taj Mahal', 'Golden Gate', 'Mount Fuji', 'Stonehenge'] },
  { name: 'Creative Illustrations', items: ['Dream Garden', 'Neon Bird', 'Volcanic Bloom', 'Paper Sky', 'Festival Lights', 'Solar Rain', 'Sky Train', 'Starlight Garden', 'Steam City', 'Moon Paper'] }
];

const basePalette = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#0f172a'];

function buildSvg(seed: number, category: string, title: string): string {
  const accentA = basePalette[seed % basePalette.length];
  const accentB = basePalette[(seed + 3) % basePalette.length];
  const accentC = basePalette[(seed + 6) % basePalette.length];

  const pattern = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#cbd5e1"/>
        </filter>
      </defs>
      <rect width="900" height="900" fill="#ffffff"/>
      <circle cx="450" cy="450" r="330" fill="none" stroke="#0f172a" stroke-width="4" stroke-dasharray="10 14" opacity="0.25"/>
      <g fill="none" stroke="#111827" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow)">
        <circle cx="240" cy="220" r="90" fill="none" stroke="${accentA}" opacity="0.2"/>
        <circle cx="660" cy="250" r="100" fill="none" stroke="${accentB}" opacity="0.2"/>
        <circle cx="480" cy="640" r="130" fill="none" stroke="${accentC}" opacity="0.2"/>
        <path d="M180 165 L270 100 L360 165 L310 260 L220 260 Z" fill="${accentA}" opacity="0.08"/>
        <path d="M540 165 L660 110 L770 180 L710 290 L590 300 Z" fill="${accentB}" opacity="0.08"/>
        <path d="M290 560 L420 500 L550 560 L510 700 L360 720 Z" fill="${accentC}" opacity="0.08"/>
        <path d="M210 360 C270 280, 330 280, 390 360 S510 440, 570 360 S690 280, 720 360" />
        <path d="M220 455 C290 410, 350 420, 410 470 S515 535, 620 475" />
        <path d="M290 250 L330 310 L290 375 L240 325 Z" fill="${accentA}" opacity="0.12"/>
        <path d="M590 310 L650 270 L710 330 L670 395 L600 385 Z" fill="${accentB}" opacity="0.12"/>
        <path d="M370 575 L470 530 L530 585 L495 700 L395 700 Z" fill="${accentC}" opacity="0.12"/>
      </g>
      <g font-family="sans-serif" font-weight="700" fill="#0f172a" font-size="36">
        <text x="450" y="840" text-anchor="middle">${title}</text>
      </g>
      <g stroke="#0f172a" stroke-width="6" fill="none" opacity="0.88">
        <path d="M120 710 C250 600, 330 610, 450 720 S640 850, 780 720"/>
      </g>
      <g stroke="#111827" stroke-width="5" fill="none">
        <path d="M140 160 L260 120 M150 260 L260 220 M230 330 L300 290" opacity="0.7"/>
        <path d="M620 180 L740 150 M630 300 L770 260 M630 360 L715 350" opacity="0.7"/>
      </g>
    </svg>
  `;

  return pattern;
}

function buildRegions(seed: number, category: string): Region[] {
  const regionCount = 5 + (seed % 4);
  const regions: Region[] = [];
  const palette = [...basePalette];

  for (let i = 0; i < regionCount; i += 1) {
    const x = 120 + ((seed + i * 37) % 500);
    const y = 120 + ((seed * 13 + i * 71) % 470);
    const w = 140 + ((seed + i * 17) % 170);
    const h = 130 + ((seed * 7 + i * 29) % 150);
    regions.push({
      id: `${category}-${i}`,
      x,
      y,
      w,
      h,
      number: i + 1,
      targetColor: palette[i % palette.length]
    });
  }

  return regions;
}

export const catalog: Illustration[] = categories.flatMap((category, categoryIndex) =>
  category.items.map((item, itemIndex) => {
    const id = categoryIndex * 10 + itemIndex + 1;
    const seed = id * 13 + categoryIndex * 7;
    return {
      id,
      title: item,
      category: category.name,
      level: ['Beginner', 'Intermediate', 'Advanced'][itemIndex % 3],
      svg: buildSvg(seed, category.name, item),
      regions: buildRegions(seed, `${category.name}-${id}`)
    };
  })
);

export function getIllustrationById(id: number) {
  return catalog.find((illustration) => illustration.id === id);
}
