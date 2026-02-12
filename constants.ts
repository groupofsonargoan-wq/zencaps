
import { SubscriptionItem } from './types';

export const SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'yt-premium-1',
    name: 'YouTube Premium',
    category: 'Premium',
    price: 150,
    originalPrice: 180,
    currency: 'BDT',
    description: 'Ad-free, Background Play, YT Music included.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&auto=format&fit=crop',
    badge: 'Hot Deal',
    isHot: true
  },
  {
    id: 'netflix-1',
    name: 'Netflix Premium (UHD)',
    category: 'Streaming',
    price: 350,
    currency: 'BDT',
    description: '4 Screens, Ultra HD quality, shared slot.',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=400&auto=format&fit=crop',
    badge: 'Best Value'
  },
  {
    id: 'pubg-uc-1',
    name: 'PUBG Mobile UC (325)',
    category: 'Gaming',
    price: 399,
    originalPrice: 450,
    currency: 'BDT',
    description: 'Instant delivery to your Character ID.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
    badge: 'Flash Sale',
    isHot: true
  },
  {
    id: 'ff-diamonds-1',
    name: 'FF 530 Diamonds',
    category: 'Gaming',
    price: 420,
    currency: 'BDT',
    description: 'Free Fire Direct Topup via Player ID.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'spotify-1',
    name: 'Spotify Premium (1 Year)',
    category: 'Streaming',
    price: 850,
    originalPrice: 999,
    currency: 'BDT',
    description: 'Ad-free music, offline downloads.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400&auto=format&fit=crop',
    isHot: true
  },
  {
    id: 'canva-pro-1',
    name: 'Canva Pro Lifetime',
    category: 'Premium',
    price: 120,
    currency: 'BDT',
    description: 'Access to premium templates and tools.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop'
  }
];
