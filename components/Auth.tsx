'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { X, LogIn, UserPlus, Lock } from 'lucide-react'
import { cx } from './ui'

export type User = { id: string; name: string; email: string }
type AuthCtx = {
  user: User | null
  ready: boolean
  login: (email: string, pw: string) => { ok: boolean; error?: string }
  register: (name: string, email: string, pw: string) => { ok: boolean; error?: string }
  logout: () => void
  openAuth: (reason?: string) => void
  requireAuth: (reason: string, fn: () => void) => void
}
const Ctx = createContext<AuthCtx>({} as AuthCtx)
export const useAuth = () => useContext(Ctx)

const ACCTS = 'raithane_accounts'
const SESS = 'raithane_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const [reason, setReason] = useState('')

  useEffect(() => {
    // seed a ready-to-use demo account on first load
    try {
      const a = JSON.parse(localStorage.getItem(ACCTS) || '[]')
      if (!a.some((x: { email: string }) => x.email === 'demo@raithane.com')) {
        a.push({ id: 'u_demo', name: 'Demo Traveler', email: 'demo@raithane.com', pw: 'demo123' })
        localStorage.setItem(ACCTS, JSON.stringify(a))
      }
    } catch {}
    try { const s = localStorage.getItem(SESS); if (s) setUser(JSON.parse(s)) } catch {}
    setReady(true)
  }, [])

  const accts = () => { try { return JSON.parse(localStorage.getItem(ACCTS) || '[]') } catch { return [] } }
  const persist = (u: User) => { setUser(u); try { localStorage.setItem(SESS, JSON.stringify(u)) } catch {} }

  const register = useCallback((name: string, email: string, pw: string) => {
    email = email.toLowerCase().trim()
    if (!email || !pw) return { ok: false, error: 'Enter email and password' }
    const a = accts()
    if (a.find((x: { email: string }) => x.email === email)) return { ok: false, error: 'That email is already registered' }
    const u: User = { id: 'u_' + Date.now(), name: name.trim() || 'Traveler', email }
    a.push({ ...u, pw }); try { localStorage.setItem(ACCTS, JSON.stringify(a)) } catch {}
    persist(u); setPromptOpen(false)
    return { ok: true }
  }, [])

  const login = useCallback((email: string, pw: string) => {
    email = email.toLowerCase().trim()
    const f = accts().find((x: { email: string; pw: string }) => x.email === email && x.pw === pw)
    if (!f) return { ok: false, error: 'Wrong email or password' }
    persist({ id: f.id, name: f.name, email: f.email }); setPromptOpen(false)
    return { ok: true }
  }, [])

  const logout = useCallback(() => { setUser(null); try { localStorage.removeItem(SESS) } catch {} }, [])
  const openAuth = useCallback((r?: string) => { setReason(r || ''); setPromptOpen(true) }, [])
  const requireAuth = useCallback((r: string, fn: () => void) => {
    setUser(u => { if (u) { fn() } else { setReason(r); setPromptOpen(true) } return u })
  }, [])

  return (
    <Ctx.Provider value={{ user, ready, login, register, logout, openAuth, requireAuth }}>
      {children}
      {promptOpen && <AuthModal reason={reason} onClose={() => setPromptOpen(false)} login={login} register={register} />}
    </Ctx.Provider>
  )
}

function AuthModal({ reason, onClose, login, register }:
  { reason: string; onClose: () => void; login: AuthCtx['login']; register: AuthCtx['register'] }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const res = mode === 'login' ? login(email, pw) : register(name, email, pw)
    if (!res.ok) setErr(res.error || 'Something went wrong')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-stone/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="card w-full max-w-sm overflow-hidden rounded-t-3xl rise sm:rounded-3xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-sand px-5 py-3.5">
          <div className="flex items-center gap-2 font-black text-stone"><Lock size={17} className="text-clay" /> {mode === 'login' ? 'Sign in' : 'Create account'}</div>
          <button type="button" onClick={onClose} className="text-stone/40"><X size={20} /></button>
        </div>
        {reason && <div className="bg-clay/5 px-5 py-2 text-xs font-semibold text-clay">Sign in {reason}.</div>}
        <form onSubmit={submit} className="space-y-3 p-5">
          {mode === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none" />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email"
            className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none" />
          <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Password"
            className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none" />
          {err && <div className="text-xs font-semibold text-clay">{err}</div>}
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-clay py-2.5 text-sm font-black text-white hover:bg-clay-dark">
            {mode === 'login' ? <><LogIn size={16} /> Sign in</> : <><UserPlus size={16} /> Create account</>}
          </button>
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr('') }}
            className="w-full text-center text-xs font-semibold text-stone/55">
            {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </button>
          {mode === 'login' && (
            <button type="button" onClick={() => { setEmail('demo@raithane.com'); setPw('demo123'); setErr('') }}
              className="w-full rounded-lg bg-forest/10 py-2 text-center text-[11px] font-semibold text-forest">
              Use demo account · demo@raithane.com / demo123 (tap to fill)
            </button>
          )}
          <p className="text-center text-[10px] text-stone/40">Demo auth — stored in your browser, no real server.</p>
        </form>
      </div>
    </div>
  )
}
