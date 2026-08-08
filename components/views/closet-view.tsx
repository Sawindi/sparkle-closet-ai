'use client';

import { useMemo, useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  Sparkles,
  Heart,
  Search,
  Check,
  Loader2,
  Shirt,
  Footprints,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  closetItems,
  categoryIcon,
  vibeAccent,
  type ClosetItem,
  type ClosetCategory,
} from '@/lib/data';

interface UploadingItem {
  id: string;
  name: string;
  progress: number;
}

const categories: (ClosetCategory | 'All')[] = [
  'All',
  'Tops',
  'Bottoms',
  'Shoes',
  'Accessories',
];

const categoryEmoji: Record<ClosetCategory, string> = {
  Tops: '👕',
  Bottoms: '👖',
  Shoes: '👟',
  Accessories: '✨',
};

export function ClosetView() {
  const [items, setItems] = useState<ClosetItem[]>(closetItems);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [filter, setFilter] = useState<ClosetCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchCat = filter === 'All' || item.category === filter;
        const matchQuery =
          !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.brand.toLowerCase().includes(query.toLowerCase()) ||
          item.aiTags.some((t) =>
            t.toLowerCase().includes(query.toLowerCase())
          );
        return matchCat && matchQuery;
      }),
    [items, filter, query]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {
      All: items.length,
      Tops: 0,
      Bottoms: 0,
      Shoes: 0,
      Accessories: 0,
    };
    items.forEach((i) => (map[i.category] = (map[i.category] || 0) + 1));
    return map;
  }, [items]);

  const simulateUpload = (files: File[]) => {
    files.forEach((file, idx) => {
      const id = `up-${Date.now()}-${idx}`;
      setUploading((prev) => [...prev, { id, name: file.name, progress: 0 }]);
      const interval = setInterval(() => {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, progress: Math.min(u.progress + 12, 100) }
              : u
          )
        );
      }, 180);
      setTimeout(() => {
        clearInterval(interval);
        setUploading((prev) => prev.filter((u) => u.id !== id));
        const hues = ['#f87171', '#fb923c', '#a3e635', '#60a5fa', '#c084fc'];
        const vibes: ClosetItem['vibe'][] = [
          'Casual',
          'Cozy',
          'Sporty',
          'Elegant',
          'Edgy',
        ];
        const newItem: ClosetItem = {
          id: `w-${Date.now()}-${idx}`,
          name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          category: 'Tops',
          vibe: vibes[idx % vibes.length],
          color: 'New',
          colorHex: hues[idx % hues.length],
          brand: 'Unbranded',
          aiTags: ['Analyzing…'],
          wears: 0,
          lastWorn: 'Just added',
          favorite: false,
          image: '',
        };
        setItems((prev) => [newItem, ...prev]);
      }, 2200);
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    simulateUpload(Array.from(files));
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.aiTags.includes('Analyzing…')
            ? {
                ...item,
                aiTags: ['AI-tagged', 'Cotton', 'Everyday'],
                color: 'Auto-detected',
              }
            : item
        )
      );
      setAnalyzing(false);
    }, 1800);
  };

  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-all lg:p-8',
          dragging
            ? 'border-rose-400 bg-rose-50/80 scale-[1.01]'
            : 'border-pink-200 bg-card hover:border-rose-300 hover:bg-pink-50/30'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
              dragging
                ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white scale-110'
                : 'bg-pink-100 text-rose-500 group-hover:scale-105'
            )}
          >
            <UploadCloud className="h-7 w-7" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-display text-base font-semibold">
              {dragging
                ? 'Drop to add to your closet'
                : 'Snap or drag clothes to add them'}
            </h3>
            <p className="text-sm text-muted-foreground">
              SparkleCloset AI tags each item's category, color & vibe
              automatically.
            </p>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Add photos
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                runAnalysis();
              }}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tagging…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Re-tag with AI
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {uploading.map((u) => (
            <Card key={u.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {u.progress < 100
                        ? `Uploading… ${u.progress}%`
                        : 'AI tagging…'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Category tabs + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                filter === cat
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-pink-100 hover:text-rose-600'
              )}
            >
              {cat !== 'All' && (
                <span className="text-xs">{categoryEmoji[cat as ClosetCategory]}</span>
              )}
              {cat}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs',
                  filter === cat
                    ? 'bg-white/25 text-white'
                    : 'bg-muted-foreground/10 text-muted-foreground'
                )}
              >
                {counts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items…"
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-rose-300 focus:ring-2 focus:ring-rose-100 sm:w-56"
          />
        </div>
      </div>

      {/* Category sections */}
      {filter === 'All' ? (
        <div className="space-y-8">
          {(Object.keys(categoryEmoji) as ClosetCategory[]).map((cat) => {
            const catItems = filtered.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;
            const Icon = categoryIcon[cat];
            return (
              <div key={cat}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-rose-500">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-base font-semibold">
                    {cat}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {catItems.length}
                  </Badge>
                </div>
                <ItemGrid
                  items={catItems}
                  onToggleFav={toggleFavorite}
                  onRemove={removeItem}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <ItemGrid
          items={filtered}
          onToggleFav={toggleFavorite}
          onRemove={removeItem}
        />
      )}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No items match your search. Try adding a new piece!
          </p>
        </div>
      )}
    </div>
  );
}

function ItemGrid({
  items,
  onToggleFav,
  onRemove,
}: {
  items: ClosetItem[];
  onToggleFav: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = categoryIcon[item.category];
        return (
          <Card
            key={item.id}
            className="group relative overflow-hidden border-pink-100/80 transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lg hover:shadow-pink-500/10"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute left-3 top-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-rose-500 backdrop-blur">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="absolute right-3 top-3 flex gap-1.5">
                <button
                  onClick={() => onToggleFav(item.id)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur transition-colors',
                    item.favorite
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 text-muted-foreground hover:text-rose-500'
                  )}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={item.favorite ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-muted-foreground backdrop-blur transition-colors hover:bg-rose-100 hover:text-rose-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur',
                    vibeAccent[item.vibe]
                  )}
                >
                  {item.vibe}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.brand} · {item.color}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.aiTags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs',
                      tag === 'Analyzing…'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-pink-50 text-rose-600'
                    )}
                  >
                    {tag !== 'Analyzing…' && <Check className="h-3 w-3" />}
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-pink-50 pt-3 text-xs text-muted-foreground">
                <span>{item.wears} wears</span>
                <span>Worn {item.lastWorn}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
