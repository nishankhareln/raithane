'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { X, LogIn, UserPlus, Lock, Compass, Coins } from 'lucide-react'
import { cx } from './ui'

export type Role = 'tourist' | 'local'
export type User = { id: string; name: string; email: string; role: Role }
type AuthCtx = {
  user: User | null
  ready: boolean
  login: (email: string, pw: string) => { ok: boolean; error?: string }
  register: (name: string, email: string, pw: string, role: Role) => { ok: boolean; error?: string }
  logout: () => void
  requestLocal: () => void
  openAuth: (reason?: string, intent?: Role) => void
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
  const [intent, setIntent] = useState<Role | undefined>(undefined)
  const [confirmLocal, setConfirmLocal] = useState(false)

  useEffect(() => {
    // seed ready-to-use demo accounts (one tourist, one local) on first load
    try {
      const a = JSON.parse(localStorage.getItem(ACCTS) || '[]')
      const ensure = (acc: { id: string; name: string; email: string; pw: string; role: Role }) => { if (!a.some((x: { email: string }) => x.email === acc.email)) a.push(acc) }
      ensure({ id: 'u_demo', name: 'Demo Traveler', email: 'demo@raithane.com', pw: 'demo123', role: 'tourist' })
      ensure({ id: 'u_local', name: 'Demo Local', email: 'local@raithane.com', pw: 'local123', role: 'local' })
      localStorage.setItem(ACCTS, JSON.stringify(a))
    } catch {}
    try {
      const s = localStorage.getItem(SESS)
      if (s) { const u = JSON.parse(s); if (u && !u.role) u.role = 'tourist'; setUser(u) }
    } catch {}
    setReady(true)
  }, [])

  const accts = () => { try { return JSON.parse(localStorage.getItem(ACCTS) || '[]') } catch { return [] } }
  const persist = (u: User) => { setUser(u); try { localStorage.setItem(SESS, JSON.stringify(u)) } catch {} }

  const register = useCallback((name: string, email: string, pw: string, role: Role) => {
    email = email.toLowerCase().trim()
    if (!email || !pw) return { ok: false, error: 'Enter email and password' }
    const a = accts()
    if (a.find((x: { email: string }) => x.email === email)) return { ok: false, error: 'That email is already registered' }
    const u: User = { id: 'u_' + Date.now(), name: name.trim() || (role === 'local' ? 'Local creator' : 'Traveler'), email, role }
    a.push({ ...u, pw }); try { localStorage.setItem(ACCTS, JSON.stringify(a)) } catch {}
    persist(u); setPromptOpen(false)
    return { ok: true }
  }, [])

  const login = useCallback((email: string, pw: string) => {
    email = email.toLowerCase().trim()
    const f = accts().find((x: { email: string; pw: string }) => x.email === email && x.pw === pw)
    if (!f) return { ok: false, error: 'Wrong email or password' }
    persist({ id: f.id, name: f.name, email: f.email, role: f.role || 'tourist' }); setPromptOpen(false)
    return { ok: true }
  }, [])

  const logout = useCallback(() => { setUser(null); try { localStorage.removeItem(SESS) } catch {} }, [])

  const switchRole = useCallback((role: Role) => {
    setUser(u => {
      if (!u) return u
      const nu = { ...u, role }
      try {
        localStorage.setItem(SESS, JSON.stringify(nu))
        const a = accts().map((x: { email: string }) => x.email === u.email ? { ...x, role } : x)
        localStorage.setItem(ACCTS, JSON.stringify(a))
      } catch {}
      return nu
    })
  }, [])

  const requestLocal = useCallback(() => setConfirmLocal(true), [])

  const openAuth = useCallback((r?: string, i?: Role) => { setReason(r || ''); setIntent(i); setPromptOpen(true) }, [])
  const requireAuth = useCallback((r: string, fn: () => void) => {
    setUser(u => { if (u) { fn() } else { setReason(r); setIntent(undefined); setPromptOpen(true) } return u })
  }, [])

  return (
    <Ctx.Provider value={{ user, ready, login, register, logout, requestLocal, openAuth, requireAuth }}>
      {children}
      {promptOpen && <AuthModal reason={reason} intent={intent} onClose={() => setPromptOpen(false)} login={login} register={register} />}
      {confirmLocal && <BecomeLocalModal onConfirm={() => { switchRole('local'); setConfirmLocal(false) }} onClose={() => setConfirmLocal(false)} />}
    </Ctx.Provider>
  )
}

function BecomeLocalModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const [agree, setAgree] = useState(false)
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-stone/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="card w-full max-w-sm overflow-hidden rounded-t-3xl rise sm:rounded-3xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-sand px-5 py-3.5">
          <div className="flex items-center gap-2 font-black text-stone"><Coins size={17} className="text-forest" /> Become a local creator</div>
          <button type="button" onClick={onClose} className="text-stone/40"><X size={20} /></button>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-sm text-stone/70">As a local creator you can:</p>
          <ul className="space-y-1.5 text-sm text-stone/70">
            <li className="flex gap-2"><span className="font-bold text-forest">•</span> Post stories and skills, and keep <b>90%</b> of every payment.</li>
            <li className="flex gap-2"><span className="font-bold text-forest">•</span> Open the whole cultural library <b>free</b> — it’s your own heritage.</li>
          </ul>
          <div className="rounded-xl bg-paper/70 p-3 text-xs leading-relaxed text-stone/55">
            Tourists pay to unlock this content, and that money supports local creators. In the full app we verify you’re part of the community before you join as a local.
          </div>
          <label className="flex items-start gap-2 text-sm text-stone/75">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 accent-forest" />
            I’m a local sharing my own community’s culture.
          </label>
          <button disabled={!agree} onClick={onConfirm}
            className={cx('w-full rounded-full py-2.5 text-sm font-black text-white transition', agree ? 'bg-forest hover:brightness-95' : 'cursor-not-allowed bg-stone/30')}>
            Join as a local creator
          </button>
          <button type="button" onClick={onClose} className="w-full text-center text-xs font-semibold text-stone/55">Stay as a traveler</button>
        </div>
      </div>
    </div>
  )
}

function AuthModal({ reason, intent, onClose, login, register }:
  { reason: string; intent?: Role; onClose: () => void; login: AuthCtx['login']; register: AuthCtx['register'] }) {
  const [mode, setMode] = useState<'login' | 'register'>(intent ? 'register' : 'login')
  const [role, setRole] = useState<Role>(intent || 'tourist')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const res = mode === 'login' ? login(email, pw) : register(name, email, pw, role)
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
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: 'tourist' as Role, icon: Compass, title: "I'm exploring", sub: 'Discover places, unlock stories & book experiences' },
                { key: 'local' as Role, icon: Coins, title: "I'm a local", sub: 'Share stories & skills — keep 90% of every payment' },
              ]).map(o => {
                const O = o.icon, on = role === o.key
                return (
                  <button type="button" key={o.key} onClick={() => setRole(o.key)}
                    className={cx('rounded-xl border p-3 text-left transition', on ? 'border-clay bg-clay/5 ring-2 ring-clay/30' : 'border-sand bg-white hover:border-clay/40')}>
                    <O size={18} className={on ? 'text-clay' : 'text-stone/50'} />
                    <div className="mt-1.5 text-sm font-black text-stone">{o.title}</div>
                    <div className="text-[11px] leading-snug text-stone/55">{o.sub}</div>
                  </button>
                )
              })}
            </div>
          )}
          {mode === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder={role === 'local' ? 'Your name (shown on your posts)' : 'Your name'}
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
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setEmail('demo@raithane.com'); setPw('demo123'); setErr('') }}
                className="rounded-lg bg-clay/10 py-2 text-center text-[11px] font-semibold leading-tight text-clay">
                Tourist demo<br /><span className="font-normal text-stone/45">demo@raithane.com</span>
              </button>
              <button type="button" onClick={() => { setEmail('local@raithane.com'); setPw('local123'); setErr('') }}
                className="rounded-lg bg-forest/10 py-2 text-center text-[11px] font-semibold leading-tight text-forest">
                Local demo<br /><span className="font-normal text-stone/45">local@raithane.com</span>
              </button>
            </div>
          )}
          <p className="text-center text-[10px] text-stone/40">Demo auth — stored in your browser, no real server.</p>
        </form>
      </div>
    </div>
  )
}
