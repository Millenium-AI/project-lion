export type Tab = 'buy' | 'sell' | 'msg' | 'price' | 'oracle' | 'crowd';

export interface Listing {
  id: string;
  name: string;
  set: string;
  number: string;
  condition: string;
  grade?: string;
  price: number;
  seller: string;
  rating: number;
  sales: number;
  distance: number;
  area: string;
  game: string;
  image: string;
  raw: boolean;
}

export interface MyListing {
  id: string;
  name: string;
  set: string;
  condition: string;
  price: number;
  status: 'live' | 'hidden' | 'sold';
  views: number;
  saves: number;
  offers: number;
  image: string;
  aiHint?: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: 'buying' | 'selling';
  avatar: string;
  last: string;
  time: string;
  status: 'negotiating' | 'awaiting' | 'meetup' | 'sold' | 'autopilot';
  autopilot: boolean;
  messages: { from: 'me' | 'them' | 'ai'; text: string; time: string }[];
}

export interface PriceCard {
  id: string;
  name: string;
  set: string;
  number: string;
  lang: 'EN' | 'JP';
  grade?: string;
  price: number;
  change: number;
  volume: number;
  image: string;
  trend: number[];
}

export interface OwnedCard {
  id: string;
  name: string;
  set: string;
  grade?: string;
  copies: number;
  avgCost: number;
  value: number;
  image: string;
}

export interface Oracle {
  id: string;
  name: string;
  set: string;
  grade?: string;
  current: number;
  forecast: { label: string; value: number; delta: number }[];
  confidence: number;
  horizon: string;
  reasoning: string;
  catalysts: string[];
  risks: string[];
  trend: number[];
  shared?: boolean;
  author?: string;
  votes?: number;
}

export interface Thread {
  id: string;
  title: string;
  author: string;
  avatar: string;
  time: string;
  votes: number;
  comments: number;
  tags: string[];
  preview: string;
  type: 'oracle' | 'general' | 'local';
  featured?: boolean;
}

const img = (id: string, seed = id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop&dpr=1&seed=${seed}`;

const cardImg = (n: number) =>
  `https://images.pexels.com/photos/${n}/pexels-photo-${n}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;

export const listings: Listing[] = [
  { id: 'l1', name: 'Charizard ex - Special Illustration Rare', set: 'Paldean Fates', number: '239/091', condition: 'NM', grade: 'PSA 10', price: 320, seller: 'MesaCards', rating: 4.9, sales: 312, distance: 2.4, area: 'Tempe, AZ', game: 'Pokemon', image: cardImg(326312), raw: false },
  { id: 'l2', name: 'Pikachu V - Rainbow Rare', set: 'Celebrations', number: '025/025', condition: 'LP', price: 78, seller: 'AZCardCo', rating: 4.7, sales: 88, distance: 5.1, area: 'Phoenix, AZ', game: 'Pokemon', image: cardImg(326311), raw: true },
  { id: 'l3', name: 'Mewtwo VSTAR - Gold Secret', set: 'Crown Zenith', number: 'GG70', condition: 'NM', grade: 'BGS 9.5', price: 145, seller: 'DesertTCG', rating: 5.0, sales: 421, distance: 8.8, area: 'Scottsdale, AZ', game: 'Pokemon', image: cardImg(326310), raw: false },
  { id: 'l4', name: 'Umbreon VMAX - Alt Art', set: 'Evolving Skies', number: '215/203', condition: 'NM', grade: 'PSA 10', price: 410, seller: 'NightShift', rating: 4.8, sales: 156, distance: 12.3, area: 'Mesa, AZ', game: 'Pokemon', image: cardImg(326309), raw: false },
  { id: 'l5', name: 'Lugia V - Alt Art', set: 'Silver Tempest', number: '215/195', condition: 'NM', price: 64, seller: 'ValleyCards', rating: 4.6, sales: 42, distance: 3.2, area: 'Tempe, AZ', game: 'Pokemon', image: cardImg(326308), raw: true },
  { id: 'l6', name: 'Giratina VSTAR - Alt Art', set: 'Lost Origin', number: '212/196', condition: 'MP', price: 92, seller: 'LostEcho', rating: 4.5, sales: 19, distance: 15.0, area: 'Glendale, AZ', game: 'Pokemon', image: cardImg(326307), raw: true },
];

export const myListings: MyListing[] = [
  { id: 'm1', name: 'Charizard ex - SIR', set: 'Paldean Fates', condition: 'PSA 10', price: 320, status: 'live', views: 1284, saves: 64, offers: 7, image: cardImg(326312), aiHint: 'Demand rising in your area. +6% suggested.' },
  { id: 'm2', name: 'Pikachu V - Rainbow', set: 'Celebrations', condition: 'Raw NM', price: 78, status: 'live', views: 612, saves: 22, offers: 3, image: cardImg(326311), aiHint: '3 similar listings nearby. Hold at $78.' },
  { id: 'm3', name: 'Mewtwo VSTAR - Gold', set: 'Crown Zenith', condition: 'BGS 9.5', price: 145, status: 'hidden', views: 0, saves: 0, offers: 0, image: cardImg(326310) },
  { id: 'm4', name: 'Umbreon VMAX - Alt Art', set: 'Evolving Skies', condition: 'PSA 10', price: 410, status: 'sold', views: 2104, saves: 188, offers: 14, image: cardImg(326309) },
  { id: 'm5', name: 'Lugia V - Alt Art', set: 'Silver Tempest', condition: 'Raw NM', price: 64, status: 'live', views: 388, saves: 9, offers: 1, image: cardImg(326308) },
];

export const conversations: Conversation[] = [
  {
    id: 'c1', name: 'MesaCards', role: 'selling', avatar: 'M', last: 'Meetup confirmed for Sat 2pm at Tempe Marketplace', time: '2m', status: 'meetup', autopilot: true,
    messages: [
      { from: 'them', text: 'Is the Charizard still available?', time: '10:02' },
      { from: 'ai', text: 'Yes — listed at $320 PSA 10. Open to offers within 8%.', time: '10:02' },
      { from: 'them', text: 'Would you do $295?', time: '10:04' },
      { from: 'ai', text: "I can accept $305 and meet at Tempe Marketplace this weekend.", time: '10:05' },
      { from: 'them', text: 'Deal. Saturday 2pm works.', time: '10:06' },
      { from: 'ai', text: 'Meetup confirmed for Sat 2pm at Tempe Marketplace. I\'ll send a pin.', time: '10:06' },
    ],
  },
  {
    id: 'c2', name: 'AZCardCo', role: 'buying', avatar: 'A', last: 'AI is negotiating your offer of $70', time: '14m', status: 'negotiating', autopilot: true,
    messages: [
      { from: 'me', text: 'I can do $70 for the Pikachu V rainbow.', time: '9:30' },
      { from: 'ai', text: 'Sent offer of $70 to AZCardCo. Awaiting response.', time: '9:30' },
      { from: 'them', text: '$75 and I\'ll throw in a sleeve.', time: '9:34' },
      { from: 'ai', text: 'Countering at $72 with meetup in Phoenix.', time: '9:34' },
    ],
  },
  {
    id: 'c3', name: 'DesertTCG', role: 'selling', avatar: 'D', last: 'Awaiting seller response on meetup', time: '1h', status: 'awaiting', autopilot: false,
    messages: [
      { from: 'them', text: 'Interested in the Mewtwo. Can you ship?', time: '8:10' },
      { from: 'me', text: 'Local meetup only, sorry.', time: '8:12' },
      { from: 'them', text: 'How about Scottsdale Fashion Square?', time: '8:14' },
    ],
  },
  {
    id: 'c4', name: 'NightShift', role: 'buying', avatar: 'N', last: 'Sold — Umbreon VMAX picked up', time: '3h', status: 'sold', autopilot: false,
    messages: [
      { from: 'me', text: 'Umbreon still available?', time: 'yesterday' },
      { from: 'them', text: 'Yes, $410 firm.', time: 'yesterday' },
      { from: 'me', text: 'On my way.', time: 'yesterday' },
      { from: 'them', text: 'Sold, thanks!', time: 'yesterday' },
    ],
  },
];

export const priceCards: PriceCard[] = [
  { id: 'p1', name: 'Charizard ex - SIR', set: 'Paldean Fates', number: '239/091', lang: 'EN', grade: 'PSA 10', price: 320, change: 8.2, volume: 142, image: cardImg(326312), trend: [30,32,31,34,36,35,38,40,42,41,44,48] },
  { id: 'p2', name: 'Umbreon VMAX - Alt Art', set: 'Evolving Skies', number: '215/203', lang: 'EN', grade: 'PSA 10', price: 410, change: 4.1, volume: 98, image: cardImg(326309), trend: [40,41,39,42,43,44,42,45,46,47,46,48] },
  { id: 'p3', name: 'Pikachu V - Rainbow', set: 'Celebrations', number: '025/025', lang: 'EN', grade: 'Raw', price: 78, change: -2.4, volume: 220, image: cardImg(326311), trend: [82,80,81,79,78,77,78,76,77,75,76,78] },
  { id: 'p4', name: 'Mewtwo VSTAR - Gold', set: 'Crown Zenith', number: 'GG70', lang: 'EN', grade: 'BGS 9.5', price: 145, change: 1.8, volume: 64, image: cardImg(326310), trend: [14,14,15,14,15,15,16,15,16,16,15,15] },
  { id: 'p5', name: 'Lugia V - Alt Art', set: 'Silver Tempest', number: '215/195', lang: 'EN', grade: 'Raw', price: 64, change: 12.5, volume: 51, image: cardImg(326308), trend: [50,52,55,53,56,58,60,62,63,64,66,64] },
  { id: 'p6', name: 'Giratina VSTAR - Alt Art', set: 'Lost Origin', number: '212/196', lang: 'EN', grade: 'PSA 9', price: 92, change: -5.1, volume: 73, image: cardImg(326307), trend: [100,98,99,95,96,92,94,90,92,88,90,92] },
  { id: 'p7', name: 'Rayquaza VMAX - Alt', set: 'Evolving Skies', number: '218/203', lang: 'JP', grade: 'PSA 10', price: 188, change: 6.7, volume: 40, image: cardImg(326306), trend: [16,17,18,17,19,20,19,21,22,21,23,24] },
  { id: 'p8', name: 'Blaziken V - SR', set: 'Scarlet Violet', number: '215/198', lang: 'JP', grade: 'Raw', price: 34, change: -1.2, volume: 310, image: cardImg(326305), trend: [36,35,35,34,34,33,34,33,34,34,33,34] },
];

export const ownedCards: OwnedCard[] = [
  { id: 'o1', name: 'Charizard ex - SIR', set: 'Paldean Fates', grade: 'PSA 10', copies: 1, avgCost: 280, value: 320, image: cardImg(326312) },
  { id: 'o2', name: 'Umbreon VMAX - Alt Art', set: 'Evolving Skies', grade: 'PSA 10', copies: 1, avgCost: 380, value: 410, image: cardImg(326309) },
  { id: 'o3', name: 'Pikachu V - Rainbow', set: 'Celebrations', grade: 'Raw', copies: 3, avgCost: 72, value: 78, image: cardImg(326311) },
  { id: 'o4', name: 'Lugia V - Alt Art', set: 'Silver Tempest', grade: 'Raw', copies: 2, avgCost: 55, value: 64, image: cardImg(326308) },
];

export const oracles: Oracle[] = [
  {
    id: 'or1', name: 'Charizard ex - SIR', set: 'Paldean Fates', grade: 'PSA 10', current: 320,
    forecast: [{ label: 'Current', value: 320, delta: 0 }, { label: '3M', value: 365, delta: 14 }, { label: '1Y', value: 440, delta: 37.5 }],
    confidence: 78, horizon: '12 months', reasoning: 'Charizard SIR supply is tightening while PSA 10 population growth slows. Local demand in the Phoenix metro has outpaced new listings for 6 straight weeks.',
    catalysts: ['Set out of print', 'PSA 10 pop growth slowing', 'Local demand outpacing supply'],
    risks: ['Reprint rumor for 2026', 'Broader market pullback'],
    trend: [30,31,32,31,34,36,35,38,40,41,44,48], shared: true, author: 'you', votes: 42,
  },
  {
    id: 'or2', name: 'Umbreon VMAX - Alt Art', set: 'Evolving Skies', grade: 'PSA 10', current: 410,
    forecast: [{ label: 'Current', value: 410, delta: 0 }, { label: '3M', value: 430, delta: 4.9 }, { label: '1Y', value: 390, delta: -4.9 }],
    confidence: 64, horizon: '12 months', reasoning: 'Umbreon alt art remains a fan favorite but the PSA 10 pop is large. Short-term momentum is positive; long-term ceiling may soften as supply rotates.',
    catalysts: ['Moonbreon cultural momentum', 'Tournament legal format'],
    risks: ['High PSA 10 population', 'Set still in circulation'],
    trend: [40,41,39,42,43,44,42,45,46,47,46,48], shared: true, author: 'NightShift', votes: 88,
  },
  {
    id: 'or3', name: 'Lugia V - Alt Art', set: 'Silver Tempest', grade: 'Raw', current: 64,
    forecast: [{ label: 'Current', value: 64, delta: 0 }, { label: '3M', value: 72, delta: 12.5 }, { label: '1Y', value: 95, delta: 48.4 }],
    confidence: 71, horizon: '12 months', reasoning: 'Silver Tempest is out of print and Lugia alt art raw copies are disappearing from local markets. Grading upside is significant.',
    catalysts: ['Set out of print', 'Grading arbitrage opportunity', 'Lugia archetype meta relevance'],
    risks: ['Raw copies still circulating online'],
    trend: [50,52,55,53,56,58,60,62,63,64,66,64],
  },
];

export const threads: Thread[] = [
  { id: 't1', title: 'Shared Oracle: Charizard ex SIR — 12 month outlook', author: 'you', avatar: 'Y', time: '2h', votes: 42, comments: 18, tags: ['Oracle', 'Charizard'], preview: 'Confidence 78%. Catalysts: set OOP, slowing PSA 10 pop. Risks: reprint rumor.', type: 'oracle', featured: true },
  { id: 't2', title: 'Anyone else seeing Lugia alt arts dry up locally?', author: 'ValleyCards', avatar: 'V', time: '5h', votes: 27, comments: 11, tags: ['Local', 'Lugia'], preview: 'Three meetups this week and zero raw Lugia alts. Are we out of Silver Tempest supply?', type: 'local' },
  { id: 't3', title: 'PSA 10 vs BGS 9.5 — which moves faster in Phoenix?', author: 'DesertTCG', avatar: 'D', time: '8h', votes: 19, comments: 24, tags: ['Grading', 'Discussion'], preview: 'I\'ve noticed PSA 10 listings sell ~30% faster locally. Anyone tracking this?', type: 'general' },
  { id: 't4', title: 'Shared Oracle: Umbreon VMAX alt — short term pop', author: 'NightShift', avatar: 'N', time: '1d', votes: 88, comments: 32, tags: ['Oracle', 'Umbreon'], preview: 'Confidence 64%. 3M up ~5%, 1Y slightly negative. Moonbreon momentum vs large pop.', type: 'oracle' },
  { id: 't5', title: 'Tempe meetup recap — best pulls of the weekend', author: 'MesaCards', avatar: 'M', time: '1d', votes: 54, comments: 9, tags: ['Local', 'Pulls'], preview: 'Saw a live Charizard SIR pull at the swap meet. Crowd went wild.', type: 'local' },
  { id: 't6', title: 'Best meetup spots in the East Valley?', author: 'AZCardCo', avatar: 'A', time: '2d', votes: 15, comments: 21, tags: ['Local', 'Meetup'], preview: 'Tempe Marketplace feels safest for high-value trades. Anyone prefer elsewhere?', type: 'general' },
];

export const shopStats = {
  live: 3, hidden: 1, sold: 1, views: 4288, saves: 95, offers: 11, rating: 4.8, sales: 312, revenue: 1240,
};

export const profile = {
  name: 'Lion Collector',
  handle: '@lionphx',
  followers: 284, following: 112, oracles: 3, reputation: 4.9,
};
