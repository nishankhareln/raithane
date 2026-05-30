'use client'
import { useState } from 'react'
import { LayoutGrid, CalendarCheck, Truck, Globe, type LucideIcon } from 'lucide-react'
import { SKILLS } from '@/lib/mock'
import { SkillCard } from '@/components/cards'
import { SectionHeader, cx } from '@/components/ui'
import { useCreations, toSkill } from '@/lib/userStore'

const FILTERS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: 'ALL', label: 'All', icon: LayoutGrid },
  { key: 'IN_PERSON', label: 'In person', icon: CalendarCheck },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DIGITAL', label: 'Online', icon: Globe },
]

export default function SkillsPage() {
  const [f, setF] = useState('ALL')
  const creations = useCreations()
  const all = [...creations.filter(c => c.kind === 'skill').map(toSkill), ...SKILLS]
  const list = f === 'ALL' ? all : all.filter(s => s.delivery === f)
  return (
    <div className="space-y-5">
      <SectionHeader title="Skills & experiences" sub="Book real experiences and crafts from locals. They keep 90% of every booking." />
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {FILTERS.map(x => (
          <button key={x.key} onClick={() => setF(x.key)}
            className={cx('flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition',
              f === x.key ? 'bg-forest text-white' : 'border border-sand bg-white text-stone/60')}>
            <x.icon size={15} /> {x.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(s => <SkillCard key={s.id} skill={s} />)}
      </div>
    </div>
  )
}
