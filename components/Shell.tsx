'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Compass, Sparkles, Store, HeartHandshake, LayoutDashboard, Plus, Search, Bell, User, type LucideIcon } from 'lucide-react'
import { cx } from './ui'
import Logo from './Logo'
import { useAlerts, isActive } from '@/lib/alertStore'
import { useAuth } from './Auth'
import { useLang } from '@/lib/i18n'

const NAV: { href: string; en: string; ne: string; icon: LucideIcon; auth?: boolean }[] = [
  { href: '/', en: 'Home', ne: 'गृह', icon: Home },
  { href: '/explore', en: 'Explore', ne: 'अन्वेषण', icon: Compass },
  { href: '/vibe', en: 'Vibe', ne: 'भाव', icon: Sparkles },
  { href: '/skills', en: 'Skills', ne: 'सीप', icon: Store },
  { href: '/support', en: 'Support', ne: 'सहयोग', icon: HeartHandshake },
  { href: '/dashboard', en: 'Dashboard', ne: 'ड्यासबोर्ड', icon: LayoutDashboard, auth: true },
]
const T = {
  en: { search: 'Search a place, food, legend or skill…', create: 'Create', profile: 'My profile', proto: 'Prototype · payments mocked · every action pays a local' },
  ne: { search: 'ठाउँ, खाना, कथा वा सीप खोज्नुहोस्…', create: 'सिर्जना', profile: 'मेरो प्रोफाइल', proto: 'प्रोटोटाइप · भुक्तानी नक्कली · हरेक कार्यले स्थानीयलाई तिर्छ' },
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const { lang, setLang } = useLang()
  const [q, setQ] = useState('')
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href)
  const t = T[lang]
  const alertCount = useAlerts().filter(isActive).length
  const { user, openAuth, logout } = useAuth()

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="prayer-stripe h-1.5 w-full shrink-0" />

      <header className="glass sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-sand px-4 py-2.5 md:px-6">
        <Link href="/" className="flex items-center"><Logo size={30} /></Link>

        <form onSubmit={submitSearch} className="hidden max-w-md flex-1 items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-clay/40 md:flex">
          <Search size={15} className="text-stone/40" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.search}
            className="w-full bg-transparent text-sm text-stone outline-none placeholder:text-stone/40" />
          {q && <button type="submit" className="rounded-full bg-clay px-2.5 py-0.5 text-xs font-bold text-white">Go</button>}
        </form>

        <div className="flex items-center gap-2">
          <Link href="/alerts" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-stone/60 hover:text-clay" title="Live alerts">
            <Bell size={17} />
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-black text-white">{alertCount}</span>
            )}
          </Link>
          <div className="flex overflow-hidden rounded-full border border-sand text-xs font-bold">
            {(['en', 'ne'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={cx('px-2.5 py-1', lang === l ? 'bg-stone text-white' : 'bg-white text-stone/50')}>
                {l === 'en' ? 'EN' : 'ने'}
              </button>
            ))}
          </div>
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden max-w-20 truncate text-xs font-bold text-stone sm:block">{user.name.split(' ')[0]}</span>
              <button onClick={logout} title="Log out" className="rounded-full border border-sand bg-white px-2.5 py-1.5 text-xs font-bold text-stone/55 hover:text-clay">Logout</button>
            </div>
          ) : (
            <button onClick={() => openAuth()} className="rounded-full border border-clay bg-white px-3 py-1.5 text-sm font-bold text-clay hover:bg-clay hover:text-white">Sign in</button>
          )}
          <Link href="/upload" className="flex items-center gap-1.5 rounded-full bg-clay px-3.5 py-2 text-sm font-bold text-white shadow hover:bg-clay-dark">
            <Plus size={16} /> <span className="hidden sm:inline">{t.create}</span>
          </Link>
        </div>
      </header>

      {/* mobile search */}
      <form onSubmit={submitSearch} className="flex items-center gap-2 border-b border-sand bg-white/60 px-4 py-2 md:hidden">
        <Search size={15} className="text-stone/40" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.search}
          className="w-full bg-transparent text-sm text-stone outline-none placeholder:text-stone/40" />
        {q && <button type="submit" className="rounded-full bg-clay px-2.5 py-0.5 text-xs font-bold text-white">Go</button>}
      </form>

      <div className="flex flex-1">
        <aside className="sticky top-[3.25rem] hidden h-[calc(100vh-3.25rem)] w-56 shrink-0 flex-col gap-1 self-start border-r border-sand bg-sand/40 p-3 md:flex">
          <nav className="flex flex-1 flex-col gap-1">
            {NAV.filter(n => !n.auth || user).map(n => {
              const A = n.icon, on = active(n.href)
              return (
                <Link key={n.href} href={n.href}
                  className={cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition',
                    on ? 'bg-clay text-white shadow' : 'text-stone/60 hover:bg-white')}>
                  <A size={19} strokeWidth={on ? 2.6 : 2} /> {lang === 'en' ? n.en : n.ne}
                </Link>
              )
            })}
          </nav>
          {user && (
            <Link href="/creator/me" className="mt-2 flex items-center gap-3 rounded-xl border border-sand bg-white px-3 py-2.5 text-sm font-bold text-stone/70 hover:bg-paper">
              <User size={18} /> {t.profile}
            </Link>
          )}
          <div className="mt-3 rounded-xl bg-white/70 p-3 text-[10px] leading-relaxed text-stone/40">{t.proto}</div>
        </aside>

        <main className="flex-1 overflow-x-hidden pb-24 md:pb-8">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-8 md:py-7">{children}</div>
        </main>
      </div>

      <nav className="glass fixed bottom-0 left-0 z-40 flex w-full justify-between border-t border-sand px-1 py-1.5 md:hidden">
        {NAV.filter(n => !n.auth || user).map(n => {
          const A = n.icon, on = active(n.href)
          return (
            <Link key={n.href} href={n.href}
              className={cx('flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1', on ? 'text-clay' : 'text-stone/45')}>
              <A size={20} strokeWidth={on ? 2.6 : 2} />
              <span className="text-[9px] font-bold">{lang === 'en' ? n.en : n.ne}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
