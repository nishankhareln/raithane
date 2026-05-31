// ---------------------------------------------------------------------------
// Raithane — mock data (UI-first prototype). Swap for Prisma/SQLite later.
// Real photos via keyword (loremflickr); icons via lucide (no emoji).
// ---------------------------------------------------------------------------
import {
  UtensilsCrossed, BookOpen, Landmark, Languages, Drama, PartyPopper, Palette,
  Flower2, Mountain, Compass, Flame, type LucideIcon,
} from 'lucide-react'

export const PLATFORM_FEE = 0.1
export const fmtNpr = (n: number) => '₨ ' + n.toLocaleString('en-IN')
export const split = (amount: number) => {
  const fee = Math.round(amount * PLATFORM_FEE)
  return { gross: amount, fee, creator: amount - fee }
}

/** Real keyword-matched photo (with a stable seed so each item keeps its image). */
export function photo(keywords: string, key: string | number, w = 800, h = 600) {
  const lock = typeof key === 'number' ? key : [...String(key)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(keywords)}?lock=${lock}`
}

export type CategoryKey = 'FOOD' | 'LEGEND' | 'HISTORY' | 'LANGUAGE' | 'CULTURE' | 'FESTIVAL' | 'RITUAL' | 'SKILL'
export const CATEGORIES: { key: CategoryKey; label: string; icon: LucideIcon; color: string }[] = [
  { key: 'FOOD', label: 'Food', icon: UtensilsCrossed, color: '#16a34a' },
  { key: 'LEGEND', label: 'Legend', icon: BookOpen, color: '#2563eb' },
  { key: 'HISTORY', label: 'History', icon: Landmark, color: '#0e7490' },
  { key: 'LANGUAGE', label: 'Language', icon: Languages, color: '#0891b2' },
  { key: 'CULTURE', label: 'Culture', icon: Drama, color: '#0ea5e9' },
  { key: 'FESTIVAL', label: 'Festival', icon: PartyPopper, color: '#4f46e5' },
  { key: 'RITUAL', label: 'Ritual', icon: Flame, color: '#7c3aed' },
  { key: 'SKILL', label: 'Skill', icon: Palette, color: '#16a34a' },
]
export const catOf = (k: CategoryKey) => CATEGORIES.find(c => c.key === k)!

export type VibeKey = 'spiritual' | 'adventure' | 'foodie' | 'festive' | 'artisan' | 'offbeat'
export const VIBES: { key: VibeKey; label: string; icon: LucideIcon; color: string; grad: string; img: string }[] = [
  { key: 'spiritual', label: 'Spiritual', icon: Flower2, color: '#2563eb', grad: 'linear-gradient(135deg,#2563eb,#0891b2)', img: 'nepal,temple,prayer' },
  { key: 'adventure', label: 'Adventure', icon: Mountain, color: '#16a34a', grad: 'linear-gradient(135deg,#16a34a,#0e9f6e)', img: 'annapurna,trek,mountain' },
  { key: 'foodie', label: 'Foodie', icon: UtensilsCrossed, color: '#0ea5e9', grad: 'linear-gradient(135deg,#0ea5e9,#2563eb)', img: 'nepali,food,thali' },
  { key: 'festive', label: 'Festive', icon: PartyPopper, color: '#16a34a', grad: 'linear-gradient(135deg,#16a34a,#2563eb)', img: 'nepal,festival,crowd' },
  { key: 'artisan', label: 'Artisan', icon: Palette, color: '#0891b2', grad: 'linear-gradient(135deg,#0891b2,#0e7490)', img: 'pottery,craft,handmade' },
  { key: 'offbeat', label: 'Offbeat', icon: Compass, color: '#2563eb', grad: 'linear-gradient(135deg,#2563eb,#16a34a)', img: 'nepal,village,hills' },
]
export const vibeOf = (k: VibeKey) => VIBES.find(v => v.key === k)!

export type Destination = {
  id: string; name: string; slug: string; district: string; lat: number; lng: number
  grad: string; img: string; imgSrc?: string; description: string; vibes: VibeKey[]
}
/** real photo if provided, else a keyword image */
export const destImg = (d: Destination, w = 800, h = 600) => d.imgSrc || photo(d.img, d.id, w, h)
export const DESTINATIONS: Destination[] = [
  { id: 'bandipur', name: 'Bandipur', slug: 'bandipur', district: 'Tanahun', lat: 27.9333, lng: 84.4167, grad: 'linear-gradient(135deg,#3b39e0,#14b8a6)', img: 'bandipur,nepal,town', vibes: ['offbeat', 'artisan', 'spiritual'], description: 'A preserved Newari hill town with a car-free bazaar, silk-cotton trees, and Himalaya views.' },
  { id: 'panauti', name: 'Panauti', slug: 'panauti', district: 'Kavre', lat: 27.5847, lng: 85.5158, grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)', img: 'panauti,nepal,temple', vibes: ['spiritual', 'festive', 'offbeat'], description: 'One of Nepal’s oldest towns, where two rivers meet and centuries-old temples still hold daily puja.' },
  { id: 'bhaktapur', name: 'Bhaktapur', slug: 'bhaktapur', district: 'Bhaktapur', lat: 27.6710, lng: 85.4298, grad: 'linear-gradient(135deg,#4f46e5,#3b39e0)', img: 'bhaktapur,durbar,square', vibes: ['festive', 'artisan', 'foodie'], description: 'The city of devotees — pottery squares, juju dhau curd, and living Malla-era architecture.' },
  { id: 'tansen', name: 'Tansen', slug: 'tansen', district: 'Palpa', lat: 27.8676, lng: 83.5460, grad: 'linear-gradient(135deg,#0ea5b7,#14b8a6)', img: 'tansen,palpa,nepal', vibes: ['offbeat', 'artisan', 'adventure'], description: 'A breezy Magar–Newari hill town famous for dhaka weaving and the view from Srinagar Hill.' },
  { id: 'ghandruk', name: 'Ghandruk', slug: 'ghandruk', district: 'Kaski', lat: 28.3762, lng: 83.8063, grad: 'linear-gradient(135deg,#3b39e0,#7c3aed)', img: 'ghandruk,annapurna,village', vibes: ['adventure', 'artisan', 'spiritual'], description: 'A stone-paved Gurung village under the Annapurnas — living mountain culture and warm homestays.' },
  { id: 'pokhara', name: 'Pokhara', slug: 'pokhara', district: 'Kaski', lat: 28.2096, lng: 83.9856, grad: 'linear-gradient(135deg,#2563eb,#0891b2)', img: 'pokhara,phewa,lake', vibes: ['adventure', 'foodie', 'offbeat'], description: 'Nepal’s lakeside adventure capital — Phewa Lake, paragliding, and a gateway to the Annapurnas.' },
  { id: 'kathmandu', name: 'Kathmandu', slug: 'kathmandu', district: 'Kathmandu', lat: 27.7172, lng: 85.3240, grad: 'linear-gradient(135deg,#16a34a,#2563eb)', img: 'kathmandu,durbar,square', vibes: ['spiritual', 'festive', 'foodie'], description: 'The valley capital — Durbar squares, living temples, Newari feasts, and centuries of art.' },
  { id: 'pashupatinath', name: 'Pashupatinath', slug: 'pashupatinath', district: 'Kathmandu', lat: 27.7106, lng: 85.3488, grad: 'linear-gradient(135deg,#7c3aed,#2563eb)', img: 'pashupatinath,temple,kathmandu', vibes: ['spiritual', 'festive', 'offbeat'], description: 'Nepal’s holiest Shiva temple, on the banks of the sacred Bagmati — a UNESCO site of golden roofs, cremation ghats, sadhus and the evening aarti.' },
  { id: 'boudhanath', name: 'Boudhanath', slug: 'boudhanath', district: 'Kathmandu', lat: 27.7215, lng: 85.3620, grad: 'linear-gradient(135deg,#2563eb,#0891b2)', img: 'boudhanath,stupa,kathmandu', vibes: ['spiritual', 'offbeat', 'artisan'], description: 'One of the world’s largest stupas and the heart of Tibetan Buddhism in Nepal — a giant mandala circled by pilgrims, prayer wheels and butter lamps.' },
  { id: 'swayambhunath', name: 'Swayambhunath', slug: 'swayambhunath', district: 'Kathmandu', lat: 27.7149, lng: 85.2903, grad: 'linear-gradient(135deg,#16a34a,#2563eb)', img: 'swayambhunath,stupa,monkey,temple', vibes: ['spiritual', 'adventure', 'offbeat'], description: 'The “Monkey Temple” on a hilltop west of the city — the all-seeing eyes of the Buddha, 365 steps, and a legend older than the valley itself.' },
  { id: 'durbar-square', name: 'Kathmandu Durbar Square', slug: 'durbar-square', district: 'Kathmandu', lat: 27.7045, lng: 85.3070, grad: 'linear-gradient(135deg,#4f46e5,#7c3aed)', img: 'kathmandu,durbar,square,palace', imgSrc: '/durbar-square.png', vibes: ['festive', 'artisan', 'spiritual'], description: 'The old royal plaza of the Malla and Shah kings — Hanuman Dhoka palace, exquisite woodcarving, and the home of the living goddess Kumari.' },
  { id: 'hadigaun', name: 'Hadigaun', slug: 'hadigaun', district: 'Kathmandu', lat: 27.7186, lng: 85.3380, grad: 'linear-gradient(135deg,#0e7490,#4f46e5)', img: 'kathmandu,newari,temple,courtyard', vibes: ['offbeat', 'spiritual', 'festive'], description: 'One of the Kathmandu Valley’s oldest towns — likely the lost Licchavi capital. Hidden courtyards, the Satya Narayan shrine where the valley’s earliest settlement was unearthed, and “Kahi Nabhayeko Jatra,” the festival like no other.' },
]
export const destOf = (id: string) => DESTINATIONS.find(d => d.id === id)!

export type Creator = {
  id: string; name: string; img: string; imgSrc?: string; grad: string; destinationId: string
  bio: string; rating: number; reviews: number; verified: boolean
  earningsMonth: number; followers: number; supporters: number
}
export const CREATORS: Creator[] = [
  { id: 'maya', name: 'Maya Gurung', img: 'nepali,woman,portrait', grad: 'linear-gradient(135deg,#3b39e0,#14b8a6)', destinationId: 'ghandruk', bio: 'Gurung host & cook. I share my grandmother’s recipes and our harvest songs.', rating: 4.9, reviews: 128, verified: true, earningsMonth: 41200, followers: 2140, supporters: 38 },
  { id: 'bishnu', name: 'Bishnu Prajapati', img: 'potter,man,nepal', grad: 'linear-gradient(135deg,#4f46e5,#3b39e0)', destinationId: 'bhaktapur', bio: 'Sixth-generation potter in Bhaktapur’s Pottery Square. The wheel is my family’s memory.', rating: 4.8, reviews: 96, verified: true, earningsMonth: 33500, followers: 1810, supporters: 27 },
  { id: 'sita', name: 'Sita Shakya', img: 'nepali,woman,face', grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)', destinationId: 'panauti', bio: 'Temple guide & storyteller. The legends of Panauti live in my voice.', rating: 5.0, reviews: 54, verified: true, earningsMonth: 21800, followers: 980, supporters: 19 },
  { id: 'kumar', name: 'Kumar Magar', img: 'nepali,man,portrait', grad: 'linear-gradient(135deg,#0ea5b7,#14b8a6)', destinationId: 'tansen', bio: 'Dhaka weaver in Tansen. Every pattern is a small mathematics of color.', rating: 4.7, reviews: 71, verified: true, earningsMonth: 18600, followers: 1230, supporters: 22 },
  { id: 'anita', name: 'Anita Newar', img: 'woman,cooking,asian', grad: 'linear-gradient(135deg,#f0a818,#e0892b)', destinationId: 'bandipur', bio: 'Newari kitchen keeper in Bandipur. Come taste a real samay baji.', rating: 4.9, reviews: 110, verified: true, earningsMonth: 29400, followers: 1670, supporters: 31 },
  { id: 'tashi', name: 'Tashi Lama', img: 'old,man,nepal', grad: 'linear-gradient(135deg,#3b39e0,#7c3aed)', destinationId: 'ghandruk', bio: 'Elder & keeper of mountain rituals. I record what must not be forgotten.', rating: 4.9, reviews: 43, verified: true, earningsMonth: 15200, followers: 760, supporters: 44 },
  { id: 'bikash', name: 'Bikash Pun', img: 'nepali,man,portrait', grad: 'linear-gradient(135deg,#2563eb,#0891b2)', destinationId: 'pokhara', bio: 'Lakeside guide in Pokhara — paragliding spotter, canoe paddler, sunrise chaser.', rating: 4.7, reviews: 88, verified: true, earningsMonth: 26500, followers: 2310, supporters: 29 },
  { id: 'nilam', name: 'Nilam Maharjan', img: 'nepali,woman,portrait', grad: 'linear-gradient(135deg,#16a34a,#2563eb)', destinationId: 'kathmandu', bio: 'Newari food & heritage guide in old Kathmandu. I cook, I tell stories, I walk you through it.', rating: 4.8, reviews: 75, verified: true, earningsMonth: 24000, followers: 1950, supporters: 26 },
  { id: 'ram', name: 'Ram Bhatta', img: 'nepali,priest,man', imgSrc: '/local-host.jpg', grad: 'linear-gradient(135deg,#7c3aed,#2563eb)', destinationId: 'pashupatinath', bio: 'Temple guide at Pashupatinath. I explain the rites at the ghats with care and respect.', rating: 4.8, reviews: 67, verified: true, earningsMonth: 22800, followers: 1340, supporters: 21 },
  { id: 'pema', name: 'Pema Sherpa', img: 'tibetan,woman,nepal', grad: 'linear-gradient(135deg,#2563eb,#0891b2)', destinationId: 'boudhanath', bio: 'Boudha local & Buddhist guide. I walk the kora with you and explain what each turn means.', rating: 4.9, reviews: 58, verified: true, earningsMonth: 20400, followers: 1120, supporters: 25 },
  { id: 'hari', name: 'Hari Joshi', img: 'nepali,man,portrait,heritage', grad: 'linear-gradient(135deg,#0e7490,#4f46e5)', destinationId: 'hadigaun', bio: 'Heritage guide and storyteller in Hadigaun. I walk you through the valley’s oldest courtyards and the jatra that happens nowhere else.', rating: 4.9, reviews: 49, verified: true, earningsMonth: 19800, followers: 1080, supporters: 23 },
  { id: 'sabita', name: 'Sabita Prajapati', img: 'nepali,woman,potter,portrait', grad: 'linear-gradient(135deg,#0891b2,#16a34a)', destinationId: 'hadigaun', bio: 'Born into a Hadigaun potter family. I cook the old Newar dishes and show you the courtyards I grew up in.', rating: 4.8, reviews: 37, verified: true, earningsMonth: 16400, followers: 820, supporters: 17 },
  { id: 'nabin', name: 'Nabin Shrestha', img: 'nepali,man,young,portrait', grad: 'linear-gradient(135deg,#4f46e5,#0e7490)', destinationId: 'hadigaun', bio: 'Hadigaun local and festival photographer. I time my walks to the jatra and know every hidden shrine.', rating: 4.7, reviews: 24, verified: false, earningsMonth: 9800, followers: 540, supporters: 9 },
]
// returns the seed creator, or a safe "You" fallback for the logged-in user's own ids
export const creatorOf = (id: string): Creator =>
  CREATORS.find(c => c.id === id) || {
    id, name: 'You', img: 'traveler,backpacker,person', grad: 'linear-gradient(135deg,#16a34a,#2563eb)',
    destinationId: 'kathmandu', bio: 'Your traveler profile on Raithane.',
    rating: 0, reviews: 0, verified: false, earningsMonth: 0, followers: 0, supporters: 0,
  }

export type Phrase = { original: string; roman: string; en: string; ne?: string }
export type Post = {
  id: string; creatorId: string; destinationId: string; category: CategoryKey
  type: 'FREE' | 'PREMIUM'; title: string; teaser: string; img: string; imgSrc?: string
  mediaType: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'TEXT'; priceNpr: number
  language: string; likes: number; views: number; durationMin?: number
  isTip?: boolean; tipHelpful?: number
  phrases?: Phrase[]; origLang?: string; sampleNote?: string
  story?: string
}
export const POSTS: Post[] = [
  { id: 'p1', creatorId: 'maya', destinationId: 'ghandruk', category: 'FOOD', type: 'PREMIUM', title: 'Cook real Dal Bhat the Gurung way', teaser: 'The secret isn’t the lentils — it’s the timing and the ghee. Free preview shows the spice base…', img: 'dal,bhat,nepali,food', mediaType: 'VIDEO', priceNpr: 250, language: 'Nepali', likes: 412, views: 5210, durationMin: 14 },
  { id: 'p2', creatorId: 'tashi', destinationId: 'ghandruk', category: 'CULTURE', type: 'PREMIUM', title: 'The Tamu Lhosar fire dance, explained', teaser: 'We circle the flame to send off the old year. The full ritual and its meaning, in my voice…', img: 'fire,dance,ritual', mediaType: 'VIDEO', priceNpr: 300, language: 'Gurung', likes: 980, views: 8120, durationMin: 11 },
  { id: 'p3', creatorId: 'sita', destinationId: 'panauti', category: 'LEGEND', type: 'PREMIUM', title: 'Why the rivers meet at Panauti', teaser: 'Three rivers, but you can only see two. The third is a goddess. The full legend awaits…', img: 'river,temple,nepal', mediaType: 'AUDIO', priceNpr: 150, language: 'Nepali', likes: 221, views: 3140, durationMin: 8 },
  { id: 'p4', creatorId: 'bishnu', destinationId: 'bhaktapur', category: 'CULTURE', type: 'FREE', title: 'Pottery Square at dawn', teaser: 'Before the tourists, the clay is quiet. A morning in my family’s workshop.', img: 'pottery,bhaktapur,clay', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 540, views: 9300 },
  { id: 'p5', creatorId: 'anita', destinationId: 'bandipur', category: 'FOOD', type: 'FREE', title: 'What is samay baji?', teaser: 'Beaten rice, smoked meat, ginger, egg — a Newari plate that tells a whole story.', img: 'newari,food,nepal', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 388, views: 6100 },
  { id: 'p6', creatorId: 'kumar', destinationId: 'tansen', category: 'CULTURE', type: 'PREMIUM', title: 'Reading a dhaka pattern', teaser: 'Every dhaka topi hides a grid of decisions. I’ll teach you to read one…', img: 'weaving,loom,textile', mediaType: 'VIDEO', priceNpr: 200, language: 'Nepali', likes: 174, views: 2480, durationMin: 9 },
  { id: 'p7', creatorId: 'sita', destinationId: 'panauti', category: 'FESTIVAL', type: 'FREE', title: 'Jya Punhi chariot festival', teaser: 'Once a year the gods ride through the old town. Here’s what to watch for.', img: 'nepal,festival,chariot', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 296, views: 4020 },
  { id: 'p8', creatorId: 'maya', destinationId: 'ghandruk', category: 'HISTORY', type: 'PREMIUM', title: 'How our stone houses are built', teaser: 'No cement, no nails — just stone, wood, and knowledge passed down. The full method…', img: 'stone,house,himalaya,village', mediaType: 'VIDEO', priceNpr: 180, language: 'Gurung', likes: 142, views: 1980, durationMin: 12 },

  { id: 't1', creatorId: 'maya', destinationId: 'ghandruk', category: 'HISTORY', type: 'FREE', title: 'Best time to walk up to the viewpoint', teaser: 'Leave by 5:10am — the clouds close in by 7. Wear layers, the steps are wet near the top.', img: 'annapurna,sunrise,mountain', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 1450, isTip: true, tipHelpful: 218 },
  { id: 't2', creatorId: 'anita', destinationId: 'bandipur', category: 'FOOD', type: 'FREE', title: 'The bazaar is busiest Fri–Sun', teaser: 'Come on a weekday for a quiet samay baji and to actually talk to the cooks. Most kitchens open by 11.', img: 'bandipur,street,bazaar', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 980, isTip: true, tipHelpful: 134 },
  { id: 't3', creatorId: 'bishnu', destinationId: 'bhaktapur', category: 'CULTURE', type: 'FREE', title: 'Pottery Square: where to stand for photos', teaser: 'Morning light hits the drying pots from the east corner. Ask before filming someone at the wheel.', img: 'pottery,wheel,clay', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 1120, isTip: true, tipHelpful: 167 },

  // Pokhara
  { id: 'pk1', creatorId: 'bikash', destinationId: 'pokhara', category: 'CULTURE', type: 'FREE', title: 'Phewa Lake at first light', teaser: 'Before the boats, the Annapurnas float on the water. My favorite five minutes in Pokhara.', img: 'pokhara,phewa,lake,boat', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 624, views: 11200 },
  { id: 'pk2', creatorId: 'bikash', destinationId: 'pokhara', category: 'LEGEND', type: 'PREMIUM', title: 'The legend of Tal Barahi temple', teaser: 'Why a temple sits on an island in the middle of Phewa. The full story, told on the water…', img: 'pokhara,temple,lake', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepali', likes: 188, views: 2640, durationMin: 9 },
  { id: 'pk3', creatorId: 'bikash', destinationId: 'pokhara', category: 'HISTORY', type: 'FREE', title: 'Best season & time to paraglide', teaser: 'Nov–Dec mornings are gold — calm air, clear peaks. Book the 9am slot from Sarangkot.', img: 'pokhara,paragliding,sky', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 1730, isTip: true, tipHelpful: 203 },
  // Kathmandu
  { id: 'kt1', creatorId: 'nilam', destinationId: 'kathmandu', category: 'HISTORY', type: 'FREE', title: 'Kathmandu Durbar Square at dusk', teaser: 'When the day-trippers leave, the old city breathes again. A walk through living history.', img: 'kathmandu,durbar,square,dusk', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 712, views: 13400 },
  { id: 'kt2', creatorId: 'nilam', destinationId: 'kathmandu', category: 'FOOD', type: 'PREMIUM', title: 'A Newari feast, course by course', teaser: 'Bara, chhoyla, samay baji, aila — what each dish means and how to eat it. Full guide…', img: 'newari,feast,kathmandu,food', mediaType: 'VIDEO', priceNpr: 280, language: 'Nepali', likes: 460, views: 5980, durationMin: 16 },

  // Rituals
  { id: 'rt1', creatorId: 'sita', destinationId: 'panauti', category: 'RITUAL', type: 'PREMIUM', title: 'Inside a Hindu wedding (Bibaha)', teaser: 'Saptapadi, sindoor, the seven vows around the sacred fire — what each step means. The full ceremony, explained…', img: 'nepali,hindu,wedding,ritual', mediaType: 'VIDEO', priceNpr: 280, language: 'Nepali', likes: 534, views: 7240, durationMin: 18 },
  { id: 'rt2', creatorId: 'nilam', destinationId: 'kathmandu', category: 'RITUAL', type: 'FREE', title: 'Pasni — a baby’s first rice', teaser: 'At six months we feed a child rice for the first time. The plate, the blessings, the choosing of objects that hint at their future.', img: 'baby,rice,ceremony,nepal', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 410, views: 6300 },
  { id: 'rt3', creatorId: 'tashi', destinationId: 'ghandruk', category: 'RITUAL', type: 'PREMIUM', title: 'Antyeshti — how we say farewell', teaser: 'Thirteen days in white, the rites of mourning and release. Told gently and with respect, so visitors understand rather than intrude…', img: 'nepal,butter,lamp,ritual', mediaType: 'AUDIO', priceNpr: 150, language: 'Gurung', likes: 188, views: 2410, durationMin: 12 },
  { id: 'rt4', creatorId: 'maya', destinationId: 'ghandruk', category: 'RITUAL', type: 'FREE', title: 'Teej — the red day of women', teaser: 'Women in red, fasting, singing and dancing for family and self. The joy, the meaning, and why the whole hillside turns crimson.', img: 'teej,festival,women,red,nepal', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 622, views: 9100 },

  // Language — original + translated phrasebooks
  {
    id: 'lg1', creatorId: 'nilam', destinationId: 'kathmandu', category: 'LANGUAGE', type: 'FREE',
    title: '10 Nepali phrases that make locals smile', teaser: 'The little words that light up a Nepali face. Tap any phrase to hear it.',
    img: 'nepal,people,talking', mediaType: 'AUDIO', priceNpr: 0, language: 'Nepali', likes: 845, views: 15200,
    origLang: 'Nepali',
    phrases: [
      { original: 'नमस्ते', roman: 'Namaste', en: 'Hello (I greet the divine in you)' },
      { original: 'धन्यवाद', roman: 'Dhanyabad', en: 'Thank you' },
      { original: 'मीठो छ', roman: 'Mitho cha', en: 'It’s delicious' },
      { original: 'कति हो?', roman: 'Kati ho?', en: 'How much is it?' },
      { original: 'कहाँ छ?', roman: 'Kahā cha?', en: 'Where is it?' },
      { original: 'सञ्चै हुनुहुन्छ?', roman: 'Sanchai hununchha?', en: 'How are you?' },
      { original: 'माफ गर्नुहोस्', roman: 'Maaf garnuhos', en: 'Sorry / excuse me' },
      { original: 'पानी कहाँ पाइन्छ?', roman: 'Pāni kahā painchha?', en: 'Where can I find water?' },
      { original: 'राम्रो छ', roman: 'Rāmro cha', en: 'It’s good / nice' },
      { original: 'भोलि भेटौंला', roman: 'Bholi bhetaunlā', en: 'See you tomorrow' },
    ],
  },
  {
    id: 'lg2', creatorId: 'maya', destinationId: 'ghandruk', category: 'LANGUAGE', type: 'PREMIUM',
    title: 'First words in Gurung (Tamu kyi)', teaser: 'Before Nepali, these hills spoke Gurung. An elder shares the first words — original voice preserved, translated by a local youth.',
    img: 'gurung,elder,village,nepal', mediaType: 'AUDIO', priceNpr: 200, language: 'Gurung', likes: 274, views: 3120, durationMin: 10,
    origLang: 'Gurung', sampleNote: 'Sample phrases — community-submitted, pending verification by a native Gurung speaker.',
    phrases: [
      { original: 'Lasso', roman: 'la-sso', ne: 'नमस्ते', en: 'Hello / greetings' },
      { original: 'Tigicho', roman: 'ti-gi-cho', ne: 'धन्यवाद', en: 'Thank you' },
      { original: 'Khaba chai?', roman: 'kha-ba chai', ne: 'खाना खानुभयो?', en: 'Have you eaten?' },
      { original: 'Tã syaba mu', roman: 'ta sya-ba mu', ne: 'राम्रो छ', en: 'It is good' },
    ],
  },
  {
    id: 'lg3', creatorId: 'nilam', destinationId: 'kathmandu', category: 'LANGUAGE', type: 'PREMIUM',
    title: 'Bargaining in Nepali (the friendly way)', teaser: 'Haggling here is warm, not rude — if you know the words. The phrases + the etiquette behind them.',
    img: 'nepal,market,shop,bargain', mediaType: 'AUDIO', priceNpr: 150, language: 'Nepali', likes: 312, views: 4080, durationMin: 7,
    origLang: 'Nepali',
    phrases: [
      { original: 'कति पर्छ?', roman: 'Kati parchha?', en: 'How much does it cost?' },
      { original: 'धेरै भयो', roman: 'Dherai bhayo', en: 'That’s too much' },
      { original: 'अलि घटाउनुहोस्', roman: 'Ali ghatāunuhos', en: 'Lower it a little, please' },
      { original: 'अन्तिम कति?', roman: 'Antim kati?', en: 'What’s your final price?' },
      { original: 'पुग्छ नि', roman: 'Pugcha ni', en: 'That’s enough — deal' },
    ],
  },

  // ===== Pashupatinath =====
  { id: 'ps1', creatorId: 'ram', destinationId: 'pashupatinath', category: 'LEGEND', type: 'PREMIUM', title: 'How Pashupatinath was found', teaser: 'Legend says a cow poured her milk on this spot each day. Villagers dug and found a glowing Shiva lingam — and the temple rose around it.', img: 'pashupatinath,shiva,temple', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepali', likes: 540, views: 8800, durationMin: 9 },
  { id: 'ps2', creatorId: 'ram', destinationId: 'pashupatinath', category: 'RITUAL', type: 'PREMIUM', title: 'The evening Bagmati aarti', teaser: 'At dusk, lamps, bells and chanting fill the riverbank as priests offer fire to the sacred Bagmati. What each gesture means…', img: 'aarti,river,lamp,nepal', mediaType: 'VIDEO', priceNpr: 250, language: 'Nepali', likes: 712, views: 10400, durationMin: 12 },
  { id: 'ps3', creatorId: 'ram', destinationId: 'pashupatinath', category: 'FESTIVAL', type: 'FREE', title: 'Maha Shivaratri at Pashupati', teaser: 'Once a year, hundreds of thousands of pilgrims and saffron-clad sadhus fill the temple for the great night of Shiva.', img: 'shivaratri,sadhu,pashupatinath', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 480, views: 7600 },
  { id: 'ps4', creatorId: 'ram', destinationId: 'pashupatinath', category: 'HISTORY', type: 'FREE', title: 'Visiting respectfully', teaser: 'Only Hindus enter the main courtyard; others get a beautiful view from across the river. Dress modestly, and never photograph cremations.', img: 'pashupatinath,bagmati,ghat', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 2100, isTip: true, tipHelpful: 264 },

  // ===== Boudhanath =====
  { id: 'bd1', creatorId: 'pema', destinationId: 'boudhanath', category: 'LEGEND', type: 'PREMIUM', title: 'The legend of Boudha Stupa', teaser: 'A poor woman asked a king for land the size of one buffalo hide — then cut it into fine strips to encircle this enormous dome. The full story…', img: 'boudhanath,stupa,prayer,flags', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepali', likes: 388, views: 5200, durationMin: 8 },
  { id: 'bd2', creatorId: 'pema', destinationId: 'boudhanath', category: 'RITUAL', type: 'FREE', title: 'Walking the kora at dusk', teaser: 'As lamps light up, pilgrims circle the stupa clockwise, spinning prayer wheels and murmuring mantras. Join the slow, glowing river of people.', img: 'boudhanath,kora,butter,lamp', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 624, views: 9100 },
  { id: 'bd3', creatorId: 'pema', destinationId: 'boudhanath', category: 'CULTURE', type: 'PREMIUM', title: 'Why Boudha is the heart of Tibetan Buddhism', teaser: 'After 1959, Boudha became home to thousands of Tibetans and dozens of monasteries. The mandala, the eyes, the symbolism — explained.', img: 'boudhanath,monastery,monk', mediaType: 'VIDEO', priceNpr: 220, language: 'Nepali', likes: 296, views: 4300, durationMin: 11 },
  { id: 'bd4', creatorId: 'pema', destinationId: 'boudhanath', category: 'CULTURE', type: 'FREE', title: 'Always walk clockwise', teaser: 'Circle the stupa and spin prayer wheels with your right hand, clockwise. Dawn and dusk are most magical — and best for photos.', img: 'boudhanath,prayer,wheel', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 1680, isTip: true, tipHelpful: 198 },

  // ===== Swayambhunath =====
  { id: 'sw1', creatorId: 'nilam', destinationId: 'swayambhunath', category: 'LEGEND', type: 'PREMIUM', title: 'Manjushri and the valley lake', teaser: 'The Kathmandu valley was once a vast lake with a lotus of light at its centre. The bodhisattva Manjushri cut the hills to drain it — and Swayambhu remained.', img: 'swayambhunath,stupa,kathmandu,valley', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepali', likes: 420, views: 6200, durationMin: 9 },
  { id: 'sw2', creatorId: 'nilam', destinationId: 'swayambhunath', category: 'CULTURE', type: 'FREE', title: 'The eyes of the Buddha', teaser: 'Those famous eyes on every side gaze in all directions; the curl between them is the number “one” in Nepali — unity, the one path.', img: 'swayambhunath,buddha,eyes', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 560, views: 8700 },
  { id: 'sw3', creatorId: 'nilam', destinationId: 'swayambhunath', category: 'HISTORY', type: 'FREE', title: '365 steps, sunrise & the monkeys', teaser: 'Climb the eastern stairway at dawn for soft light over the city — and mind the monkeys, they’ll grab food and shiny things.', img: 'swayambhunath,steps,monkey', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 2240, isTip: true, tipHelpful: 231 },

  // ===== Kathmandu Durbar Square =====
  { id: 'ds1', creatorId: 'nilam', destinationId: 'durbar-square', category: 'HISTORY', type: 'PREMIUM', title: 'Hanuman Dhoka & the Malla kings', teaser: 'Palaces, courtyards and temples built over centuries by the Malla and Shah kings. Read the woodcarvings like a history book…', img: 'kathmandu,durbar,palace,carving', mediaType: 'VIDEO', priceNpr: 200, language: 'Nepali', likes: 318, views: 4900, durationMin: 12 },
  { id: 'ds2', creatorId: 'nilam', destinationId: 'durbar-square', category: 'CULTURE', type: 'PREMIUM', title: 'The Kumari — Nepal’s living goddess', teaser: 'A young girl chosen as the living incarnation of the goddess Taleju, who appears at her carved window. Who she is, and how she lives…', img: 'kumari,kathmandu,goddess', mediaType: 'AUDIO', priceNpr: 220, language: 'Nepali', likes: 502, views: 7300, durationMin: 10 },
  { id: 'ds3', creatorId: 'nilam', destinationId: 'durbar-square', category: 'FESTIVAL', type: 'FREE', title: 'Indra Jatra — chariots & masked dances', teaser: 'For eight days the square fills with chariot processions, lakhey masked dancers and the Kumari herself, pulled through the old city.', img: 'indra,jatra,kathmandu,mask', imgSrc: '/durbar-square.png', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 396, views: 5800 },
  { id: 'ds4', creatorId: 'nilam', destinationId: 'durbar-square', category: 'HISTORY', type: 'FREE', title: 'Tickets, dress & the rebuilt temples', teaser: 'Foreign visitors need an entry ticket; keep it for the day. Some temples are still being restored after the 2015 earthquake — give crews space.', img: 'kathmandu,durbar,square,temple', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 1530, isTip: true, tipHelpful: 176 },

  // ===== Hadigaun (ancient Licchavi town · Kahi Nabhayeko Jatra) =====
  { id: 'hg1', creatorId: 'hari', destinationId: 'hadigaun', category: 'LEGEND', type: 'PREMIUM', title: 'Why two sisters built a festival like no other', teaser: 'Two sisters, one doubt, and a twelve-year wait — the promise to Lord Narayan that gave Hadigaun a festival found nowhere else in Nepal.', img: 'nepal,narayan,temple,festival', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepali', likes: 366, views: 5400, durationMin: 9,
    story: 'Long ago in Hadigaun lived two sisters, both devoted to Lord Narayan — but not equally. The elder trusted him completely, and when her time came she gave birth safely, certain of his blessing. The younger doubted, and for twelve long years she could not deliver her child. At last the whole town went out in procession and made the god a promise: show your grace, and we will hold you a festival the like of which has never been seen anywhere. Narayan was pleased; the younger sister finally bore her child — and the people kept their word. That promise became Kahi Nabhayeko Jatra, “the festival like no other,” still carried through these lanes once a year, on the day after the Kojagrat full moon that closes Dashain.' },
  { id: 'hg2', creatorId: 'hari', destinationId: 'hadigaun', category: 'FESTIVAL', type: 'PREMIUM', title: 'Kahi Nabhayeko Jatra: the upside-down chariots', teaser: 'The day after Kojagrat Purnima, the gods’ palanquins are carried upside down and spun through the lanes. What you’re seeing, and why…', img: 'nepal,jatra,chariot,festival', mediaType: 'VIDEO', priceNpr: 250, language: 'Nepali', likes: 690, views: 9300, durationMin: 12,
    story: 'On the day after Kojagrat Purnima, Hadigaun does something you will see in no other town in Nepal. The khats — the wooden palanquins of the gods — are carried upside down. The gajur, the spire that should point at the sky, is turned to face the earth, while the images of Brahma, Vishnu and Maheshwar ride on top. Men lift them onto their shoulders and spin them in tight circles down the narrow lanes to a storm of drums and cymbals, the crowd surging with every turn. It is dizzying, loud and joyful, and it has been done this way since at least the Licchavi age. Here no one needs the long name — they simply call it Kahi Nabhayeko Jatra, the festival that happens nowhere else.' },
  { id: 'hg3', creatorId: 'hari', destinationId: 'hadigaun', category: 'HISTORY', type: 'PREMIUM', title: 'Nepal’s lost first capital', teaser: 'Quiet courtyards hide a secret: this may be Vishalnagar, the Licchavi capital, and the site of King Amshuverma’s lost palace.', img: 'kathmandu,ancient,temple,stone', mediaType: 'VIDEO', priceNpr: 200, language: 'Nepali', likes: 248, views: 3700, durationMin: 11,
    story: 'Step off the main road and Hadigaun feels like an ordinary old neighbourhood — but you may be standing on Nepal’s first capital. Historians believe this was Vishalnagar, seat of the Licchavi kings nearly two thousand years ago, and that somewhere beneath these courtyards stood Kailashkut Bhawan, the great palace of King Amshuverma. An inscription Amshuverma left still survives at the Hadigaun Dabali, the open square, recording his daily routine and the gods of his court. When archaeologists dug beside the Satya Narayan temple they reached the valley’s earliest known settlement, going back to around the first century BCE. Earthquakes and centuries erased the palace, but the lanes, the shrines and the scattered Licchavi stone carvings still remember it.' },
  { id: 'hg4', creatorId: 'hari', destinationId: 'hadigaun', category: 'FESTIVAL', type: 'FREE', title: 'Gahana Khojne Jatra: the jewellery hunt', teaser: 'Hadigaun’s other festival sends a goddess to search a pond for lost jewellery — three slow circles until it’s “found.”', img: 'nepal,goddess,procession,pond', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 274, views: 4100,
    story: 'Hadigaun keeps a second, stranger festival: a jatra to search for lost jewellery. The story goes that the town’s goddess — Tudal Devi, remembered as a form of Durga — once bathed with her sisters and lost an ornament. To this day her palanquin is carried down to the Gahana Pokhari, the “jewellery pond,” and circled three times while a guardian palanquin keeps ill will away. Only when the rounds are done is the jewellery considered found, and the goddess returns to rest at the Dabali. Part devotion, part treasure hunt — and entirely Hadigaun.' },
  { id: 'hg5', creatorId: 'hari', destinationId: 'hadigaun', category: 'CULTURE', type: 'FREE', title: 'The potters who may have named the town', teaser: '“Hari-gaun” or “handi-gaun”? Clay pots, brick courtyards and quiet shrines in the valley’s oldest lanes.', img: 'nepal,pottery,clay,courtyard', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 318, views: 5200,
    story: 'Ask why it is called Hadigaun and you will get more than one answer. Some say it was once “Hari-gaun,” the village of Narayan; others that it comes from handi, the round earthen pots the Prajapati potter families here were known for. Either way, the old town is still a maze of brick courtyards, stone water spouts and small shrines — lived in rather than fenced off. This is heritage you walk through, not past.' },
  { id: 'hg6', creatorId: 'hari', destinationId: 'hadigaun', category: 'HISTORY', type: 'FREE', title: 'Finding Hadigaun — and what to look for', teaser: 'It hides in the lanes northeast of the centre, near Baluwatar. Start at the Satya Narayan temple and the Dabali square, and look for Licchavi stone carvings tucked between the houses.', img: 'kathmandu,heritage,lane,temple', mediaType: 'TEXT', priceNpr: 0, language: 'Nepali', likes: 0, views: 1460, isTip: true, tipHelpful: 176 },
  { id: 'hg7', creatorId: 'hari', destinationId: 'hadigaun', category: 'RITUAL', type: 'PREMIUM', title: 'Inside a Satya Narayan puja', teaser: 'At the heart of old Hadigaun stands the Satya Narayan temple. On the full moon, families gather to worship Vishnu — what each offering means…', img: 'nepal,hindu,puja,temple', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepali', likes: 296, views: 4300, durationMin: 10,
    story: 'The Satya Narayan temple is the spiritual centre of Hadigaun, and on Purnima — the full moon — families gather here for the Satya Narayan puja, a worship of Vishnu in his form as the lord of truth. The priest bathes the shaligram, the sacred black stone that stands for Vishnu, in panchamrit — a mix of milk, ghee, honey, yoghurt and sugar — then dresses it in flowers and tulsi. The Satya Narayan Katha, the tale of the god’s grace, is read aloud while the household listens, and at the end everyone shares the prasad. It is a quiet, domestic ritual, repeated for centuries beside a shrine the Licchavi kings themselves once honoured.' },
  { id: 'hg8', creatorId: 'hari', destinationId: 'hadigaun', category: 'RITUAL', type: 'FREE', title: 'Ihi — when a girl marries the bel fruit', teaser: 'In a Newar town like Hadigaun, a young girl is first married to a golden bel fruit — so that she is never truly widowed. The meaning behind Ihi.', img: 'newar,girl,ceremony,nepal', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 352, views: 5600,
    story: 'Among the Newars, before a girl reaches her teens she goes through Ihi — a ceremony in which she is married not to a man but to the bel, the hard golden wood-apple, treated as a form of the ever-living god Vishnu. Because this first husband is divine and never dies, a Newar woman is believed never to become a true widow, even if her human husband later passes. Dressed as a small bride, she is blessed over several days; it is a celebration of girlhood and protection as much as a wedding. In an old Newar settlement like Hadigaun, Ihi has been kept for generations.' },
  { id: 'hg9', creatorId: 'hari', destinationId: 'hadigaun', category: 'FOOD', type: 'FREE', title: 'Samay baji, the festival platter', teaser: 'When the jatra comes, Hadigaun shares samay baji — a plate where every item is a small blessing. What’s on it, and why.', img: 'newari,samay,baji,food', mediaType: 'PHOTO', priceNpr: 0, language: 'Nepali', likes: 430, views: 7200,
    story: 'No Newar celebration in Hadigaun is complete without samay baji, the ceremonial platter passed around to share blessings. At its heart is chiura — beaten rice — piled with bara (a soft black-lentil patty), choila (spiced grilled meat), a boiled egg, black soybeans, fresh ginger, fiery achar, and a sip of aila, the home-distilled rice spirit. Each item has its place and meaning, and the plate is offered to gods and guests alike. During the jatra, families set out samay baji and a full bhoj — the Newar feast — and the whole town eats together.' },
  { id: 'hg10', creatorId: 'hari', destinationId: 'hadigaun', category: 'FOOD', type: 'PREMIUM', title: 'Yomari: the sweet you fold for the gods', teaser: 'A fig-shaped dumpling of rice dough with a molten heart of molasses and sesame — folded to thank the gods for the harvest. How it’s made…', img: 'yomari,newari,sweet,nepal', mediaType: 'VIDEO', priceNpr: 180, language: 'Nepali', likes: 388, views: 5100, durationMin: 9,
    story: 'When the winter full moon of Yomari Punhi arrives, Newar kitchens — Hadigaun’s among them — fill with the smell of steaming rice dough. Yomari is a dumpling pinched into the shape of a fig, its thin shell of rice flour wrapped around a molten heart of chaku (molasses) and toasted sesame, then steamed until glossy. It is made to thank the gods for the rice harvest, and some are shaped as deities for blessings of prosperity. Sweet, warm and a little sticky, a fresh yomari is one of the great pleasures of a Kathmandu Valley winter.' },
  {
    id: 'hg11', creatorId: 'hari', destinationId: 'hadigaun', category: 'LANGUAGE', type: 'PREMIUM',
    title: 'First words in Nepal Bhasa (Newari)', teaser: 'Hadigaun’s mother tongue is Nepal Bhasa. A handful of words to greet its people — original script, with a local translation.',
    img: 'newar,people,kathmandu,talking', mediaType: 'AUDIO', priceNpr: 180, language: 'Nepal Bhasa', likes: 256, views: 3400, durationMin: 8,
    origLang: 'Nepal Bhasa (Newari)', sampleNote: 'Sample phrases — community-submitted, pending verification by a native Nepal Bhasa speaker. Romanization varies by speaker.',
    phrases: [
      { original: 'ज्वजलपा', roman: 'Jwajalapa', ne: 'नमस्ते', en: 'Hello / greetings' },
      { original: 'सुभाय्', roman: 'Subhāy', ne: 'धन्यवाद', en: 'Thank you' },
      { original: 'लसकुस', roman: 'Lasakusa', ne: 'स्वागत', en: 'Welcome' },
      { original: 'म्ह फु ला?', roman: 'Mha phu lā?', ne: 'सन्चै हुनुहुन्छ?', en: 'How are you?' },
      { original: 'थुकेया गुलि?', roman: 'Thukeyā guli?', ne: 'यो कति हो?', en: 'How much is this?' },
      { original: 'वने न्हि', roman: 'Wane nhi', ne: 'म जान्छु', en: 'I’ll head off now (goodbye)' },
    ],
  },
]

export type Skill = {
  id: string; creatorId: string; destinationId: string; title: string; description: string
  priceNpr: number; delivery: 'IN_PERSON' | 'SHIPPED' | 'DIGITAL'; durationMin?: number
  img: string; imgSrc?: string; grad: string; rating: number; reviews: number; slotsToday: number
}
export const SKILLS: Skill[] = [
  { id: 's1', creatorId: 'maya', destinationId: 'ghandruk', title: 'Cook Dal Bhat with my family', description: 'Hands-on 2.5 hr class in my kitchen — grind the spices, cook on a wood fire, then eat together.', priceNpr: 1200, delivery: 'IN_PERSON', durationMin: 150, img: 'nepali,kitchen,cooking', grad: 'linear-gradient(135deg,#3b39e0,#14b8a6)', rating: 4.9, reviews: 64, slotsToday: 2 },
  { id: 's2', creatorId: 'bishnu', destinationId: 'bhaktapur', title: 'Throw a pot on the wheel', description: 'Sit at a 300-year-old wheel and make your own bowl. I fire it and you collect it next day.', priceNpr: 900, delivery: 'IN_PERSON', durationMin: 120, img: 'pottery,wheel,hands', grad: 'linear-gradient(135deg,#4f46e5,#3b39e0)', rating: 4.8, reviews: 51, slotsToday: 4 },
  { id: 's3', creatorId: 'kumar', destinationId: 'tansen', title: 'Dhaka weaving starter lesson', description: 'Learn the backstrap loom and weave a small dhaka band to take home.', priceNpr: 800, delivery: 'IN_PERSON', durationMin: 120, img: 'weaving,loom,thread', grad: 'linear-gradient(135deg,#0ea5b7,#14b8a6)', rating: 4.7, reviews: 33, slotsToday: 3 },
  { id: 's4', creatorId: 'sita', destinationId: 'panauti', title: 'Guided temple & legend walk', description: '2 hr walk through Panauti’s oldest temples — the stories, the symbols, the living rituals.', priceNpr: 1000, delivery: 'IN_PERSON', durationMin: 120, img: 'nepal,temple,guide', grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)', rating: 5.0, reviews: 40, slotsToday: 5 },
  { id: 's5', creatorId: 'kumar', destinationId: 'tansen', title: 'Handwoven dhaka shawl', description: 'A shawl I weave to order in your choice of colors. Shipped anywhere in 2–3 weeks.', priceNpr: 4500, delivery: 'SHIPPED', img: 'handwoven,scarf,textile', grad: 'linear-gradient(135deg,#14b8a6,#0ea5b7)', rating: 4.8, reviews: 18, slotsToday: 9 },
  { id: 's6', creatorId: 'sita', destinationId: 'panauti', title: 'Online Nepali for travelers', description: '45-min video lesson — the 30 phrases that make locals smile. Booked instantly.', priceNpr: 600, delivery: 'DIGITAL', durationMin: 45, img: 'video,call,learning', grad: 'linear-gradient(135deg,#4f46e5,#7c3aed)', rating: 4.9, reviews: 22, slotsToday: 12 },
  { id: 's7', creatorId: 'bikash', destinationId: 'pokhara', title: 'Sarangkot sunrise hike + tea', description: 'Pre-dawn walk up to the Sarangkot viewpoint for sunrise over the Annapurnas, then tea at a local home.', priceNpr: 1300, delivery: 'IN_PERSON', durationMin: 180, img: 'sarangkot,sunrise,hike', grad: 'linear-gradient(135deg,#2563eb,#0891b2)', rating: 4.8, reviews: 47, slotsToday: 6 },
  { id: 's8', creatorId: 'nilam', destinationId: 'kathmandu', title: 'Old Kathmandu food walk', description: '2.5 hr walk through the back lanes — six Newari tastings, the stories behind each, ending with juju dhau.', priceNpr: 1500, delivery: 'IN_PERSON', durationMin: 150, img: 'kathmandu,street,food', grad: 'linear-gradient(135deg,#16a34a,#2563eb)', rating: 4.9, reviews: 38, slotsToday: 5 },
  { id: 's9', creatorId: 'sita', destinationId: 'panauti', title: 'Write your name in Devanagari', description: '45-min online session — learn the script and write your own name beautifully, plus 10 travel phrases.', priceNpr: 600, delivery: 'DIGITAL', durationMin: 45, img: 'devanagari,writing,calligraphy', grad: 'linear-gradient(135deg,#2563eb,#0891b2)', rating: 4.9, reviews: 16, slotsToday: 10 },
  { id: 's10', creatorId: 'ram', destinationId: 'pashupatinath', title: 'Pashupatinath heritage & ghats walk', description: '2 hr guided walk — the temples, the sadhus, the cremation ghats and the evening aarti, explained with care and respect.', priceNpr: 1200, delivery: 'IN_PERSON', durationMin: 120, img: 'pashupatinath,temple,guide', grad: 'linear-gradient(135deg,#7c3aed,#2563eb)', rating: 4.8, reviews: 52, slotsToday: 6 },
  { id: 's11', creatorId: 'pema', destinationId: 'boudhanath', title: 'Boudha kora + monastery visit', description: 'Walk the kora with a local, spin the prayer wheels, then step inside a working monastery for the afternoon chants.', priceNpr: 1000, delivery: 'IN_PERSON', durationMin: 120, img: 'boudhanath,monastery,kora', grad: 'linear-gradient(135deg,#2563eb,#0891b2)', rating: 4.9, reviews: 44, slotsToday: 7 },
  { id: 's12', creatorId: 'nilam', destinationId: 'swayambhunath', title: 'Swayambhu sunrise climb', description: 'Beat the crowds — climb the 365 steps at dawn for the city waking up below, with the legends told on the way up.', priceNpr: 1100, delivery: 'IN_PERSON', durationMin: 150, img: 'swayambhunath,sunrise,kathmandu', grad: 'linear-gradient(135deg,#16a34a,#2563eb)', rating: 4.8, reviews: 37, slotsToday: 5 },
  { id: 's13', creatorId: 'nilam', destinationId: 'durbar-square', title: 'Durbar Square & Kumari house walk', description: '2 hr walk through Hanuman Dhoka, the temples and the Kumari Ghar — the art, the kings, and the living goddess.', priceNpr: 1300, delivery: 'IN_PERSON', durationMin: 120, img: 'kathmandu,durbar,square,walk', grad: 'linear-gradient(135deg,#4f46e5,#7c3aed)', rating: 4.9, reviews: 41, slotsToday: 6 },
  { id: 's14', creatorId: 'hari', destinationId: 'hadigaun', title: 'Hidden Hadigaun heritage walk', description: '2 hr walk through the valley’s oldest town — the Satya Narayan shrine, the Dabali square, Licchavi stone sculptures, and the lanes where Kahi Nabhayeko Jatra runs.', priceNpr: 1100, delivery: 'IN_PERSON', durationMin: 120, img: 'kathmandu,heritage,temple,walk', grad: 'linear-gradient(135deg,#0e7490,#4f46e5)', rating: 4.9, reviews: 28, slotsToday: 5 },
]

// ---- Bookable local guides (each presents an area; availability per day) ----
export type Guide = {
  id: string; creatorId: string; destinationId: string
  tagline: string; languages: string[]; specialties: CategoryKey[]
  priceNpr: number; durationLabel: string
  bookedOffsets: number[]   // days from today already booked (demo seed)
}
export const GUIDES: Guide[] = [
  // Hadigaun — several guides to compare
  { id: 'g_hari', creatorId: 'hari', destinationId: 'hadigaun', tagline: 'Heritage & history walks through the valley’s oldest town.', languages: ['Nepali', 'English', 'Nepal Bhasa'], specialties: ['HISTORY', 'LEGEND', 'RITUAL'], priceNpr: 1100, durationLabel: 'Half day · ~2 hr', bookedOffsets: [1, 2, 6, 10, 15] },
  { id: 'g_sabita', creatorId: 'sabita', destinationId: 'hadigaun', tagline: 'Newar food & courtyards — cook, taste and hear the stories.', languages: ['Nepali', 'Nepal Bhasa'], specialties: ['FOOD', 'CULTURE'], priceNpr: 1300, durationLabel: 'Half day · ~3 hr', bookedOffsets: [0, 3, 4, 11, 12] },
  { id: 'g_nabin', creatorId: 'nabin', destinationId: 'hadigaun', tagline: 'Festival & photo walks — best timed around the jatra.', languages: ['Nepali', 'English'], specialties: ['FESTIVAL', 'CULTURE'], priceNpr: 900, durationLabel: 'Flexible · 2–4 hr', bookedOffsets: [5, 7, 8, 9] },
  // other areas — every local is bookable as a guide
  { id: 'g_ram', creatorId: 'ram', destinationId: 'pashupatinath', tagline: 'The temples, ghats and the evening aarti, explained with care.', languages: ['Nepali', 'English', 'Hindi'], specialties: ['RITUAL', 'FESTIVAL', 'HISTORY'], priceNpr: 1200, durationLabel: 'Half day · ~2 hr', bookedOffsets: [2, 3, 8, 13] },
  { id: 'g_maya', creatorId: 'maya', destinationId: 'ghandruk', tagline: 'Gurung home cooking and the trail to the viewpoint.', languages: ['Nepali', 'Gurung', 'English'], specialties: ['FOOD', 'HISTORY', 'CULTURE'], priceNpr: 1200, durationLabel: 'Half day', bookedOffsets: [1, 4, 9, 10] },
  { id: 'g_tashi', creatorId: 'tashi', destinationId: 'ghandruk', tagline: 'Mountain rituals and the songs of the elders.', languages: ['Nepali', 'Gurung'], specialties: ['RITUAL', 'CULTURE'], priceNpr: 1000, durationLabel: 'Flexible', bookedOffsets: [0, 6, 7, 14] },
  { id: 'g_nilam', creatorId: 'nilam', destinationId: 'kathmandu', tagline: 'Newari food and the back lanes of old Kathmandu.', languages: ['Nepali', 'Nepal Bhasa', 'English'], specialties: ['FOOD', 'HISTORY', 'CULTURE'], priceNpr: 1500, durationLabel: 'Half day · ~2.5 hr', bookedOffsets: [2, 5, 11, 12] },
  { id: 'g_pema', creatorId: 'pema', destinationId: 'boudhanath', tagline: 'Walk the kora and step inside a working monastery.', languages: ['Nepali', 'Tibetan', 'English'], specialties: ['RITUAL', 'CULTURE'], priceNpr: 1000, durationLabel: 'Half day', bookedOffsets: [3, 4, 8, 15] },
  { id: 'g_bikash', creatorId: 'bikash', destinationId: 'pokhara', tagline: 'Sarangkot sunrise, the lakes and paragliding spotting.', languages: ['Nepali', 'English'], specialties: ['HISTORY', 'CULTURE'], priceNpr: 1300, durationLabel: 'Sunrise · ~3 hr', bookedOffsets: [1, 2, 9, 16] },
  { id: 'g_sita', creatorId: 'sita', destinationId: 'panauti', tagline: 'Temple legends and the living rituals of an ancient town.', languages: ['Nepali', 'English'], specialties: ['LEGEND', 'RITUAL', 'FESTIVAL'], priceNpr: 1000, durationLabel: 'Half day · ~2 hr', bookedOffsets: [5, 6, 12, 13] },
  { id: 'g_bishnu', creatorId: 'bishnu', destinationId: 'bhaktapur', tagline: 'Pottery Square and the craft of the wheel.', languages: ['Nepali', 'Nepal Bhasa'], specialties: ['CULTURE', 'SKILL'], priceNpr: 900, durationLabel: 'Flexible · 2 hr', bookedOffsets: [0, 7, 8, 14] },
  { id: 'g_kumar', creatorId: 'kumar', destinationId: 'tansen', tagline: 'Dhaka weaving and the view from Srinagar Hill.', languages: ['Nepali', 'English'], specialties: ['CULTURE', 'SKILL'], priceNpr: 800, durationLabel: 'Flexible', bookedOffsets: [3, 9, 10, 15] },
  { id: 'g_anita', creatorId: 'anita', destinationId: 'bandipur', tagline: 'Samay baji and the car-free bazaar.', languages: ['Nepali', 'Newar', 'English'], specialties: ['FOOD', 'CULTURE'], priceNpr: 1000, durationLabel: 'Half day', bookedOffsets: [2, 4, 11, 12] },
]
export const guidesOf = (destId: string) => GUIDES.filter(g => g.destinationId === destId)
export const guideOfCreator = (creatorId: string) => GUIDES.find(g => g.creatorId === creatorId)

export type Project = {
  id: string; title: string; destinationId: string; leadCreatorId: string
  goalNpr: number; raisedNpr: number; desc: string; img: string; restored?: boolean
}
export const PROJECTS: Project[] = [
  { id: 'pr1', title: 'Restore the 200-yr-old temple door', destinationId: 'panauti', leadCreatorId: 'sita', goalNpr: 120000, raisedNpr: 86500, img: 'temple,wooden,door,carving', desc: 'Hand-carved door cracked by frost. Local artisans will repair it with traditional joinery.' },
  { id: 'pr2', title: 'Record 30 elders’ songs before they’re lost', destinationId: 'ghandruk', leadCreatorId: 'tashi', goalNpr: 80000, raisedNpr: 31200, img: 'microphone,recording,studio', desc: 'Pays youth to record & translate rare Gurung songs into a public archive.' },
  { id: 'pr3', title: 'Rebuild the bazaar resting platform', destinationId: 'bandipur', leadCreatorId: 'anita', goalNpr: 60000, raisedNpr: 60000, img: 'stone,platform,tree', desc: 'The stone chautari where traders have rested for generations.', restored: true },
  { id: 'pr4', title: 'Protect Hadigaun’s Licchavi stone sculptures', destinationId: 'hadigaun', leadCreatorId: 'hari', goalNpr: 150000, raisedNpr: 42000, img: 'stone,sculpture,heritage,nepal', desc: 'Catalogue and shelter 1,500-year-old Licchavi statues left exposed and encroached upon in the old town.' },
]

export type Supporter = { name: string; amountNpr: number; anon?: boolean; country: string }
export const SUPPORTERS: Supporter[] = [
  { name: 'Anonymous Friend', amountNpr: 50000, anon: true, country: '—' },
  { name: 'R. Sharma', amountNpr: 35000, country: 'Australia' },
  { name: 'Trek group “EagleEye”', amountNpr: 28000, country: 'Germany' },
  { name: 'J. Tamang', amountNpr: 12000, country: 'USA' },
  { name: 'Mei L.', amountNpr: 9500, country: 'Singapore' },
]

export type Review = { id: string; author: string; rating: number; comment: string; verified: boolean; daysAgo: number }
export const REVIEWS: Review[] = [
  { id: 'r1', author: 'Hannah (Germany)', rating: 5, comment: 'Maya welcomed us like family. Best meal of our whole trip.', verified: true, daysAgo: 3 },
  { id: 'r2', author: 'Kenji (Japan)', rating: 5, comment: 'Cooking on the wood fire was unforgettable. Worth every rupee.', verified: true, daysAgo: 9 },
  { id: 'r3', author: 'Sofia (Spain)', rating: 4, comment: 'Lovely and authentic. A bit hard to find the house — follow her map pin!', verified: true, daysAgo: 21 },
]

// ---- Local Alerts (live conditions posted by locals) ----------------------
export type AlertKind = 'road_blocked' | 'flood' | 'landslide' | 'strike' | 'closed' | 'cleared'
export type AlertSeverity = 'caution' | 'serious' | 'blocked'

export const ALERT_SEV: Record<AlertSeverity, { label: string; color: string; bg: string }> = {
  caution: { label: 'Caution', color: '#b45309', bg: '#fef3c7' },
  serious: { label: 'Serious', color: '#c2410c', bg: '#ffedd5' },
  blocked: { label: 'Blocked', color: '#b91c1c', bg: '#fee2e2' },
}
export const ALERT_KINDS: { key: AlertKind; label: string; sev: AlertSeverity }[] = [
  { key: 'road_blocked', label: 'Road blocked', sev: 'blocked' },
  { key: 'flood', label: 'Flood', sev: 'serious' },
  { key: 'landslide', label: 'Landslide', sev: 'serious' },
  { key: 'strike', label: 'Strike / bandh', sev: 'caution' },
  { key: 'closed', label: 'Site closed', sev: 'caution' },
  { key: 'cleared', label: 'Cleared / safe again', sev: 'caution' },
]
export const alertKindOf = (k: AlertKind) => ALERT_KINDS.find(x => x.key === k)!

export type Alert = {
  id: string; placeId: string; kind: AlertKind; severity: AlertSeverity
  body: string; byCreatorId: string; audioSrc?: string; audioSecs?: number
  minsAgo?: number; createdAt?: number; resolved?: boolean; helpful: number
}
export const SEED_ALERTS: Alert[] = [
  { id: 'seed-al1', placeId: 'ghandruk', kind: 'landslide', severity: 'serious', byCreatorId: 'maya', minsAgo: 40, helpful: 31, body: 'Landslide on the road above Birethanti — vehicles stuck since morning. Walk up from Nayapul, or wait till afternoon when they clear it.' },
  { id: 'seed-al2', placeId: 'kathmandu', kind: 'strike', severity: 'caution', byCreatorId: 'nilam', minsAgo: 95, helpful: 54, body: 'Transport bandh in the core city until about 2pm — most taxis are off the road. Walk between the squares or plan around it.' },
  { id: 'seed-al3', placeId: 'pashupatinath', kind: 'road_blocked', severity: 'caution', byCreatorId: 'ram', minsAgo: 20, helpful: 18, body: 'Gaushala junction is dug up for pipe work — heavy traffic. Come early, or enter from the Jaya Bageshwari side.' },
]

export const CURRENT_USER = {
  name: 'You', isCreator: true, vibes: ['spiritual', 'foodie'] as VibeKey[],
  tripDestinationId: 'panauti', languagePref: 'en' as 'en' | 'ne',
}
