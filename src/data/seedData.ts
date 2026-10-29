import { Project, FAQ, SiteSettings } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    slug: 'the-pali-crest-bandra-west',
    title: 'The Pali Crest Residences',
    area: 'Bandra West',
    address: 'Nargis Dutt Road, Pali Hill, Bandra West, Mumbai 400050',
    category: 'Luxury Apartments',
    status: 'Ready',
    configuration: ['3 BHK', '4 BHK', 'Penthouse'],
    configurations: [
      {
        id: 'cfg-1a',
        type: '3 BHK Grande',
        carpetArea: 1450,
        price: 98000000,
        priceFormatted: '₹9.80 Cr',
        parking: '2 Covered Basement',
        balcony: '2 Wrap-around Sundecks',
        features: ['Arabian Sea Breeze', 'Private Foyer', 'Imported Italian Marble', 'Maid Quarters'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-1b',
        type: '4 BHK Presidential',
        carpetArea: 2150,
        price: 152000000,
        priceFormatted: '₹15.20 Cr',
        parking: '3 Reserved Covered',
        balcony: '3 Expansive Sundecks',
        features: ['Full Arabian Sea View', 'Private Elevator Access', 'Walk-in Wardrobe', 'Home Automation'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-1c',
        type: 'Penthouse Suite',
        carpetArea: 3800,
        price: 285000000,
        priceFormatted: '₹28.50 Cr',
        parking: '4 Reserved Stilt',
        balcony: 'Private Rooftop Terrace & Plunge Pool',
        features: ['360° Skyline & Sea View', 'Double-height Ceilings', 'Private Heated Jacuzzi', 'Dedicated Service Core'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 98000000,
    maxPrice: 285000000,
    startingPriceFormatted: '₹9.80 Cr',
    carpetArea: '1,450 - 3,800 sq.ft.',
    minArea: 1450,
    maxArea: 3800,
    possession: 'Ready to Move',
    possessionDate: '2024-06-30',
    amenities: [
      'Infinity Rooftop Pool',
      'Technogym Fitness Studio',
      'Concierge Desk',
      'Valet Parking',
      'Private Screening Lounge',
      'EV Charging Stations',
      'Acoustic Double Glazing'
    ],
    parking: '2 to 4 Reserved Covered Stilt',
    balcony: 'Expansive Sundecks overlooking Pali Hill greens',
    totalFloors: 18,
    vastuNotes: 'North-East oriented entry doors, kitchens positioned in Agni quadrant, master suites anchored in South-West stability zone.',
    description: 'Perched in the prestigious enclave of Pali Hill, The Pali Crest represents the pinnacle of discreet luxury in Bandra West. Crafted with bespoke Italian marble facades and floor-to-ceiling soundproof glazing, each residence commands verdant tree canopy vistas extending to the Arabian Sea horizon. Designed for connoisseurs seeking utmost privacy and seamless connectivity to Carter Road and Western Express Highway.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800031890',
    floorPlans: [
      { id: 'fp-1', title: '3 BHK Grande Typical Layout', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
      { id: 'fp-2', title: '4 BHK Sky Suite Layout', type: '4 BHK', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    architecturalPlanUrl: '#download-plan',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    featured: true,
    published: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'proj-2',
    slug: 'oberoi-sky-heights-andheri-west',
    title: 'Oberoi Sky Horizons',
    area: 'Andheri West',
    address: 'Near Lokhandwala Complex, Off Link Road, Andheri West, Mumbai 400053',
    category: 'Premium Residences',
    status: 'Ongoing',
    configuration: ['2 BHK', '3 BHK'],
    configurations: [
      {
        id: 'cfg-2a',
        type: '2 BHK Elegance',
        carpetArea: 865,
        price: 33500000,
        priceFormatted: '₹3.35 Cr',
        parking: '1 Covered Podium',
        balcony: '1 French Balcony',
        features: ['East Facing Vastu', 'Modular German Kitchen', 'Split ACs Installed'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-2b',
        type: '3 BHK Ultima',
        carpetArea: 1240,
        price: 49500000,
        priceFormatted: '₹4.95 Cr',
        parking: '2 Covered Stilt',
        balcony: 'Double Deck Balcony',
        features: ['Corner Bay Windows', 'Cross Ventilation', 'Servant Toilet', 'Smart Lock Door'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 33500000,
    maxPrice: 49500000,
    startingPriceFormatted: '₹3.35 Cr',
    carpetArea: '865 - 1,240 sq.ft.',
    minArea: 865,
    maxArea: 1240,
    possession: 'March 2026',
    possessionDate: '2026-03-31',
    amenities: [
      'Olympic Length Lap Pool',
      'Badminton Court',
      'Zen Reflexology Garden',
      'Children Adventure Zone',
      'Multi-tier 24/7 Security',
      'Banquet Hall & Cafe',
      'EV Charging Bays'
    ],
    parking: '1 to 2 Covered Multi-level Podium',
    balcony: 'Step-out balconies with panoramic Western views',
    totalFloors: 34,
    vastuNotes: '100% compliant East and North entrance alignments. Vastu certified layout ensuring abundance and peace.',
    description: 'Rising grandly amidst the vibrant pulse of Andheri West, Oberoi Sky Horizons redefines urban sophistication. Situated 5 minutes from Lokhandwala market and Infinity Mall, this architectural landmark offers seamless metro connectivity alongside a 2-acre podium landscaped by international landscape architects.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800029415',
    floorPlans: [
      { id: 'fp-2a', title: '2 BHK Elegance Master Plan', type: '2 BHK', image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80' },
      { id: 'fp-2b', title: '3 BHK Ultima Master Plan', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    architecturalPlanUrl: '#download-plan',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    featured: true,
    published: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-03-05T00:00:00.000Z'
  },
  {
    id: 'proj-3',
    slug: 'kalpataru-magnus-bandra-east',
    title: 'Kalpataru Magnus Vista',
    area: 'Bandra East',
    address: 'Kalanagar, Adjacent to BKC Connector, Bandra East, Mumbai 400051',
    category: 'Luxury Apartments',
    status: 'Ready',
    configuration: ['3 BHK', '4 BHK'],
    configurations: [
      {
        id: 'cfg-3a',
        type: '3 BHK Grandeur',
        carpetArea: 1320,
        price: 68500000,
        priceFormatted: '₹6.85 Cr',
        parking: '2 Covered Stilt',
        balcony: 'L-shaped Living Balcony',
        features: ['BKC Skyline View', 'Separate Utility Area', 'Double Glazed Acoustic Windows'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-3b',
        type: '4 BHK Imperial',
        carpetArea: 1890,
        price: 99000000,
        priceFormatted: '₹9.90 Cr',
        parking: '3 Covered Basement',
        balcony: 'Dual Balconies',
        features: ['Private Elevator Lobby', 'Expansive Master Suite', 'Direct BKC Proximity'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 68500000,
    maxPrice: 99000000,
    startingPriceFormatted: '₹6.85 Cr',
    carpetArea: '1,320 - 1,890 sq.ft.',
    minArea: 1320,
    maxArea: 1890,
    possession: 'Ready to Move',
    possessionDate: '2024-09-15',
    amenities: [
      'Sky Lounge at 300 Ft',
      'Heated Indoor Pool',
      'Executive Business Center',
      'Squash Court',
      'Spa and Steam Room',
      'Electric Vehicle Fast Chargers',
      'Smart Home Automation'
    ],
    parking: '2 to 3 Covered Basement Parking Slots',
    balcony: 'Sunlit sit-out sundecks with clear skyline views',
    totalFloors: 32,
    vastuNotes: 'Optimal Ishanya (North-East) water placement and Nairutya master chambers.',
    description: 'Ideally positioned next to Bandra Kurla Complex (BKC), Kalpataru Magnus Vista is designed for top corporate executives and entrepreneurs. Walk to leading multinational offices, Jio World Drive, and top international schools, while enjoying absolute peace in a lush gated sanctuary.',
    images: [
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800030112',
    floorPlans: [
      { id: 'fp-3a', title: '3 BHK Grandeur Blueprint', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    architecturalPlanUrl: '#download-plan',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    featured: true,
    published: true,
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-03-02T00:00:00.000Z'
  },
  {
    id: 'proj-4',
    slug: 'the-sea-crest-juhu',
    title: 'The Sea Crest Juhu',
    area: 'Juhu',
    address: 'Gulmohar Road, JVPD Scheme, Juhu, Mumbai 400049',
    category: 'Boutique Seafront',
    status: 'Upcoming',
    configuration: ['3 BHK', '4 BHK', 'Penthouse'],
    configurations: [
      {
        id: 'cfg-4a',
        type: '3 BHK Coastal',
        carpetArea: 1650,
        price: 115000000,
        priceFormatted: '₹11.50 Cr',
        parking: '2 Covered Stilt',
        balcony: 'Beachfront Deck',
        features: ['Arabian Sea Views', 'Low Density Building (Only 14 Units)', 'High Spec Automation'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-4b',
        type: '4 BHK Royal Haven',
        carpetArea: 2550,
        price: 185000000,
        priceFormatted: '₹18.50 Cr',
        parking: '3 Reserved Covered',
        balcony: 'Double Deck Ocean Terraces',
        features: ['Full Floor Option', 'Direct Elevator Entry', 'Customised Wet Bar', 'Maid Room'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 115000000,
    maxPrice: 185000000,
    startingPriceFormatted: '₹11.50 Cr',
    carpetArea: '1,650 - 2,550 sq.ft.',
    minArea: 1650,
    maxArea: 2550,
    possession: 'December 2027',
    possessionDate: '2027-12-31',
    amenities: [
      'Private Temperature-controlled Pool',
      'Cigar and Wine Cellar Lounge',
      'Art Deco Foyer with 24-hr Valet',
      'Wellness Pavilion & Sauna',
      'High Security Biometrics'
    ],
    parking: '2 to 3 Hydraulic Stacked and Stilt',
    balcony: 'Deep oceanview sundecks with glass balustrades',
    totalFloors: 11,
    vastuNotes: 'Harmonious water-element orientation facing Arabian sea to invoke continuous wealth and vitality.',
    description: 'An ultra-exclusive collection of just 14 ocean-facing residences in prime JVPD Scheme, Juhu. Walk to Soho House, JW Marriott, and the quietest stretches of Juhu beach. Tailored for Mumbai’s cultural and industrial elite.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800041209',
    floorPlans: [
      { id: 'fp-4a', title: '3 BHK Coastal Oceanview Layout', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    architecturalPlanUrl: '#download-plan',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    featured: true,
    published: true,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-03-07T00:00:00.000Z'
  },
  {
    id: 'proj-5',
    slug: 'rustomjee-crown-borivali-west',
    title: 'Rustomjee Crown Woods',
    area: 'Borivali West',
    address: 'Near Shimpoli Road, Off Link Road, Borivali West, Mumbai 400092',
    category: 'Gated Community',
    status: 'Ongoing',
    configuration: ['2 BHK', '3 BHK'],
    configurations: [
      {
        id: 'cfg-5a',
        type: '2 BHK Smart Luxe',
        carpetArea: 720,
        price: 18500000,
        priceFormatted: '₹1.85 Cr',
        parking: '1 Covered Stilt',
        balcony: '1 Flowerbed Balcony',
        features: ['National Park Green View', 'Vastu Friendly', 'Zero Space Wastage'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-5b',
        type: '3 BHK Spacia',
        carpetArea: 1050,
        price: 27500000,
        priceFormatted: '₹2.75 Cr',
        parking: '1 Covered Podium',
        balcony: 'Double Balconies',
        features: ['Master Suite with Walk-in Nook', 'Modular Kitchen with Piped Gas', 'Corner Unit'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 18500000,
    maxPrice: 27500000,
    startingPriceFormatted: '₹1.85 Cr',
    carpetArea: '720 - 1,050 sq.ft.',
    minArea: 720,
    maxArea: 1050,
    possession: 'December 2026',
    possessionDate: '2026-12-15',
    amenities: [
      'Podium Club with 25+ Lifestyle Amenities',
      'Cricket Bowling Pitch',
      'Toddler Splash Pool',
      'Senior Citizen Pavilion',
      'Yoga Deck amidst Nature',
      'Solar Lighting in Common Areas'
    ],
    parking: '1 Covered Stilt/Podium',
    balcony: 'Sunlit sundecks with peaceful garden and city views',
    totalFloors: 26,
    vastuNotes: 'Main entrance oriented towards auspicious North and East vectors.',
    description: 'Set in tranquil Borivali West, Rustomjee Crown Woods delivers a healthy green lifestyle with quick access to the Metro Line 2A and Borivali Railway Station. Enjoy quiet neighborhood living near IC Colony, top-rated schools, and multi-specialty hospitals.',
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800035820',
    floorPlans: [
      { id: 'fp-5a', title: '2 BHK Smart Plan', type: '2 BHK', image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    featured: false,
    published: true,
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'proj-6',
    slug: 'lodha-marq-khar-west',
    title: 'Lodha Solitaire Khar',
    area: 'Khar West',
    address: '14th Road, Off Linking Road, Khar West, Mumbai 400052',
    category: 'Luxury Apartments',
    status: 'Ready',
    configuration: ['3 BHK', '4 BHK'],
    configurations: [
      {
        id: 'cfg-6a',
        type: '3 BHK Premier',
        carpetArea: 1380,
        price: 84000000,
        priceFormatted: '₹8.40 Cr',
        parking: '2 Covered Stilt',
        balcony: '2 Balconies',
        features: ['Tree-lined 14th Road View', 'Private Entrance Foyer', 'Poggenpohl Kitchen'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-6b',
        type: '4 BHK Signature',
        carpetArea: 1950,
        price: 122000000,
        priceFormatted: '₹12.20 Cr',
        parking: '3 Reserved Covered',
        balcony: 'Wraparound Deck',
        features: ['Full Floor Aura', 'Imported Fixtures', 'Staff Quarters'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 84000000,
    maxPrice: 122000000,
    startingPriceFormatted: '₹8.40 Cr',
    carpetArea: '1,380 - 1,950 sq.ft.',
    minArea: 1380,
    maxArea: 1950,
    possession: 'Ready to Move',
    possessionDate: '2025-01-20',
    amenities: [
      'Rooftop Infinity Edge Pool',
      'Artisanal Coffee Bar',
      'Personal Fitness Training Studio',
      'Covered Heated Spa',
      'Automated Valet Retrieval'
    ],
    parking: '2 to 3 Covered Reserved Stilt',
    balcony: 'Dual covered sundecks with teakwood deck flooring',
    totalFloors: 14,
    vastuNotes: 'North-East entrance, kitchen in Agneya (South-East), Master Suite in Nairutya (South-West).',
    description: 'An elite bespoke development on leafy 14th Road in Khar West. Seamlessly blending quiet residential serenity with walking convenience to high-end boutiques on Linking Road, organic cafes, and Bandra Gymkhana.',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800033100',
    floorPlans: [
      { id: 'fp-6a', title: '3 BHK Premier Layout Plan', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    architecturalPlanUrl: '#download-plan',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    featured: true,
    published: true,
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-03-08T00:00:00.000Z'
  },
  {
    id: 'proj-7',
    slug: 'sheth-midtown-goregaon-west',
    title: 'Sheth Aurelia Greens',
    area: 'Goregaon West',
    address: 'Near Inorbit Mall, Link Road, Goregaon West, Mumbai 400104',
    category: 'High-Rise Tower',
    status: 'Ongoing',
    configuration: ['2 BHK', '3 BHK'],
    configurations: [
      {
        id: 'cfg-7a',
        type: '2 BHK Comfort',
        carpetArea: 780,
        price: 21500000,
        priceFormatted: '₹2.15 Cr',
        parking: '1 Covered Stilt',
        balcony: '1 Balcony',
        features: ['Aarey Colony Green Views', 'Vastu Friendly', 'Fitted Gas Piped System'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-7b',
        type: '3 BHK Luxury',
        carpetArea: 1120,
        price: 32000000,
        priceFormatted: '₹3.20 Cr',
        parking: '2 Covered Podium',
        balcony: '2 Balconies',
        features: ['Cross Ventilation', 'Smart Lighting Controls', 'Separate Drying Space'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 21500000,
    maxPrice: 32000000,
    startingPriceFormatted: '₹2.15 Cr',
    carpetArea: '780 - 1,120 sq.ft.',
    minArea: 780,
    maxArea: 1120,
    possession: 'September 2026',
    possessionDate: '2026-09-30',
    amenities: [
      'Grand 25,000 sq.ft. Clubhouse',
      'Temperature Controlled Swimming Pool',
      'Tennis & Pickleball Courts',
      'Kids Play & Trampoline Park',
      'Co-working Lounge with High-speed Wi-Fi',
      'Electric Vehicle Charging Stations'
    ],
    parking: '1 to 2 Covered Multi-level Podium',
    balcony: 'Wide sundecks with unhindered views over green canopy',
    totalFloors: 38,
    vastuNotes: 'Rectangular plot geometry ensuring balanced prana energy throughout all residential zones.',
    description: 'Located in the vibrant heart of Goregaon West opposite Inorbit Mall and minutes from Mindspace IT Park. Sheth Aurelia Greens offers unmatched lifestyle amenities with effortless connectivity to the Western Express Highway and Goregaon Railway Station.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800032987',
    floorPlans: [
      { id: 'fp-7a', title: '2 BHK Comfort Layout', type: '2 BHK', image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    featured: false,
    published: true,
    createdAt: '2026-02-12T00:00:00.000Z',
    updatedAt: '2026-03-02T00:00:00.000Z'
  },
  {
    id: 'proj-8',
    slug: 'transcon-triumph-andheri-west',
    title: 'Transcon Sky Mansion',
    area: 'Andheri West',
    address: 'Near Infiniti Mall, Off New Link Road, Andheri West, Mumbai 400053',
    category: 'Penthouse Suites',
    status: 'Ready',
    configuration: ['3 BHK', '4 BHK'],
    configurations: [
      {
        id: 'cfg-8a',
        type: '3 BHK Skyline',
        carpetArea: 1410,
        price: 54000000,
        priceFormatted: '₹5.40 Cr',
        parking: '2 Covered Stilt',
        balcony: '2 Balconies',
        features: ['High Ceilings', 'Panoramic City Panorama', 'Automation Ready'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-8b',
        type: '4 BHK Sky Duplex',
        carpetArea: 2380,
        price: 97500000,
        priceFormatted: '₹9.75 Cr',
        parking: '3 Reserved Covered',
        balcony: 'Private Rooftop Terrace',
        features: ['Double Height Living Room', 'Private Jacuzzi Deck', 'Servant Quarters'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 54000000,
    maxPrice: 97500000,
    startingPriceFormatted: '₹5.40 Cr',
    carpetArea: '1,410 - 2,380 sq.ft.',
    minArea: 1410,
    maxArea: 2380,
    possession: 'Ready to Move',
    possessionDate: '2025-05-10',
    amenities: [
      'Infinity Pool with Sky Deck',
      'State-of-the-art Gym',
      'Private Theatre Room',
      'High-Speed Elevators with Biometric Security',
      'EV Car Charging Points'
    ],
    parking: '2 to 3 Covered Stilt',
    balcony: 'Expansive private sundecks with skyline views',
    totalFloors: 35,
    vastuNotes: '100% Vastu verified with northeast water tanks and east-facing balconies.',
    description: 'An iconic silhouette rising high above Andheri West. Transcon Sky Mansion combines theatrical grandeur with thoughtful architectural design, offering ultra-spacious configurations tailored for contemporary Mumbai families.',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800028741',
    floorPlans: [
      { id: 'fp-8a', title: '3 BHK Skyline Layout', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    featured: false,
    published: true,
    createdAt: '2026-02-14T00:00:00.000Z',
    updatedAt: '2026-03-05T00:00:00.000Z'
  },
  {
    id: 'proj-9',
    slug: 'shreeji-elegance-kandivali-west',
    title: 'Shreeji Sharan Heights',
    area: 'Kandivali West',
    address: 'Mahavir Nagar, Near D-Mart, Kandivali West, Mumbai 400067',
    category: 'Gated Community',
    status: 'Upcoming',
    configuration: ['1 BHK', '2 BHK', '3 BHK'],
    configurations: [
      {
        id: 'cfg-9a',
        type: '1 BHK Smart',
        carpetArea: 485,
        price: 11500000,
        priceFormatted: '₹1.15 Cr',
        parking: '1 Puzzle Parking',
        balcony: 'French Window Sitout',
        features: ['Compact High Utility', 'Vastu Aligned', 'Low Maintenance'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-9b',
        type: '2 BHK Premium',
        carpetArea: 760,
        price: 17800000,
        priceFormatted: '₹1.78 Cr',
        parking: '1 Covered Stilt',
        balcony: '1 Sundeck',
        features: ['Mahavir Nagar Food Street Walkable', 'Air Conditioned Lobby'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-9c',
        type: '3 BHK Royal',
        carpetArea: 1080,
        price: 25500000,
        priceFormatted: '₹2.55 Cr',
        parking: '2 Covered Stilt',
        balcony: '2 Sundecks',
        features: ['Jain Derasar within 200m', 'Temple Facing', 'Granite Platform Kitchen'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 11500000,
    maxPrice: 25500000,
    startingPriceFormatted: '₹1.15 Cr',
    carpetArea: '485 - 1,080 sq.ft.',
    minArea: 485,
    maxArea: 1080,
    possession: 'June 2027',
    possessionDate: '2027-06-30',
    amenities: [
      'Jain Temple and Community Hall',
      'Rooftop Jogging Track',
      'Kids Play Area with Rubber Flooring',
      'Fitness Gym & Yoga Room',
      'Intercom and Video Door Phone'
    ],
    parking: 'Puzzle and Covered Stilt Parking',
    balcony: 'Open view sitouts overlooking Mahavir Nagar',
    totalFloors: 22,
    vastuNotes: 'Pure North-facing and East-facing doors with dedicated clean North-East pooja corner.',
    description: 'Situated in the thriving family community of Mahavir Nagar, Kandivali West. A short stroll to famous eateries, schools, Jain Derasars, and the Kandivali Metro Station. An ideal blend of cultural warmth and modern lifestyle amenities.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800044567',
    floorPlans: [
      { id: 'fp-9a', title: '2 BHK Premium Floor Plan', type: '2 BHK', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    featured: false,
    published: true,
    createdAt: '2026-02-18T00:00:00.000Z',
    updatedAt: '2026-03-05T00:00:00.000Z'
  },
  {
    id: 'proj-10',
    slug: 'adhirad-samadhi-malad-west',
    title: 'Adhirad Palm Springs',
    area: 'Malad West',
    address: 'Near Mindspace IT Park, Link Road, Malad West, Mumbai 400064',
    category: 'Premium Residences',
    status: 'Ongoing',
    configuration: ['2 BHK', '3 BHK'],
    configurations: [
      {
        id: 'cfg-10a',
        type: '2 BHK Urban',
        carpetArea: 755,
        price: 19500000,
        priceFormatted: '₹1.95 Cr',
        parking: '1 Covered Stilt',
        balcony: '1 Balcony',
        features: ['Mindspace Walkable', 'Air-Conditioned Master Bedroom'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-10b',
        type: '3 BHK Skyline',
        carpetArea: 1090,
        price: 28900000,
        priceFormatted: '₹2.89 Cr',
        parking: '2 Covered Stilt',
        balcony: '2 Balconies',
        features: ['Mangrove Green Sanctuary Views', 'Modular Kitchen Fitted'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 19500000,
    maxPrice: 28900000,
    startingPriceFormatted: '₹1.95 Cr',
    carpetArea: '755 - 1,090 sq.ft.',
    minArea: 755,
    maxArea: 1090,
    possession: 'October 2026',
    possessionDate: '2026-10-31',
    amenities: [
      'Rooftop Stargazing Deck',
      'Infinity Swimming Pool',
      'Squash Court & Indoor Games Room',
      'Multipurpose Community Hall',
      'EV Charging Station'
    ],
    parking: 'Covered Stilt & Podium Parking',
    balcony: 'Private sundecks with expansive mangrove and creek views',
    totalFloors: 30,
    vastuNotes: 'Designed according to Vedic alignment with open North-East airflow.',
    description: 'A sanctuary of modern urban living in Malad West. Situated adjacent to Mindspace IT SEZ and Infiniti Mall, Adhirad Palm Springs gives professionals effortless commutes and resort-like tranquility.',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800037142',
    floorPlans: [
      { id: 'fp-10a', title: '2 BHK Urban Layout', type: '2 BHK', image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    featured: false,
    published: true,
    createdAt: '2026-02-20T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'proj-11',
    slug: 'santacruz-oceanic-residences',
    title: 'The Oceanic Santacruz',
    area: 'Santacruz West',
    address: 'Near Tagore Road, Off Juhu Tara Road, Santacruz West, Mumbai 400054',
    category: 'Boutique Seafront',
    status: 'Ready',
    configuration: ['3 BHK', '4 BHK'],
    configurations: [
      {
        id: 'cfg-11a',
        type: '3 BHK Oceanfront',
        carpetArea: 1520,
        price: 92000000,
        priceFormatted: '₹9.20 Cr',
        parking: '2 Covered Stilt',
        balcony: '2 Balconies',
        features: ['Direct Sea View', 'Private Foyer', 'Imported Wood Floor'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-11b',
        type: '4 BHK Presidential',
        carpetArea: 2200,
        price: 145000000,
        priceFormatted: '₹14.50 Cr',
        parking: '3 Reserved Covered',
        balcony: 'Wraparound Deck',
        features: ['Full Arabian Sea Panorama', 'Private Lift Access', 'Servant Quarters'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 92000000,
    maxPrice: 145000000,
    startingPriceFormatted: '₹9.20 Cr',
    carpetArea: '1,520 - 2,200 sq.ft.',
    minArea: 1520,
    maxArea: 2200,
    possession: 'Ready to Move',
    possessionDate: '2024-11-15',
    amenities: [
      'Rooftop Swimming Pool',
      'Private Health Spa & Steam Room',
      '24/7 Butler & Concierge Service',
      'Smart Fingerprint Access',
      'Silent DG Backup'
    ],
    parking: '2 to 3 Covered Reserved Stilt',
    balcony: 'Expansive private sundecks facing the Arabian Sea',
    totalFloors: 12,
    vastuNotes: 'Auspicious East & North ventilation pathways with sea alignment.',
    description: 'Rare boutique ocean-view residences situated between Santacruz West and Juhu. Immerse yourself in serenity with private balconies overlooking Arabian waves, just 10 minutes from the domestic airport and Bandra West.',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800031198',
    floorPlans: [
      { id: 'fp-11a', title: '3 BHK Oceanfront Layout', type: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    featured: true,
    published: true,
    createdAt: '2026-02-22T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'proj-12',
    slug: 'parinee-crest-vile-parle-west',
    title: 'Parinee Crest Vile Parle',
    area: 'Vile Parle',
    address: 'Near Mithibai College, VM Road, Vile Parle West, Mumbai 400056',
    category: 'Premium Residences',
    status: 'Ready',
    configuration: ['2 BHK', '3 BHK'],
    configurations: [
      {
        id: 'cfg-12a',
        type: '2 BHK Elite',
        carpetArea: 810,
        price: 36000000,
        priceFormatted: '₹3.60 Cr',
        parking: '1 Covered Stilt',
        balcony: '1 Balcony',
        features: ['East Facing', 'Vile Parle Station 5 Mins', 'Imported Marble'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cfg-12b',
        type: '3 BHK Grande',
        carpetArea: 1220,
        price: 52000000,
        priceFormatted: '₹5.20 Cr',
        parking: '2 Covered Stilt',
        balcony: '2 Balconies',
        features: ['Quiet Tree Canopy Outlook', 'Spacious Puja Niche', 'Italian Bathware'],
        floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    startingPrice: 36000000,
    maxPrice: 52000000,
    startingPriceFormatted: '₹3.60 Cr',
    carpetArea: '810 - 1,220 sq.ft.',
    minArea: 810,
    maxArea: 1220,
    possession: 'Ready to Move',
    possessionDate: '2025-02-28',
    amenities: [
      'Terrace Sky Garden',
      'Fitness Studio with Personal Trainer',
      'Automated Mechanical Parking',
      '24/7 Manned Security',
      'High-Speed Elevators'
    ],
    parking: '1 to 2 Covered Stilt',
    balcony: 'Flowerbed balconies overlooking quiet green residential lanes',
    totalFloors: 14,
    vastuNotes: 'Compliant Ishanya and Agneya quadrants with peaceful energy flow.',
    description: 'Set in the esteemed educational and cultural hub of Vile Parle West. Walk to prestigious institutions like Mithibai and NMIMS, Jain mandirs, and cultural centers, while maintaining fast road access to Western Express Highway and Juhu.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    reraNumber: 'P51800030589',
    floorPlans: [
      { id: 'fp-12a', title: '2 BHK Elite Layout', type: '2 BHK', image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80' }
    ],
    brochureUrl: '#download-brochure',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    featured: false,
    published: true,
    createdAt: '2026-02-25T00:00:00.000Z',
    updatedAt: '2026-03-05T00:00:00.000Z'
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Why choose TrustKeys instead of mass property listing portals?',
    answer: 'Unlike generic aggregators flooded with expired listings, deceptive prices, and spam calls, TrustKeys operates on an exclusive physical verification model. Every property in our portfolio has undergone on-ground inspection, MahaRERA title verification, and direct developer pricing validation. You receive one dedicated Western Mumbai advisor from search to key handover.',
    category: 'Buying',
    sortOrder: 1,
    published: true
  },
  {
    id: 'faq-2',
    question: 'How does TrustKeys verify MahaRERA registration and legal title?',
    answer: 'Before listing any development, our legal team verifies the developer’s MahaRERA certificate, approved building sanctions, encumbrance certificates, commencement certificates (CC), and escrow bank account records directly from the MahaRERA public portal. We provide buyers with a verified legal check summary free of charge.',
    category: 'RERA & Legal',
    sortOrder: 2,
    published: true
  },
  {
    id: 'faq-3',
    question: 'Which Western Mumbai micro-markets do you specialize in?',
    answer: 'We specialize exclusively in the Western Suburbs of Mumbai: Bandra West, Bandra East (BKC vicinity), Khar West, Santacruz West, Juhu, Vile Parle, Andheri West, Goregaon West, Malad West, Kandivali West, and Borivali West. Our hyper-local presence ensures deep price-per-square-foot benchmarks and off-market inventory access.',
    category: 'Buying',
    sortOrder: 3,
    published: true
  },
  {
    id: 'faq-4',
    question: 'How do you assist property sellers in Western Mumbai?',
    answer: 'For sellers, we provide a data-backed Comparative Market Analysis (CMA) based on registered transactions in your micro-market, professional architectural photography, curated digital marketing to pre-vetted HNIs and investors, and complete assistance with society NOCs, title search, and stamp duty registration.',
    category: 'Selling',
    sortOrder: 4,
    published: true
  },
  {
    id: 'faq-5',
    question: 'Can you assist with home loans and banking tie-ups in Mumbai?',
    answer: 'Yes. TrustKeys has direct institutional tie-ups with leading Indian banks (HDFC Bank, ICICI Bank, State Bank of India, Kotak Mahindra Bank, Axis Bank). We assist with pre-approvals, maximum eligible loan amounts (up to 80% of property cost), competitive interest rates starting at 8.40%, and doorstep document collection.',
    category: 'Home Loans',
    sortOrder: 5,
    published: true
  },
  {
    id: 'faq-6',
    question: 'How does your Vastu Shastra guidance work?',
    answer: 'Our in-house advisory includes certified Vastu assessment according to traditional directional principles (Ishanya for entrances and water, Agneya for kitchens, Nairutya for master bedrooms). We provide actionable, non-demolition remedies and score each layout so you can make informed decisions aligned with your family traditions.',
    category: 'Vastu',
    sortOrder: 6,
    published: true
  }
];

export const initialSiteSettings: SiteSettings = {
  id: 'default',
  businessName: 'TrustKeys',
  tagline: 'Thoughtful homes. Clear decisions.',
  phone: '+91 99871 54120',
  phoneSecondary: '',
  email: 'ts472000@gmail.com',
  notificationEmail: 'ts472000@gmail.com',
  address: 'Dheeraj Savera, Siddharth Nagar, Borivali(E), Mumbai',
  googleMapsUrl: '',
  officeHours: 'Monday – Saturday: 9:30 AM – 7:30 PM (Sundays by private appointment)',
  aboutSummary: 'TrustKeys was started in February 2026 by Tejas Shah and Shweta Shah. Tejas is an ex-banker with 15 years of underwriting experience and gained real-estate experience at Indihomes before starting TrustKeys.',
  advisorName: 'Tejas Shah',
  advisorTitle: 'Real Estate Professional',
  advisorRera: '',
  advisorBio: 'Tejas Shah is an ex-banker with 15 years of underwriting experience and prior real-estate experience at Indihomes.',
  advisorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  whatsappNumber: '+919987154120',
  socialLinks: {
    instagram: 'https://www.instagram.com/trustkeys_realtors',
    facebook: 'https://www.facebook.com/people/Trustkeys-Realtors/61585075687649/'
  },
  updatedAt: new Date().toISOString()
};
