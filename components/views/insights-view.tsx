'use client';

import { useEffect, useState } from 'react';
import {
  Shirt,
  Footprints,
  Watch,
  Sparkles,
  TrendingUp,
  Heart,
  Palette,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  closetItems,
  styleStats,
  topColors,
  vibeAccent,
  vibeColor,
  type ClosetCategory,
} from '@/lib/data';

const categoryIcons: Record<ClosetCategory, LucideIcon> = {
  Tops: Shirt,
  Bottoms: Shirt,
  Shoes: Footprints,
  Accessories: Watch,
};

const categoryCounts: { category: ClosetCategory; count: number }[] = [
  { category: 'Tops', count: 6 },
  { category: 'Bottoms', count: 4 },
  { category: 'Shoes', count: 4 },
  { category: 'Accessories', count: 4 },
];

const totalItems = closetItems.length;
const totalWears = closetItems.reduce((sum, i) => sum + i.wears, 0);
const favoritesCount = closetItems.filter((i) => i.favorite).length;
const mostWorn = [...closetItems].sort((a, b) => b.wears - a.wears)[0];
const leastWorn = [...closetItems]
  .filter((i) => i.wears > 0)
  .sort((a, b) => a.wears - b.wears)[0];

export function InsightsView() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total items',
            value: totalItems,
            icon: Layers,
            sub: 'in your closet',
            accent: 'from-rose-400 to-pink-500',
          },
          {
            label: 'Total wears',
            value: totalWears,
            icon: TrendingUp,
            sub: 'all-time',
            accent: 'from-fuchsia-400 to-rose-400',
          },
          {
            label: 'Favorites',
            value: favoritesCount,
            icon: Heart,
            sub: 'loved pieces',
            accent: 'from-amber-400 to-rose-400',
          },
          {
            label: 'Style vibes',
            value: styleStats.length,
            icon: Sparkles,
            sub: 'distinct moods',
            accent: 'from-pink-400 to-fuchsia-400',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="relative overflow-hidden border-pink-100/80 transition-all hover:shadow-lg hover:shadow-pink-500/5"
            >
              <CardContent className="p-5">
                <div
                  className={cn(
                    'mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
                    stat.accent
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="font-display text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                )}
                <p className="mt-0.5 text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Style breakdown donut + bars */}
        <Card className="border-pink-100/80">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-rose-500">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">
                  Your style breakdown
                </h3>
                <p className="text-xs text-muted-foreground">
                  How your closet leans by vibe
                </p>
              </div>
            </div>

            {/* Donut */}
            <div className="mb-6 flex items-center justify-center">
              <DonutChart
                segments={styleStats.map((s) => ({
                  value: s.percent,
                  color: vibeColor[s.vibe],
                  label: s.vibe,
                }))}
                loading={loading}
              />
            </div>

            {/* Bars */}
            <div className="space-y-3">
              {styleStats.map((stat) => (
                <div key={stat.vibe}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                        vibeAccent[stat.vibe]
                      )}
                    >
                      {stat.vibe}
                    </span>
                    <span className="text-muted-foreground">
                      {stat.count} items · {stat.percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: loading ? '0%' : `${stat.percent}%`,
                        backgroundColor: vibeColor[stat.vibe],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top colors */}
        <Card className="border-pink-100/80">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-rose-500">
                <Palette className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">
                  Most-worn colors
                </h3>
                <p className="text-xs text-muted-foreground">
                  The palette in your closet
                </p>
              </div>
            </div>

            {/* Color grid */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {topColors.map((c) => (
                <div
                  key={c.color}
                  className="flex flex-col items-center rounded-xl border border-pink-100/80 p-3 text-center"
                >
                  <div
                    className="mb-2 h-12 w-12 rounded-full ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="text-xs font-medium leading-tight">
                    {c.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.count} items
                  </p>
                </div>
              ))}
            </div>

            {/* Color distribution */}
            <div className="space-y-2.5">
              {topColors.map((c) => (
                <div key={c.color} className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/5"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">
                    {c.color}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: loading ? '0%' : `${c.percent}%`,
                        backgroundColor: c.hex,
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-medium">
                    {c.percent}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category split */}
        <Card className="border-pink-100/80">
          <CardContent className="p-6">
            <h3 className="mb-4 font-display text-base font-semibold">
              By category
            </h3>
            <div className="space-y-3">
              {categoryCounts.map((cat) => {
                const Icon = categoryIcons[cat.category];
                const pct = Math.round((cat.count / totalItems) * 100);
                return (
                  <div key={cat.category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-rose-400" />
                        {cat.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cat.count} · {pct}%
                      </span>
                    </div>
                    <Progress
                      value={loading ? 0 : pct}
                      className="h-2 bg-pink-100"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Most worn */}
        <Card className="border-pink-100/80">
          <CardContent className="p-6">
            <h3 className="mb-4 font-display text-base font-semibold">
              Wear champions
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-pink-100/80 p-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-black/5"
                  style={{ backgroundColor: mostWorn.colorHex }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{mostWorn.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Most worn · {mostWorn.wears} wears
                  </p>
                </div>
                <Badge className="gap-1 border-rose-200 bg-rose-50 text-rose-600">
                  <TrendingUp className="h-3 w-3" /> Top
                </Badge>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-pink-100/80 p-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-black/5"
                  style={{ backgroundColor: leastWorn.colorHex }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{leastWorn.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Least worn · {leastWorn.wears} wears
                  </p>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  Needs love
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun fact */}
        <Card className="relative overflow-hidden border-pink-100 bg-gradient-to-br from-rose-50/80 to-pink-50/50">
          <CardContent className="flex h-full flex-col justify-center p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium">Style sparkle</p>
            </div>
            <p className="font-display text-lg leading-snug text-balance">
              You're{' '}
              <span className="text-rose-600">40% Casual</span> with a soft spot
              for <span className="text-fuchsia-600">Elegant</span> pieces.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your closet loves white & cream tones and you reach for your white
              sneakers the most. Try mixing in your silk blouse this week for a
              fresh combo!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DonutChart({
  segments,
  loading,
}: {
  segments: { value: number; color: string; label: string }[];
  loading: boolean;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#fce7f3"
          strokeWidth="18"
        />
        {!loading &&
          segments.map((seg, i) => {
            const dash = (seg.value / total) * circumference;
            const circle = (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
            );
            offset += dash;
            return circle;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {loading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className="font-display text-2xl font-semibold">{totalItems}</p>
        )}
        <p className="text-xs text-muted-foreground">items</p>
      </div>
    </div>
  );
}
