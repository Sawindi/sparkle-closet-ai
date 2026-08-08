'use client';

import { useState } from 'react';
import {
  Calendar,
  Plus,
  X,
  Sparkles,
  Check,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Dumbbell,
  PartyPopper,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  plannedOutfits,
  outfitSuggestions,
  vibeAccent,
  vibeColor,
  type PlannedOutfit,
  type StyleVibe,
} from '@/lib/data';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const dayAbbrev: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

const vibeIcons: Record<StyleVibe, LucideIcon> = {
  Casual: Coffee,
  Elegant: PartyPopper,
  Sporty: Dumbbell,
  Cozy: Moon,
  Edgy: Sun,
};

export function PlannerView() {
  const [planner, setPlanner] =
    useState<Record<string, PlannedOutfit | null>>(
      () =>
        Object.fromEntries(
          days.map((d) => {
            const found = plannedOutfits.find((p) => p.day === d);
            return [d, found && found.title ? found : null];
          })
        )
    );
  const [draggedSuggestion, setDraggedSuggestion] =
    useState<PlannedOutfit | null>(null);
  const [draggedDay, setDraggedDay] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  const [assigningDay, setAssigningDay] = useState<string | null>(null);

  const assignOutfit = (day: string, outfit: PlannedOutfit) => {
    setPlanner((prev) => ({ ...prev, [day]: { ...outfit, day } }));
    setAssigningDay(null);
  };

  const clearDay = (day: string) => {
    setPlanner((prev) => ({ ...prev, [day]: null }));
  };

  const handleDropOnDay = (day: string) => {
    if (draggedSuggestion) {
      assignOutfit(day, draggedSuggestion);
    } else if (draggedDay && draggedDay !== day) {
      const moved = planner[draggedDay];
      setPlanner((prev) => ({
        ...prev,
        [draggedDay]: prev[day],
        [day]: moved,
      }));
    }
    setDraggedSuggestion(null);
    setDraggedDay(null);
    setDragOverDay(null);
  };

  const filledCount = Object.values(planner).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            This week's outfits
          </h2>
          <p className="text-sm text-muted-foreground">
            {filledCount} of 7 days planned · drag a look onto any day
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const dayToFill = days.find((d) => !planner[d]);
            if (dayToFill) {
              const suggestion =
                outfitSuggestions[
                  Math.floor(Math.random() * outfitSuggestions.length)
                ];
              assignOutfit(dayToFill, suggestion);
            }
          }}
        >
          <Sparkles className="mr-2 h-4 w-4 text-rose-400" />
          Auto-fill a day
        </Button>
      </div>

      {/* Suggestion tray */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Drag a look to a day
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {outfitSuggestions.map((sug) => {
            const Icon = vibeIcons[sug.vibe];
            return (
              <div
                key={sug.title}
                draggable
                onDragStart={() => setDraggedSuggestion(sug)}
                onDragEnd={() => setDraggedSuggestion(null)}
                className="group cursor-grab rounded-xl border border-pink-100 bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md hover:shadow-pink-500/10 active:cursor-grabbing"
              >
                <div className="mb-2 flex h-8 w-full overflow-hidden rounded-lg">
                  {sug.palette.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{sug.title}</p>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-md',
                      vibeAccent[sug.vibe]
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {sug.pieces.join(' · ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {days.map((day) => {
          const outfit = planner[day];
          const Icon = outfit ? vibeIcons[outfit.vibe] : Calendar;
          const isDragOver = dragOverDay === day;
          return (
            <Card
              key={day}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverDay(day);
              }}
              onDragLeave={() => setDragOverDay(null)}
              onDrop={(e) => {
                e.preventDefault();
                handleDropOnDay(day);
              }}
              className={cn(
                'group relative min-h-[180px] overflow-hidden border-pink-100/80 transition-all',
                isDragOver && 'border-rose-400 bg-rose-50/50 scale-[1.02]',
                outfit && 'hover:border-rose-200'
              )}
            >
              <CardContent className="flex h-full flex-col p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold',
                        outfit
                          ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
                          : 'bg-pink-50 text-rose-400'
                      )}
                    >
                      {dayAbbrev[day][0]}
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {day}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {outfit ? outfit.vibe : 'Open'}
                      </p>
                    </div>
                  </div>
                  {outfit && (
                    <button
                      onClick={() => clearDay(day)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-rose-100 hover:text-rose-500 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {outfit ? (
                  <div
                    className="flex flex-1 flex-col"
                    draggable
                    onDragStart={() => setDraggedDay(day)}
                    onDragEnd={() => setDraggedDay(null)}
                  >
                    <div className="mb-3 flex h-10 w-full overflow-hidden rounded-lg ring-1 ring-black/5">
                      {outfit.palette.map((c, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-md',
                          vibeAccent[outfit.vibe]
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <p className="text-sm font-medium leading-tight">
                        {outfit.title}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {outfit.pieces.map((piece) => (
                        <li
                          key={piece}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          <Check className="h-3 w-3 text-rose-300" />
                          {piece}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <button
                    onClick={() => setAssigningDay(day)}
                    className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-pink-200 text-muted-foreground transition-colors hover:border-rose-300 hover:bg-pink-50/30 hover:text-rose-500"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-xs">Add outfit</span>
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Summary card */}
        <Card className="relative overflow-hidden border-pink-100 bg-gradient-to-br from-rose-50/80 to-pink-50/50">
          <CardContent className="flex h-full flex-col justify-center p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium">Week summary</p>
            </div>
            <div className="space-y-2.5">
              {days.map((day) => {
                const outfit = planner[day];
                return (
                  <div
                    key={day}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {dayAbbrev[day]}
                    </span>
                    {outfit ? (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: vibeColor[outfit.vibe] }}
                        />
                        <span className="font-medium">{outfit.vibe}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign modal */}
      {assigningDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setAssigningDay(null)}
        >
          <Card
            className="w-full max-w-md border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-base font-semibold">
                    Pick a look for {assigningDay}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap to assign, or drag from the tray above.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAssigningDay(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {outfitSuggestions.map((sug) => {
                  const Icon = vibeIcons[sug.vibe];
                  return (
                    <button
                      key={sug.title}
                      onClick={() => assignOutfit(assigningDay, sug)}
                      className="flex w-full items-center gap-3 rounded-xl border border-pink-100 p-3 text-left transition-all hover:border-rose-200 hover:bg-pink-50/40"
                    >
                      <div className="flex h-10 w-10 overflow-hidden rounded-lg ring-1 ring-black/5">
                        {sug.palette.map((c, i) => (
                          <div
                            key={i}
                            className="flex-1"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{sug.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {sug.pieces.join(' · ')}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-md',
                          vibeAccent[sug.vibe]
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
