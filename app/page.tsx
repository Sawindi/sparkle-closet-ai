'use client';

import { useState } from 'react';
import { AppShell, type ViewId } from '@/components/app-shell';
import { ClosetView } from '@/components/views/closet-view';
import { StylistView } from '@/components/views/stylist-view';
import { PlannerView } from '@/components/views/planner-view';
import { InsightsView } from '@/components/views/insights-view';

export default function Home() {
  const [view, setView] = useState<ViewId>('closet');

  return (
    <AppShell activeView={view} onViewChange={setView}>
      <div key={view} className="animate-fade-in-up">
        {view === 'closet' && <ClosetView />}
        {view === 'stylist' && <StylistView />}
        {view === 'planner' && <PlannerView />}
        {view === 'insights' && <InsightsView />}
      </div>
    </AppShell>
  );
}
