'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Send,
  Palette,
  RefreshCw,
  Download,
  ThumbsUp,
  Save,
  Heart,
  Shirt,
  Footprints,
  Watch,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  stylingPrompts,
  closetItems,
  type ChatMessage,
  type OutfitRecommendation,
  type OutfitPiece,
  type ClosetItem,
} from '@/lib/data';

// --- Wardrobe lookup helpers ----------------------------------------------

function findItem(name: string): ClosetItem | undefined {
  return closetItems.find(
    (i) => i.name.toLowerCase() === name.toLowerCase()
  );
}

function hueFor(name: string): string {
  return findItem(name)?.colorHex ?? '#e8dcc4';
}

// --- Keyword-driven styling engine ---------------------------------------

interface StyleMatch {
  id: string;
  keywords: string[];
  recommendation: OutfitRecommendation;
}

const styleMatches: StyleMatch[] = [
  {
    id: 'interview',
    keywords: ['interview', 'job', 'work', 'office', 'meeting', 'business'],
    recommendation: {
      title: 'Polished Interview Look',
      vibe: 'Elegant',
      summary:
        "Confident and put-together without feeling stiff. Your silk blouse reads professional, the camel trousers add quiet polish, and loafers keep it comfortable for a long day.",
      pieces: [
        {
          name: 'Silk Blouse',
          category: 'Tops',
          hue: '#f4c2c2',
          note: 'Blush silk — professional with a soft touch of personality.',
        },
        {
          name: 'Pleated Trousers',
          category: 'Bottoms',
          hue: '#c9a27a',
          note: 'Camel tailored trousers — structured but easy to move in.',
        },
        {
          name: 'Leather Loafers',
          category: 'Shoes',
          hue: '#6b3b1f',
          note: 'Chestnut loafers — polished, walkable, interview-safe.',
        },
        {
          name: 'Gold Hoops',
          category: 'Accessories',
          hue: '#d4af37',
          note: 'A single warm-gold detail — understated but intentional.',
        },
      ],
      palette: ['#f4c2c2', '#c9a27a', '#6b3b1f', '#d4af37'],
      tips: [
        'Tuck the blouse in to define your waist and look sharp.',
        'Keep jewelry minimal — the gold hoops are enough.',
        'A low bun or sleek blowout finishes the polished vibe.',
      ],
      confidence: 96,
    },
  },
  {
    id: 'university',
    keywords: ['university', 'college', 'class', 'school', 'campus', 'study', 'lecture'],
    recommendation: {
      title: 'Campus Comfort',
      vibe: 'Casual',
      summary:
        "Lecture-ready and library-friendly. Your white tee and mom jeans are effortless, the denim jacket adds a layer for chilly halls, and clean sneakers keep you walking all day.",
      pieces: [
        {
          name: 'White Tee',
          category: 'Tops',
          hue: '#f8fafc',
          note: 'Crisp cotton — comfy for long lecture marathons.',
        },
        {
          name: 'Denim Jacket',
          category: 'Tops',
          hue: '#3a5066',
          note: 'Layer for cold lecture halls — easy to shrug off.',
        },
        {
          name: 'Mom Jeans',
          category: 'Bottoms',
          hue: '#8aa9c5',
          note: 'High-rise denim — sits comfortably through hours of sitting.',
        },
        {
          name: 'White Sneakers',
          category: 'Shoes',
          hue: '#f8fafc',
          note: 'Clean sneakers — campus-to-cafe ready.',
        },
      ],
      palette: ['#f8fafc', '#3a5066', '#8aa9c5', '#f8fafc'],
      tips: [
        'Toss your laptop and notebook in the canvas tote — it fits everything.',
        'Gold hoops add a tiny bit of polish to a study-day look.',
        'A lip balm in your tote is all the glam you need between classes.',
      ],
      confidence: 91,
    },
  },
  {
    id: 'date',
    keywords: ['date', 'dinner', 'romantic', 'valentine', 'anniversary'],
    recommendation: {
      title: 'Dinner Date Glow',
      vibe: 'Elegant',
      summary:
        "A little dressed up but still you — silk blouse with a midi skirt and gold hoops. Ankle boots add just enough edge to keep it from feeling too formal.",
      pieces: [
        {
          name: 'Silk Blouse',
          category: 'Tops',
          hue: '#f4c2c2',
          note: 'Blush silk — catches candlelight beautifully.',
        },
        {
          name: 'Midi Skirt',
          category: 'Bottoms',
          hue: '#1f2937',
          note: 'Black pleated midi — flowy and elegant.',
        },
        {
          name: 'Ankle Boots',
          category: 'Shoes',
          hue: '#1f2937',
          note: 'Chunky black boots — grounds the look with a bit of edge.',
        },
        {
          name: 'Gold Hoops',
          category: 'Accessories',
          hue: '#d4af37',
          note: 'Your everyday gold hoops — warm and simple.',
        },
      ],
      palette: ['#f4c2c2', '#1f2937', '#1f2937', '#d4af37'],
      tips: [
        'Tuck the blouse loosely to define your waist without stiffness.',
        'A soft red or rose lip pulls the blush and gold together.',
        'Keep the bag small — a clutch or mini crossbody tonight.',
      ],
      confidence: 95,
    },
  },
  {
    id: 'rainy',
    keywords: ['rain', 'rainy', 'wet', 'gloomy', 'storm', 'umbrella', 'puddle'],
    recommendation: {
      title: 'Cozy Rainy Day',
      vibe: 'Cozy',
      summary:
        "Soft, warm, and weather-ready. Your oat knit keeps things cozy while the denim jacket adds a layer you can shrug off indoors. Ankle boots handle the puddles.",
      pieces: [
        {
          name: 'Knit Sweater',
          category: 'Tops',
          hue: '#d9cbb6',
          note: 'Oat merino — soft, warm, and quietly luxe.',
        },
        {
          name: 'Denim Jacket',
          category: 'Tops',
          hue: '#3a5066',
          note: 'Layer over the knit — easy to remove when you arrive.',
        },
        {
          name: 'Mom Jeans',
          category: 'Bottoms',
          hue: '#8aa9c5',
          note: 'Sturdy denim — holds up to wet weather.',
        },
        {
          name: 'Ankle Boots',
          category: 'Shoes',
          hue: '#1f2937',
          note: 'Leather boots — puddle-proof and chic.',
        },
      ],
      palette: ['#d9cbb6', '#3a5066', '#8aa9c5', '#1f2937'],
      tips: [
        'Add your beanie if it is really pouring — cream keeps the palette soft.',
        'A scarf in a warm tone adds a pop of color on grey days.',
        'Swap to your silk scarf indoors for a little sparkle.',
      ],
      confidence: 89,
    },
  },
  {
    id: 'casual',
    keywords: ['casual', 'coffee', 'brunch', 'errand', 'weekend', 'relaxed', 'chill', 'lounge'],
    recommendation: {
      title: 'Effortless Coffee Run',
      vibe: 'Casual',
      summary:
        "Cute but relaxed — your favorite tee and mom jeans with clean sneakers. A canvas tote keeps it grounded and ready for a walk after.",
      pieces: [
        {
          name: 'White Tee',
          category: 'Tops',
          hue: '#f8fafc',
          note: 'Crisp cotton — the perfect blank-canvas base.',
        },
        {
          name: 'Mom Jeans',
          category: 'Bottoms',
          hue: '#8aa9c5',
          note: 'High-rise denim — comfy and flattering all day.',
        },
        {
          name: 'White Sneakers',
          category: 'Shoes',
          hue: '#f8fafc',
          note: 'Keep them clean — it is what makes the look intentional.',
        },
        {
          name: 'Canvas Tote',
          category: 'Accessories',
          hue: '#e8dcc4',
          note: 'Roomy enough for a book or a market stop after.',
        },
      ],
      palette: ['#f8fafc', '#8aa9c5', '#f8fafc', '#e8dcc4'],
      tips: [
        'Cuff the jeans once at the ankle to show off the sneakers.',
        'Add your gold hoops for a tiny touch of warmth.',
        'A lip balm or tinted gloss is all the glam you need.',
      ],
      confidence: 92,
    },
  },
  {
    id: 'sporty',
    keywords: ['gym', 'workout', 'run', 'jog', 'active', 'sport', 'exercise', 'hike'],
    recommendation: {
      title: 'Active Morning',
      vibe: 'Sporty',
      summary:
        "Built to move. Your sage hoodie and joggers keep you comfortable, and the running shoes are made for the miles. Easy to layer off when you warm up.",
      pieces: [
        {
          name: 'Hoodie',
          category: 'Tops',
          hue: '#9ca99a',
          note: 'Sage fleece — cozy and breathable for warm-ups.',
        },
        {
          name: 'Joggers',
          category: 'Bottoms',
          hue: '#b8bcc0',
          note: 'Fleece joggers — stretchy and move with you.',
        },
        {
          name: 'Running Shoes',
          category: 'Shoes',
          hue: '#ff7a6b',
          note: 'Coral runners — cushioned for the road or trail.',
        },
        {
          name: 'Canvas Tote',
          category: 'Accessories',
          hue: '#e8dcc4',
          note: 'Tote your water bottle and towel in style.',
        },
      ],
      palette: ['#9ca99a', '#b8bcc0', '#ff7a6b', '#e8dcc4'],
      tips: [
        'A dry-fit tee under the hoodie if you heat up fast.',
        'Pull hair back — a scrunchie in the tote saves the day.',
        'Refill your water bottle before you head out.',
      ],
      confidence: 88,
    },
  },
  {
    id: 'edgy',
    keywords: ['edgy', 'concert', 'club', 'night out', 'party', 'festival'],
    recommendation: {
      title: 'Night Out Edge',
      vibe: 'Edgy',
      summary:
        "A little rock-and-roll. Your vintage tee and midi skirt mix soft and sharp, ankle boots bring the attitude, and gold hoops warm it all up.",
      pieces: [
        {
          name: 'Vintage Tee',
          category: 'Tops',
          hue: '#3f4651',
          note: 'Charcoal graphic tee — relaxed and a little rebellious.',
        },
        {
          name: 'Midi Skirt',
          category: 'Bottoms',
          hue: '#1f2937',
          note: 'Black pleated midi — movement and drama.',
        },
        {
          name: 'Ankle Boots',
          category: 'Shoes',
          hue: '#1f2937',
          note: 'Chunky black boots — the backbone of the edge.',
        },
        {
          name: 'Gold Hoops',
          category: 'Accessories',
          hue: '#d4af37',
          note: 'Warm gold to soften the dark palette.',
        },
      ],
      palette: ['#3f4651', '#1f2937', '#1f2937', '#d4af37'],
      tips: [
        'A bold lip — red or berry — leans into the night-out energy.',
        'Smudge a little eyeliner for an effortless rock vibe.',
        'Keep the bag small and crossbody so your hands stay free.',
      ],
      confidence: 90,
    },
  },
];

// Garment-specific keyword matches — if the user names a specific piece,
// build the outfit around it.
const garmentKeywords: {
  keywords: string[];
  itemName: string;
  build: (itemName: string) => OutfitRecommendation;
}[] = [
  {
    keywords: ['blazer', 'jacket', 'coat', 'outerwear'],
    itemName: 'Denim Jacket',
    build: (itemName) => ({
      title: `Built around your ${itemName}`,
      vibe: 'Edgy',
      summary:
        "Layering is the move here. Your denim jacket over a soft knit, with mom jeans and ankle boots — structured on top, relaxed underneath.",
      pieces: [
        {
          name: itemName,
          category: 'Tops',
          hue: hueFor(itemName),
          note: 'The hero piece — wear it open and unstructured.',
        },
        {
          name: 'Knit Sweater',
          category: 'Tops',
          hue: hueFor('Knit Sweater'),
          note: 'Oat merino underneath — warm and tactile.',
        },
        {
          name: 'Mom Jeans',
          category: 'Bottoms',
          hue: hueFor('Mom Jeans'),
          note: 'High-rise denim — balances the layered top half.',
        },
        {
          name: 'Ankle Boots',
          category: 'Shoes',
          hue: hueFor('Ankle Boots'),
          note: 'Chunky boots — finish the layered, grounded look.',
        },
      ],
      palette: [
        hueFor(itemName),
        hueFor('Knit Sweater'),
        hueFor('Mom Jeans'),
        hueFor('Ankle Boots'),
      ],
      tips: [
        'Cuff the jacket sleeves once to show a sliver of the knit.',
        'Gold hoops add warmth against the indigo and charcoal.',
        'A silk scarf tied at the neck brings a little sparkle.',
      ],
      confidence: 87,
    }),
  },
  {
    keywords: ['sweater', 'knit', 'jumper', 'pullover'],
    itemName: 'Knit Sweater',
    build: (itemName) => ({
      title: `Cozy around your ${itemName}`,
      vibe: 'Cozy',
      summary:
        "Your oat knit does the heavy lifting — pair it with mom jeans and white sneakers for an easy, soft, elevated-everyday look.",
      pieces: [
        {
          name: itemName,
          category: 'Tops',
          hue: hueFor(itemName),
          note: 'Oat merino — the cozy centerpiece.',
        },
        {
          name: 'Mom Jeans',
          category: 'Bottoms',
          hue: hueFor('Mom Jeans'),
          note: 'High-rise denim — relaxed and flattering.',
        },
        {
          name: 'White Sneakers',
          category: 'Shoes',
          hue: hueFor('White Sneakers'),
          note: 'Clean sneakers keep it fresh and walkable.',
        },
        {
          name: 'Gold Hoops',
          category: 'Accessories',
          hue: hueFor('Gold Hoops'),
          note: 'A touch of warm gold to lift the neutrals.',
        },
      ],
      palette: [
        hueFor(itemName),
        hueFor('Mom Jeans'),
        hueFor('White Sneakers'),
        hueFor('Gold Hoops'),
      ],
      tips: [
        'Half-tuck the sweater to define your waist.',
        'Add the beanie if it is chilly — cream keeps it soft.',
        'A canvas tote finishes the cozy-everyday vibe.',
      ],
      confidence: 90,
    }),
  },
  {
    keywords: ['silk', 'blouse', 'dressy', 'fancy'],
    itemName: 'Silk Blouse',
    build: (itemName) => ({
      title: `Elevated with your ${itemName}`,
      vibe: 'Elegant',
      summary:
        "Your blush silk is the star — tuck it into the midi skirt for grace, and ground it with ankle boots so it doesn't feel too precious.",
      pieces: [
        {
          name: itemName,
          category: 'Tops',
          hue: hueFor(itemName),
          note: 'Blush silk — luminous and a little luxe.',
        },
        {
          name: 'Midi Skirt',
          category: 'Bottoms',
          hue: hueFor('Midi Skirt'),
          note: 'Black pleated midi — movement and contrast.',
        },
        {
          name: 'Ankle Boots',
          category: 'Shoes',
          hue: hueFor('Ankle Boots'),
          note: 'Chunky boots — keep it from feeling too formal.',
        },
        {
          name: 'Gold Hoops',
          category: 'Accessories',
          hue: hueFor('Gold Hoops'),
          note: 'Warm gold echoes the blush tones.',
        },
      ],
      palette: [
        hueFor(itemName),
        hueFor('Midi Skirt'),
        hueFor('Ankle Boots'),
        hueFor('Gold Hoops'),
      ],
      tips: [
        'A loose tuck defines the waist without stiffness.',
        'A rose lip ties the blush and gold together.',
        'Keep accessories minimal — let the silk shine.',
      ],
      confidence: 93,
    }),
  },
];

function matchRecommendation(prompt: string): OutfitRecommendation {
  const lower = prompt.toLowerCase();

  // 1. Garment-specific matches take priority
  for (const g of garmentKeywords) {
    if (g.keywords.some((k) => lower.includes(k))) {
      return g.build(g.itemName);
    }
  }

  // 2. Occasion / context matches
  for (const m of styleMatches) {
    if (m.keywords.some((k) => lower.includes(k))) {
      return m.recommendation;
    }
  }

  // 3. Fallback — a balanced everyday look
  return {
    title: 'Everyday Sparkle',
    vibe: 'Casual',
    summary:
      "A balanced go-to from your closet — your white tee and mom jeans with clean sneakers, warmed up with gold hoops. Easy to dress up or down.",
    pieces: [
      {
        name: 'White Tee',
        category: 'Tops',
        hue: hueFor('White Tee'),
        note: 'Crisp cotton — your most versatile base.',
      },
      {
        name: 'Mom Jeans',
        category: 'Bottoms',
        hue: hueFor('Mom Jeans'),
        note: 'High-rise denim — goes with everything.',
      },
      {
        name: 'White Sneakers',
        category: 'Shoes',
        hue: hueFor('White Sneakers'),
        note: 'Clean minimal sneakers.',
      },
      {
        name: 'Gold Hoops',
        category: 'Accessories',
        hue: hueFor('Gold Hoops'),
        note: 'A little warm sparkle to finish.',
      },
    ],
    palette: [
      hueFor('White Tee'),
      hueFor('Mom Jeans'),
      hueFor('White Sneakers'),
      hueFor('Gold Hoops'),
    ],
    tips: [
      'Cuff the jeans to show off the sneakers.',
      'Add the denim jacket if it cools down.',
      'A tinted lip balm is all the glam you need.',
    ],
    confidence: 86,
  };
}

// --- Guardrail: fashion-relevance check ---------------------------------

const fashionKeywords = [
  // Clothing & garments
  'outfit', 'clothes', 'clothing', 'wear', 'wearing', 'dress', 'shirt',
  'tee', 'top', 'blouse', 'sweater', 'knit', 'jumper', 'pullover', 'hoodie',
  'jeans', 'pants', 'trousers', 'skirt', 'shorts', 'jacket', 'blazer',
  'coat', 'cardigan', 'sneakers', 'shoes', 'boots', 'loafers', 'heels',
  'flats', 'sandals', 'accessories', 'jewelry', 'earrings', 'hoops',
  'necklace', 'bracelet', 'ring', 'watch', 'bag', 'tote', 'purse',
  'scarf', 'hat', 'beanie', 'belt', 'sunglasses', 'socks', 'tights',
  'lingerie', 'underwear', 'bra', 'swimsuit', 'bikini', 'activewear',
  'loungewear', 'sleepwear', 'formal', 'gown', 'suit', 'tie', 'denim',
  'cotton', 'silk', 'wool', 'leather', 'linen', 'fleece', 'cashmere',
  // Styling & fashion concepts
  'style', 'styling', 'fashion', 'look', 'vibe', 'aesthetic', 'trend',
  'trendy', 'chic', 'elegant', 'casual', 'cozy', 'edgy', 'sporty',
  'capsule', 'wardrobe', 'closet', 'combo', 'combination', 'pair',
  'match', 'matching', 'layer', 'layering', 'color', 'colour', 'palette',
  'neutral', 'pattern', 'print', 'fit', 'tailored', 'oversized',
  'accessorize', 'accessorizing', 'outfit idea', 'what to wear',
  'get dressed', 'getting dressed', 'put together', 'pull together',
  // Occasions (fashion-relevant contexts)
  'date', 'dinner', 'brunch', 'coffee', 'party', 'wedding', 'interview',
  'work', 'office', 'meeting', 'university', 'college', 'class',
  'school', 'campus', 'gym', 'workout', 'run', 'hike', 'picnic',
  'concert', 'festival', 'club', 'night out', 'vacation', 'holiday',
  'travel', 'trip', 'beach', 'pool', 'event', 'occasion', 'ceremony',
  'graduation', 'prom', 'engagement', 'anniversary', 'birthday',
  'celebration', 'reunion', 'photo', 'photoshoot', 'portrait',
  // Weather (fashion-relevant)
  'rain', 'rainy', 'wet', 'gloomy', 'storm', 'snow', 'snowy', 'cold',
  'chilly', 'warm', 'hot', 'sunny', 'windy', 'wind', 'humid', 'freeze',
  'freezing', 'winter', 'summer', 'spring', 'fall', 'autumn', 'weather',
  'temperature', 'season', 'seasonal', 'layer up', 'bundle up',
  // Body & grooming adjacent to fashion
  'shoes', 'heels', 'flats', 'hair', 'makeup', 'lip', 'gloss', 'perfume',
  'nails', 'manicure', 'pedicure', 'skin', 'skincare', 'routine',
];

const OFF_TOPIC_FALLBACK =
  "I'm your SparkleCloset AI fashion assistant, so I'm not quite sure about that! Let's get back to making you look fabulous. Ask me how to style your White Tee or what to wear for your next event! ✨";

const GREETING_RESPONSE =
  "Hello gorgeous! ✨ Welcome to SparkleCloset AI. What's on your schedule today? Let me help you style a fabulous look from your closet!";

const greetingPatterns = [
  /^\s*hi+\s*$/i,
  /^\s*hello+\s*$/i,
  /^\s*hey+\s*$/i,
  /^\s*heyy+\s*$/i,
  /^\s*hii+\s*$/i,
  /^\s*yo+\s*$/i,
  /^\s*sup\s*$/i,
  /^\s*good\s+morning\b/i,
  /^\s*good\s+afternoon\b/i,
  /^\s*good\s+evening\b/i,
  /^\s*howdy\s*$/i,
  /^\s*greetings\s*$/i,
  /^\s*hi\s+there\b/i,
  /^\s*hey\s+there\b/i,
  /^\s*hello\s+there\b/i,
];

function matchGreeting(text: string): boolean {
  return greetingPatterns.some((re) => re.test(text.trim()));
}

function isFashionRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return fashionKeywords.some((kw) => lower.includes(kw));
}

// --- Structured chat reply builder ---------------------------------------

function buildReplyText(rec: OutfitRecommendation): string {
  const piecesList = rec.pieces
    .map((p) => `• ${p.name} (${p.category}) — ${p.note}`)
    .join('\n');
  const tipsList = rec.tips.map((t) => `✨ ${t}`).join('\n');
  return `Here's a "${rec.title}" look from your closet — ${rec.summary}\n\nYour outfit:\n${piecesList}\n\nStyling tips:\n${tipsList}\n\nConfidence: ${rec.confidence}%. Want me to tweak anything? ✨`;
}

const now = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

// --- Component ------------------------------------------------------------

export function StylistView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        "Hey there! I'm your SparkleCloset AI stylist. Tell me what's on today — a coffee date, a rainy commute, a dinner, a lecture — or name a piece like your blazer or sweater and I'll build around it. What are we styling? ✨",
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [recommendation, setRecommendation] =
    useState<OutfitRecommendation | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages change or the typing
  // indicator appears/disappears.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, thinking]);

  const send = (text: string) => {
    const content = text.trim();
    if (!content || thinking) return;

    // 1. Push the user's message immediately
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content,
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    // 2. After 1.5s, resolve the AI reply.
    //    Step A: greetings get a warm welcome — no guardrail, no outfit.
    //    Step B: fashion-related prompts go to the outfit generator.
    //    Step C: anything else is off-topic → fallback message.
    setTimeout(() => {
      if (matchGreeting(content)) {
        const greeting: ChatMessage = {
          id: `m-${Date.now()}-a`,
          role: 'assistant',
          content: GREETING_RESPONSE,
          time: now(),
        };
        setMessages((prev) => [...prev, greeting]);
        setThinking(false);
        setRecLoading(false);
        return;
      }

      if (!isFashionRelated(content)) {
        const fallback: ChatMessage = {
          id: `m-${Date.now()}-a`,
          role: 'assistant',
          content: OFF_TOPIC_FALLBACK,
          time: now(),
        };
        setMessages((prev) => [...prev, fallback]);
        setThinking(false);
        setRecLoading(false);
        return;
      }

      setRecLoading(true);
      const rec = matchRecommendation(content);
      const reply: ChatMessage = {
        id: `m-${Date.now()}-a`,
        role: 'assistant',
        content: buildReplyText(rec),
        time: now(),
      };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
      setRecommendation(rec);
      setRecLoading(false);
    }, 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Chat */}
      <Card className="flex h-[calc(100vh-9rem)] flex-col border-pink-100/80 lg:col-span-3">
        <div className="flex items-center gap-3 border-b border-pink-100/80 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-pink-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium leading-tight">Sparkle Stylist</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online · your personal fashion buddy
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setMessages([messages[0]]);
              setRecommendation(null);
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="space-y-4 p-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    SparkleCloset AI is styling…
                  </p>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-rose-400 animate-pulse-soft"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Prompt chips */}
        <div className="border-t border-pink-100/80 px-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {stylingPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => send(p.prompt)}
                className="rounded-full border border-pink-200 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-rose-300 hover:bg-pink-50 hover:text-rose-600"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send(input);
            }}
            placeholder="What's the occasion today?"
            className="flex-1 rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
          <Button
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
            className="h-11 w-11 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Recommendation panel */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden border-pink-100/80">
          <div className="flex items-center justify-between border-b border-pink-100/80 p-4">
            <div>
              <p className="font-display text-base font-semibold">
                Your outfit
              </p>
              <p className="text-xs text-muted-foreground">
                Pulled from your closet
              </p>
            </div>
            <Badge className="gap-1 border-pink-200 bg-pink-50 text-rose-600">
              <Sparkles className="h-3 w-3" /> AI
            </Badge>
          </div>

          {recLoading ? (
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          ) : !recommendation ? (
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-rose-300">
                <Heart className="h-8 w-8" />
              </div>
              <p className="mt-4 font-medium">No outfit yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Tell your stylist what's on today and your outfit will appear
                here with a full breakdown.
              </p>
            </CardContent>
          ) : (
            <CardContent className="p-5">
              <div className="relative mb-4 flex h-28 overflow-hidden rounded-xl">
                {recommendation.pieces.map((piece, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: piece.hue }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <div className="rounded-lg bg-white/85 px-3 py-1.5 text-center backdrop-blur">
                    <p className="text-xs font-medium text-rose-600">
                      {recommendation.confidence}% confidence
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">
                    {recommendation.title}
                  </h3>
                  <Badge variant="secondary">{recommendation.vibe}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {recommendation.summary}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  The look
                </p>
                {recommendation.pieces.map((piece) => (
                  <div
                    key={piece.name}
                    className="flex items-start gap-3 rounded-xl border border-pink-100/80 p-3 transition-colors hover:border-rose-200 hover:bg-pink-50/30"
                  >
                    <div
                      className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-black/5"
                      style={{ backgroundColor: piece.hue }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{piece.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {piece.category}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {piece.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Palette className="h-3 w-3" /> Color palette
                </p>
                <div className="flex gap-2">
                  {recommendation.palette.map((c, i) => (
                    <div key={i} className="flex-1">
                      <div
                        className="h-10 w-full rounded-lg ring-1 ring-black/5"
                        style={{ backgroundColor: c }}
                      />
                      <p className="mt-1 text-center text-[10px] text-muted-foreground">
                        {c}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-pink-50/60 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-rose-600">
                  Stylist tips
                </p>
                <ul className="space-y-1.5">
                  {recommendation.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-xs text-muted-foreground"
                    >
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-rose-300" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                  Love it
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Share
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

// --- Chat bubble with structured rendering -------------------------------

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isAssistant = msg.role === 'assistant';
  const lines = msg.content.split('\n');

  return (
    <div className={cn('flex gap-3', !isAssistant && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium',
          isAssistant
            ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {isAssistant ? <Sparkles className="h-4 w-4" /> : 'Y'}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
          isAssistant
            ? 'rounded-tl-sm bg-muted text-foreground'
            : 'rounded-tr-sm bg-gradient-to-br from-rose-400 to-pink-500 text-white'
        )}
      >
        <div className="space-y-1.5">
          {lines.map((line, i) => {
            const isBullet = line.startsWith('•');
            const isTip = line.startsWith('✨');
            if (isBullet) {
              const [label, ...rest] = line.replace(/^•\s*/, '').split(' — ');
              return (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      isAssistant ? 'bg-rose-400' : 'bg-white/70'
                    )}
                  />
                  <p className="leading-relaxed">
                    <span className="font-medium">{label}</span>
                    {rest.length > 0 && (
                      <span
                        className={cn(
                          isAssistant
                            ? 'text-muted-foreground'
                            : 'text-white/80'
                        )}
                      >
                        {' — '}
                        {rest.join(' — ')}
                      </span>
                    )}
                  </p>
                </div>
              );
            }
            if (isTip) {
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="shrink-0">✨</span>
                  <p
                    className={cn(
                      'leading-relaxed',
                      isAssistant ? 'text-muted-foreground' : 'text-white/85'
                    )}
                  >
                    {line.replace(/^✨\s*/, '')}
                  </p>
                </div>
              );
            }
            if (line.trim() === '') {
              return <div key={i} className="h-1" />;
            }
            return (
              <p key={i} className="leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
        <p
          className={cn(
            'mt-2 text-xs',
            isAssistant ? 'text-muted-foreground' : 'text-white/70'
          )}
        >
          {msg.time}
        </p>
      </div>
    </div>
  );
}
