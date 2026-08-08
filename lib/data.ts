import {
  Shirt,
  Footprints,
  Watch,
  Sparkles,
  Briefcase,
  Coffee,
  Gem,
  Heart,
  type LucideIcon,
} from 'lucide-react';

export type ClosetCategory = 'Tops' | 'Bottoms' | 'Shoes' | 'Accessories';

export type StyleVibe =
  | 'Casual'
  | 'Elegant'
  | 'Sporty'
  | 'Cozy'
  | 'Edgy';

export interface ClosetItem {
  id: string;
  name: string;
  category: ClosetCategory;
  vibe: StyleVibe;
  color: string;
  colorHex: string;
  brand: string;
  aiTags: string[];
  wears: number;
  lastWorn: string;
  favorite: boolean;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface StylingPrompt {
  id: string;
  label: string;
  prompt: string;
}

export interface OutfitPiece {
  name: string;
  category: string;
  hue: string;
  note: string;
}

export interface OutfitRecommendation {
  title: string;
  vibe: string;
  summary: string;
  pieces: OutfitPiece[];
  palette: string[];
  tips: string[];
  confidence: number;
}

export interface PlannedOutfit {
  day: string;
  title: string;
  vibe: StyleVibe;
  palette: string[];
  pieces: string[];
}

export const categoryIcon: Record<ClosetCategory, LucideIcon> = {
  Tops: Shirt,
  Bottoms: Shirt,
  Shoes: Footprints,
  Accessories: Watch,
};

export const vibeAccent: Record<StyleVibe, string> = {
  Casual: 'bg-amber-100 text-amber-700',
  Elegant: 'bg-fuchsia-100 text-fuchsia-700',
  Sporty: 'bg-emerald-100 text-emerald-700',
  Cozy: 'bg-rose-100 text-rose-700',
  Edgy: 'bg-violet-100 text-violet-700',
};

export const vibeColor: Record<StyleVibe, string> = {
  Casual: '#f59e0b',
  Elegant: '#d946ef',
  Sporty: '#10b981',
  Cozy: '#f43f5e',
  Edgy: '#8b5cf6',
};

export const closetItems: ClosetItem[] = [
  {
    id: 'i1',
    name: 'White Tee',
    category: 'Tops',
    vibe: 'Casual',
    color: 'White',
    colorHex: '#f8fafc',
    brand: 'Everlane',
    aiTags: ['Cotton', 'Everyday', 'Layering'],
    wears: 42,
    lastWorn: '2 days ago',
    favorite: true,
    image: 'https://images.pexels.com/photos/12025472/pexels-photo-12025472.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i2',
    name: 'Knit Sweater',
    category: 'Tops',
    vibe: 'Cozy',
    color: 'Oat',
    colorHex: '#d9cbb6',
    brand: 'The Row',
    aiTags: ['Merino', 'Soft', 'Layering'],
    wears: 19,
    lastWorn: '4 days ago',
    favorite: true,
    image: 'https://images.pexels.com/photos/15193376/pexels-photo-15193376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i3',
    name: 'Silk Blouse',
    category: 'Tops',
    vibe: 'Elegant',
    color: 'Blush',
    colorHex: '#f4c2c2',
    brand: 'Reformation',
    aiTags: ['Silk', 'Draped', 'Date night'],
    wears: 8,
    lastWorn: '1 week ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/8767575/pexels-photo-8767575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i4',
    name: 'Hoodie',
    category: 'Tops',
    vibe: 'Sporty',
    color: 'Sage',
    colorHex: '#9ca99a',
    brand: 'Champion',
    aiTags: ['Fleece', 'Relaxed', 'Weekend'],
    wears: 31,
    lastWorn: 'Yesterday',
    favorite: false,
    image: 'https://images.pexels.com/photos/9775547/pexels-photo-9775547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i5',
    name: 'Denim Jacket',
    category: 'Tops',
    vibe: 'Edgy',
    color: 'Indigo',
    colorHex: '#3a5066',
    brand: 'A.P.C.',
    aiTags: ['Denim', 'Layering', 'Classic'],
    wears: 27,
    lastWorn: '3 days ago',
    favorite: true,
    image: 'https://images.pexels.com/photos/11096066/pexels-photo-11096066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i6',
    name: 'Vintage Tee',
    category: 'Tops',
    vibe: 'Casual',
    color: 'Charcoal',
    colorHex: '#3f4651',
    brand: 'Thrifted',
    aiTags: ['Graphic', 'Relaxed', 'Weekend'],
    wears: 15,
    lastWorn: '5 days ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/3763134/pexels-photo-3763134.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i7',
    name: 'Mom Jeans',
    category: 'Bottoms',
    vibe: 'Casual',
    color: 'Light Blue',
    colorHex: '#8aa9c5',
    brand: 'Levi\'s',
    aiTags: ['Denim', 'High-rise', 'Everyday'],
    wears: 56,
    lastWorn: 'Yesterday',
    favorite: true,
    image: 'https://images.pexels.com/photos/4109759/pexels-photo-4109759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i8',
    name: 'Pleated Trousers',
    category: 'Bottoms',
    vibe: 'Elegant',
    color: 'Camel',
    colorHex: '#c9a27a',
    brand: 'Lemaire',
    aiTags: ['Tailored', 'Flowing', 'Office'],
    wears: 12,
    lastWorn: '6 days ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/20094389/pexels-photo-20094389.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i9',
    name: 'Joggers',
    category: 'Bottoms',
    vibe: 'Sporty',
    color: 'Heather Grey',
    colorHex: '#b8bcc0',
    brand: 'Nike',
    aiTags: ['Fleece', 'Relaxed', 'Lounge'],
    wears: 38,
    lastWorn: '2 days ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/14571357/pexels-photo-14571357.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i10',
    name: 'Midi Skirt',
    category: 'Bottoms',
    vibe: 'Elegant',
    color: 'Black',
    colorHex: '#1f2937',
    brand: 'COS',
    aiTags: ['Pleated', 'Flowing', 'Date night'],
    wears: 9,
    lastWorn: '2 weeks ago',
    favorite: true,
    image: 'https://images.pexels.com/photos/7391123/pexels-photo-7391123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i11',
    name: 'White Sneakers',
    category: 'Shoes',
    vibe: 'Casual',
    color: 'Cloud',
    colorHex: '#f8fafc',
    brand: 'Common Projects',
    aiTags: ['Leather', 'Minimal', 'Everyday'],
    wears: 88,
    lastWorn: 'Yesterday',
    favorite: true,
    image: 'https://images.pexels.com/photos/33231313/pexels-photo-33231313.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i12',
    name: 'Leather Loafers',
    category: 'Shoes',
    vibe: 'Elegant',
    color: 'Chestnut',
    colorHex: '#6b3b1f',
    brand: 'G.H. Bass',
    aiTags: ['Polished', 'Classic', 'Office'],
    wears: 24,
    lastWorn: '1 week ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/29258015/pexels-photo-29258015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i13',
    name: 'Running Shoes',
    category: 'Shoes',
    vibe: 'Sporty',
    color: 'Coral',
    colorHex: '#ff7a6b',
    brand: 'New Balance',
    aiTags: ['Mesh', 'Cushioned', 'Active'],
    wears: 33,
    lastWorn: '3 days ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/1464648/pexels-photo-1464648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i14',
    name: 'Ankle Boots',
    category: 'Shoes',
    vibe: 'Edgy',
    color: 'Black',
    colorHex: '#1f2937',
    brand: 'Acne Studios',
    aiTags: ['Leather', 'Chunky', 'Fall'],
    wears: 18,
    lastWorn: '5 days ago',
    favorite: true,
    image: 'https://images.pexels.com/photos/15613297/pexels-photo-15613297.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i15',
    name: 'Gold Hoops',
    category: 'Accessories',
    vibe: 'Elegant',
    color: 'Gold',
    colorHex: '#d4af37',
    brand: 'Mejuri',
    aiTags: ['Metal', 'Everyday', 'Warm'],
    wears: 64,
    lastWorn: 'Yesterday',
    favorite: true,
    image: 'https://images.pexels.com/photos/12194345/pexels-photo-12194345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i16',
    name: 'Canvas Tote',
    category: 'Accessories',
    vibe: 'Casual',
    color: 'Natural',
    colorHex: '#e8dcc4',
    brand: 'Baggu',
    aiTags: ['Canvas', 'Roomy', 'Errands'],
    wears: 47,
    lastWorn: '2 days ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/18936417/pexels-photo-18936417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i17',
    name: 'Silk Scarf',
    category: 'Accessories',
    vibe: 'Elegant',
    color: 'Rose',
    colorHex: '#e85d8d',
    brand: 'Hermès',
    aiTags: ['Silk', 'Printed', 'Statement'],
    wears: 7,
    lastWorn: '2 weeks ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/14944285/pexels-photo-14944285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'i18',
    name: 'Beanie',
    category: 'Accessories',
    vibe: 'Cozy',
    color: 'Cream',
    colorHex: '#efe7d6',
    brand: 'Acne Studios',
    aiTags: ['Wool', 'Warm', 'Winter'],
    wears: 11,
    lastWorn: '1 week ago',
    favorite: false,
    image: 'https://images.pexels.com/photos/12512750/pexels-photo-12512750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export const stylingPrompts: StylingPrompt[] = [
  {
    id: 'p1',
    label: 'Coffee date today',
    prompt:
      "I'm meeting a friend for coffee this afternoon. Something cute but effortless?",
  },
  {
    id: 'p2',
    label: 'Dinner tonight',
    prompt:
      "Help me pick an outfit for a nice dinner tonight. I want to feel a little dressed up but still like myself.",
  },
  {
    id: 'p3',
    label: 'Rainy day',
    prompt:
      "It's raining and gloomy today. Put together something cozy that still looks put-together.",
  },
  {
    id: 'p4',
    label: 'Weekend brunch',
    prompt:
      "Give me a relaxed brunch outfit for the weekend that looks intentional without trying too hard.",
  },
];

export const plannedOutfits: PlannedOutfit[] = [
  {
    day: 'Monday',
    title: 'Cozy office day',
    vibe: 'Cozy',
    palette: ['#d9cbb6', '#3f4651', '#6b3b1f'],
    pieces: ['Knit Sweater', 'Pleated Trousers', 'Leather Loafers'],
  },
  {
    day: 'Tuesday',
    title: 'Effortless errands',
    vibe: 'Casual',
    palette: ['#f8fafc', '#8aa9c5', '#e8dcc4'],
    pieces: ['White Tee', 'Mom Jeans', 'Canvas Tote'],
  },
  {
    day: 'Wednesday',
    title: '',
    vibe: 'Casual',
    palette: [],
    pieces: [],
  },
  {
    day: 'Thursday',
    title: 'Dinner date',
    vibe: 'Elegant',
    palette: ['#f4c2c2', '#1f2937', '#d4af37'],
    pieces: ['Silk Blouse', 'Midi Skirt', 'Gold Hoops'],
  },
  {
    day: 'Friday',
    title: '',
    vibe: 'Edgy',
    palette: [],
    pieces: [],
  },
  {
    day: 'Saturday',
    title: 'Weekend brunch',
    vibe: 'Casual',
    palette: ['#9ca99a', '#8aa9c5', '#f8fafc'],
    pieces: ['Hoodie', 'Mom Jeans', 'White Sneakers'],
  },
  {
    day: 'Sunday',
    title: '',
    vibe: 'Sporty',
    palette: [],
    pieces: [],
  },
];

export const outfitSuggestions: PlannedOutfit[] = [
  {
    day: 'Cozy lounge',
    title: 'Cozy lounge',
    vibe: 'Cozy',
    palette: ['#efe7d6', '#b8bcc0', '#f8fafc'],
    pieces: ['Knit Sweater', 'Joggers', 'White Sneakers'],
  },
  {
    day: 'Night out',
    title: 'Night out',
    vibe: 'Edgy',
    palette: ['#1f2937', '#1f2937', '#d4af37'],
    pieces: ['Vintage Tee', 'Midi Skirt', 'Ankle Boots'],
  },
  {
    day: 'Active morning',
    title: 'Active morning',
    vibe: 'Sporty',
    palette: ['#9ca99a', '#b8bcc0', '#ff7a6b'],
    pieces: ['Hoodie', 'Joggers', 'Running Shoes'],
  },
  {
    day: 'Smart casual',
    title: 'Smart casual',
    vibe: 'Elegant',
    palette: ['#c9a27a', '#f4c2c2', '#6b3b1f'],
    pieces: ['Silk Blouse', 'Pleated Trousers', 'Leather Loafers'],
  },
];

export const styleStats: { vibe: StyleVibe; percent: number; count: number }[] = [
  { vibe: 'Casual', percent: 40, count: 7 },
  { vibe: 'Elegant', percent: 30, count: 5 },
  { vibe: 'Sporty', percent: 15, count: 3 },
  { vibe: 'Cozy', percent: 10, count: 2 },
  { vibe: 'Edgy', percent: 5, count: 1 },
];

export const topColors: { color: string; hex: string; count: number; percent: number }[] = [
  { color: 'White & Cream', hex: '#f8fafc', count: 5, percent: 28 },
  { color: 'Blue', hex: '#8aa9c5', count: 4, percent: 22 },
  { color: 'Black & Charcoal', hex: '#1f2937', count: 3, percent: 17 },
  { color: 'Pink & Blush', hex: '#f4c2c2', count: 3, percent: 17 },
  { color: 'Brown & Camel', hex: '#c9a27a', count: 2, percent: 11 },
  { color: 'Gold', hex: '#d4af37', count: 1, percent: 5 },
];

export const occasionIconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  sparkles: Sparkles,
  coffee: Coffee,
  gem: Gem,
  heart: Heart,
};
