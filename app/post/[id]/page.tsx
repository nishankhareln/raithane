'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Lock, Eye, Heart, Play, BadgeCheck, ShieldCheck, MapPin } from 'lucide-react'
import { POSTS, REVIEWS, creatorOf, destOf, catOf, fmtNpr, photo } from '@/lib/mock'
import { Media, Avatar, Stars, Pill, MoneySplit, CreatorLine, cx } from '@/components/ui'
import Checkout from '@/components/Checkout'
import Phrasebook from '@/components/Phrasebook'
import NarrateButton from '@/components/NarrateButton'
import { useCreations, toPost } from '@/lib/userStore'
import { useAuth } from '@/components/Auth'
import { useComments, addComment } from '@/lib/social'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const creations = useCreations()
  const { user, requireAuth } = useAuth()
  const comments = useComments(id)
  const [unlocked, setUnlocked] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [draft, setDraft] = useState('')
  const post = [...creations.filter(c => c.kind === 'post').map(toPost), ...POSTS].find(p => p.id === id)
  const mine = creations.some(x => x.id === id)

  if (!post) return <div className="py-20 text-center text-stone/50">Post not found. <Link href="/" className="font-bold text-clay">Go home</Link></div>

  const c = creatorOf(post.creatorId), d = destOf(post.destinationId), cat = catOf(post.category)
  const Cat = cat.icon
  const isLocal = user?.role === 'local'
  const premium = post.type === 'PREMIUM'
  const freeForLocal = premium && isLocal && !unlocked && !mine
  const reveal = !premium || unlocked || mine || isLocal
  const story = post.story ?? fullerBody(post.title, c.name, d.name)

  const postComment = () => requireAuth('to comment', () => {
    if (!draft.trim() || !user) return
    addComment(id, { id: 'c' + Date.now(), userId: user.id, author: user.name, text: draft.trim(), createdAt: Date.now() })
    setDraft('')
  })

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-stone/55 hover:text-clay"><ArrowLeft size={16} /> Back to feed</Link>

      <Media src={post.imgSrc || photo(post.img, post.id, 1000, 680)} className="h-64 w-full rounded-3xl">
        <span className="absolute left-3 top-3"><Pill color={cat.color} soft={false}><Cat size={13} /> {cat.label}</Pill></span>
        {post.mediaType === 'VIDEO' && reveal && (
          <button className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-clay shadow-lg">
            <Play size={26} className="fill-clay" />
          </button>
        )}
      </Media>

      <div>
        <Link href={`/destination/${d.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-stone/50"><MapPin size={13} /> {d.name}, {d.district}</Link>
        <h1 className="mt-1 text-2xl font-black text-stone md:text-3xl">{post.title}</h1>
      </div>

      <div className="flex items-center justify-between">
        <CreatorLine creator={c} />
        <div className="flex items-center gap-3 text-sm text-stone/45">
          <span className="flex items-center gap-1"><Heart size={15} /> {post.likes}</span>
          <span className="flex items-center gap-1"><Eye size={15} /> {post.views.toLocaleString()}</span>
        </div>
      </div>

      {/* real-time AI narration (ElevenLabs) */}
      <NarrateButton text={`${post.title}. ${post.teaser}${reveal && !post.phrases ? ' ' + story : ''}`} />

      {/* free teaser — always visible */}
      <p className="text-[15px] leading-relaxed text-stone/80">{post.teaser}</p>

      {/* phrasebook (Language posts) — original + translation, tap to hear */}
      {post.phrases && (
        <Phrasebook
          phrases={reveal ? post.phrases : post.phrases.slice(0, 2)}
          origLang={post.origLang}
          sampleNote={reveal ? post.sampleNote : undefined}
          locked={reveal ? 0 : Math.max(0, post.phrases.length - 2)}
        />
      )}

      {/* locked premium phrasebook → unlock CTA */}
      {post.phrases && !reveal && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-sand bg-paper/60 p-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-white"><Lock size={22} /></div>
          <div>
            <div className="text-base font-black text-stone">Unlock all phrases</div>
            <div className="text-xs text-stone/55">Support {c.name} directly — they keep 90%.</div>
          </div>
          <div className="w-full max-w-xs"><MoneySplit amount={post.priceNpr} /></div>
          <button onClick={() => requireAuth('to unlock this', () => setCheckout(true))} className="flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-black text-white hover:bg-clay-dark">
            <ShieldCheck size={16} /> Unlock for {fmtNpr(post.priceNpr)}
          </button>
        </div>
      )}

      {!post.phrases && (reveal ? (
        <div className="space-y-3 rounded-2xl border border-forest/20 bg-forest/5 p-4 text-[15px] leading-relaxed text-stone/80">
          <div className="flex items-center gap-1.5 text-sm font-bold text-forest"><BadgeCheck size={16} /> {freeForLocal ? 'Free for locals — full story' : premium ? 'Unlocked — full story' : 'Full story'}</div>
          <p>{story}</p>
          <p>{post.language !== 'Nepali' && post.language !== 'English'
            ? `Recorded in ${post.language}. The original voice is preserved; a youth translator added the Nepali & English text below.`
            : `Shared by ${c.name} in their own words.`}</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-sand">
          {/* blurred preview sits behind and fills the box */}
          <div aria-hidden className="pointer-events-none absolute inset-0 select-none p-4 text-[15px] leading-relaxed text-stone/70 blur-[5px]">
            {story}
          </div>
          {/* unlock CTA is in normal flow, so the box always grows to fit the button */}
          <div className="relative flex flex-col items-center justify-center gap-3 bg-paper/70 p-5 text-center backdrop-blur-[2px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-white"><Lock size={22} /></div>
            <div>
              <div className="text-base font-black text-stone">Unlock the full story</div>
              <div className="text-xs text-stone/55">Support {c.name} directly — they keep 90%.</div>
            </div>
            <div className="w-full max-w-xs"><MoneySplit amount={post.priceNpr} /></div>
            <button onClick={() => requireAuth('to unlock this', () => setCheckout(true))}
              className="flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-black text-white hover:bg-clay-dark">
              <ShieldCheck size={16} /> Unlock for {fmtNpr(post.priceNpr)}
            </button>
          </div>
        </div>
      ))}

      {/* verified reviews */}
      <section className="border-t border-sand pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-black text-stone">Verified reviews</h2>
          <Stars value={4.9} />
        </div>
        <div className="space-y-2.5">
          {REVIEWS.map(r => (
            <div key={r.id} className="rounded-xl border border-sand bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone">{r.author}</span>
                <Stars value={r.rating} showNum={false} />
              </div>
              <p className="mt-1 text-sm text-stone/70">{r.comment}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-forest"><BadgeCheck size={12} /> Verified purchase · {r.daysAgo}d ago</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone/45">Only people who unlocked this can review it — that’s why every star is real.</p>
      </section>

      {/* comments */}
      <section className="border-t border-sand pt-4">
        <h2 className="mb-2 text-lg font-black text-stone">Comments ({comments.length})</h2>
        <div className="flex items-start gap-2">
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={2}
            placeholder={user ? 'Add a comment…' : 'Sign in to comment…'}
            className="flex-1 rounded-xl border border-sand bg-white p-2.5 text-sm outline-none" />
          <button onClick={postComment} className="shrink-0 rounded-full bg-clay px-4 py-2 text-sm font-bold text-white hover:bg-clay-dark">Post</button>
        </div>
        <div className="mt-3 space-y-2">
          {comments.length === 0 && <p className="text-sm text-stone/45">Be the first to comment.</p>}
          {comments.map(cm => (
            <div key={cm.id} className="rounded-xl border border-sand bg-white p-3">
              <div className="text-sm font-bold text-stone">{cm.author}</div>
              <p className="mt-0.5 text-sm text-stone/70">{cm.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Checkout open={checkout} onClose={() => setCheckout(false)} onDone={() => setUnlocked(true)}
        title="Unlock this story" subtitle={post.title} amount={post.priceNpr} creatorName={c.name} cta="Unlock" />
    </div>
  )
}

function fullerBody(title: string, creator: string, place: string) {
  return `Here in ${place}, this isn’t a performance for visitors — it’s daily life. ${creator} walks you through every step the way it was taught to them: the small details that books leave out, the reasons behind each choice, and the mistakes to avoid. By the end you won’t just have watched “${title.toLowerCase()}” — you’ll understand why it matters, and you’ll carry a piece of ${place} with you. Your unlock pays ${creator} directly, so this knowledge stays worth keeping alive.`
}
