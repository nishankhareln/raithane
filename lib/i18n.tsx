'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'en' | 'ne'

/** English → Nepali for static/platform strings. Missing keys fall back to English. */
const NE: Record<string, string> = {
  // ---- header / nav / chrome ----
  'Home': 'गृह', 'Explore': 'अन्वेषण', 'Vibe': 'भाव', 'Skills': 'सीप', 'Support': 'सहयोग', 'Dashboard': 'ड्यासबोर्ड',
  'Create': 'सिर्जना', 'My profile': 'मेरो प्रोफाइल', 'Sign in': 'साइन इन', 'Logout': 'लग आउट',
  'Search a place, food, legend or skill…': 'ठाउँ, खाना, कथा वा सीप खोज्नुहोस्…',
  'Prototype · payments mocked · every action pays a local': 'प्रोटोटाइप · भुक्तानी नक्कली · हरेक कार्यले स्थानीयलाई तिर्छ',

  // ---- home ----
  'Nepal, through the people who live it': 'नेपाल, यहाँ बस्ने मानिसहरूमार्फत',
  'Find your vibe': 'आफ्नो भाव खोज्नुहोस्', 'Explore the map': 'नक्सा हेर्नुहोस्',
  'verified creators': 'प्रमाणित सर्जक', 'destinations': 'गन्तव्य', 'goes to locals': 'स्थानीयलाई जान्छ',
  'Discover by vibe': 'भाव अनुसार खोज्नुहोस्', 'See all →': 'सबै हेर्नुहोस् →',
  'Local know-how': 'स्थानीय जानकारी', 'For you': 'तपाईंका लागि',
  'Discover Nepal.': 'नेपाल चिन्नुहोस्।', 'Pay the locals': 'स्थानीयलाई तिर्नुहोस्', 'who make it real.': 'जसले यसलाई जीवन्त बनाउँछन्।',
  'Stories, food, festivals and skills shared by the people who live them — unlock culture and book real experiences, and ':
    'त्यहाँ बस्ने मानिसहरूले बाँडेका कथा, खाना, चाडपर्व र सीप — संस्कृति अनलक गर्नुहोस्, वास्तविक अनुभव बुक गर्नुहोस्, र ',
  '90% goes straight to the local': '९०% सिधै स्थानीयलाई जान्छ',
  'Skills here': 'यहाँका सीपहरू', 'All': 'सबै',

  // ---- categories ----
  'Food': 'खाना', 'Legend': 'किंवदन्ती', 'History': 'इतिहास', 'Language': 'भाषा',
  'Culture': 'संस्कृति', 'Festival': 'चाडपर्व', 'Ritual': 'संस्कार', 'Skill': 'सीप',

  // ---- vibes ----
  'Spiritual': 'आध्यात्मिक', 'Adventure': 'साहसिक', 'Foodie': 'खानप्रेमी',
  'Festive': 'उत्सवमय', 'Artisan': 'शिल्पकला', 'Offbeat': 'फरक',

  // ---- common buttons / labels ----
  'Unlock': 'अनलक', 'Book': 'बुक', 'Book now': 'अहिले बुक गर्नुहोस्', 'Helpful': 'उपयोगी',
  'Follow': 'फलो', 'Following': 'फलो गरिएको', 'Free': 'निःशुल्क', 'Premium': 'प्रिमियम',
  'Bookable skill': 'बुक गर्न मिल्ने सीप', 'Verified reviews': 'प्रमाणित समीक्षा',
  'Comments': 'टिप्पणीहरू', 'Post': 'पोस्ट', 'Add a comment…': 'टिप्पणी थप्नुहोस्…',
  'Sign in to comment…': 'टिप्पणी गर्न साइन इन गर्नुहोस्…',
  'Report a condition': 'अवस्था रिपोर्ट गर्नुहोस्', 'Near me': 'मेरो नजिक',
  'Listen in a real voice': 'वास्तविक स्वरमा सुन्नुहोस्', 'Available today': 'आज उपलब्ध',
  'Where your': 'तपाईंको', 'goes': 'कहाँ जान्छ', 'to the local': 'स्थानीयलाई',

  // ---- section headings ----
  'Skills & experiences': 'सीप र अनुभव', 'Explore Nepal': 'नेपाल अन्वेषण गर्नुहोस्',
  'Support & preservation': 'सहयोग र संरक्षण', 'Live local alerts': 'प्रत्यक्ष स्थानीय सूचना',
  'Heritage voice stories': 'सम्पदा स्वर कथा', 'What’s your vibe?': 'तपाईंको भाव के हो?',
  'Destinations': 'गन्तव्यहरू', 'Creators to follow': 'फलो गर्न सर्जकहरू', 'Stories for this vibe': 'यो भावका कथाहरू',
  'Top supporters': 'शीर्ष सहयोगी', 'Support a creator': 'सर्जकलाई सहयोग गर्नुहोस्',
  'Your local guide': 'तपाईंको स्थानीय गाइड', 'Here I can show you': 'यहाँ म तपाईंलाई देखाउन सक्छु',
  'See profile & support': 'प्रोफाइल हेर्नुहोस् र सहयोग गर्नुहोस्',
  'Local guides': 'स्थानीय गाइडहरू', 'View & book': 'हेर्नुहोस् र बुक गर्नुहोस्',
  'Pick a local to show you around — see their profile, then choose a date.': 'तपाईंलाई घुमाउन एक स्थानीय छान्नुहोस् — प्रोफाइल हेर्नुहोस्, अनि मिति छान्नुहोस्।',
  'Heritage Preservation Fund': 'सम्पदा संरक्षण कोष', 'Preservation projects': 'संरक्षण परियोजनाहरू',

  // ---- destination names ----
  'Bandipur': 'बन्दिपुर', 'Panauti': 'पनौती', 'Bhaktapur': 'भक्तपुर', 'Tansen': 'तानसेन',
  'Ghandruk': 'घान्द्रुक', 'Pokhara': 'पोखरा', 'Kathmandu': 'काठमाडौं',
  'Pashupatinath': 'पशुपतिनाथ', 'Boudhanath': 'बौद्धनाथ', 'Swayambhunath': 'स्वयम्भूनाथ',
  'Kathmandu Durbar Square': 'काठमाडौं दरबार स्क्वायर', 'Hadigaun': 'हडिगाउँ',

  // ---- destination descriptions ----
  'Nepal’s holiest Shiva temple, on the banks of the sacred Bagmati — a UNESCO site of golden roofs, cremation ghats, sadhus and the evening aarti.':
    'पवित्र बागमती किनारको नेपालकै पवित्र शिव मन्दिर — सुनौला छाना, घाट, साधु र साँझको आरती भएको युनेस्को सम्पदा स्थल।',
  'One of the world’s largest stupas and the heart of Tibetan Buddhism in Nepal — a giant mandala circled by pilgrims, prayer wheels and butter lamps.':
    'विश्वकै ठूला स्तूपहरूमध्ये एक र नेपालमा तिब्बती बौद्ध धर्मको केन्द्र — तीर्थयात्री, माने र दीपहरूले घेरिएको विशाल मण्डल।',
  'The “Monkey Temple” on a hilltop west of the city — the all-seeing eyes of the Buddha, 365 steps, and a legend older than the valley itself.':
    'सहरको पश्चिमी डाँडामाथिको “वानर मन्दिर” — बुद्धका सर्वदर्शी आँखा, ३६५ खुड्किला, र उपत्यकाभन्दै पुरानो किंवदन्ती।',
  'The old royal plaza of the Malla and Shah kings — Hanuman Dhoka palace, exquisite woodcarving, and the home of the living goddess Kumari.':
    'मल्ल र शाह राजाहरूको पुरानो दरबार क्षेत्र — हनुमानढोका दरबार, उत्कृष्ट काठको कुँदाइ, र जीवित देवी कुमारीको निवास।',
  'One of the Kathmandu Valley’s oldest towns — likely the lost Licchavi capital. Hidden courtyards, the Satya Narayan shrine where the valley’s earliest settlement was unearthed, and “Kahi Nabhayeko Jatra,” the festival like no other.':
    'काठमाडौं उपत्यकाको सबैभन्दा पुराना बस्तीहरूमध्ये एक — सम्भवतः हराएको लिच्छविकालीन राजधानी। लुकेका चोकहरू, उपत्यकाकै सबैभन्दा पुरानो बस्ती फेला परेको सत्यनारायण मन्दिर, र “कहीँ नभएको जात्रा” — कतै नभएको चाड।',
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (s: string) => string }>({
  lang: 'en', setLang: () => {}, t: (s) => s,
})
export const useLang = () => useContext(Ctx)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => { try { const s = localStorage.getItem('raithane_lang') as Lang; if (s === 'en' || s === 'ne') setLang(s) } catch {} }, [])
  const set = (l: Lang) => { setLang(l); try { localStorage.setItem('raithane_lang', l) } catch {} }
  const t = (s: string) => (lang === 'ne' ? (NE[s] ?? s) : s)
  return <Ctx.Provider value={{ lang, setLang: set, t }}>{children}</Ctx.Provider>
}
