import { VastuQuestion } from '../types';

export const vastuQuestions: VastuQuestion[] = [
  {
    id: 'entrance',
    category: 'Main Threshold',
    title: 'Main Entrance Door Orientation',
    description: 'Which compass direction does your main entrance door face when standing inside the home looking outside?',
    options: [
      {
        value: 'north-east',
        label: 'North-East (Ishanya)',
        score: 10,
        rationale: 'Ishanya is the supreme gateway for cosmic prana, abundance, mental clarity, and spiritual enlightenment.',
        remedy: 'Keep entrance brightly lit, immaculate, and unobstructed. Consider placing a brass bowl with water and fresh flowers.'
      },
      {
        value: 'east',
        label: 'East (Surya / Indra)',
        score: 9.5,
        rationale: 'East welcomes the life-giving solar energies of sunrise, fostering vitality, career recognition, and optimism.',
        remedy: 'Use light wooden doors with auspicious symbols such as Swastik or Om.'
      },
      {
        value: 'north',
        label: 'North (Kuber)',
        score: 9,
        rationale: 'Governed by Lord Kubera and Mercury, this alignment facilitates financial inflow, business growth, and wealth accumulation.',
        remedy: 'A green or emerald touch in doormats or plants attracts positive mercantile energy.'
      },
      {
        value: 'north-west',
        label: 'North-West (Vayu)',
        score: 6.5,
        rationale: 'Governed by the Air element, promoting movement, guest arrivals, and social dynamism.',
        remedy: 'Install warm white spotlights and a brass threshold plate to stabilize transitional currents.'
      },
      {
        value: 'west',
        label: 'West (Varuna)',
        score: 6,
        rationale: 'West entrance delivers steady professional progress, though evening thermal heat must be managed.',
        remedy: 'Utilize solid wood or metal reinforcements with neutral or metallic color accents.'
      },
      {
        value: 'south-east',
        label: 'South-East (Agni)',
        score: 4.5,
        rationale: 'Fiery quadrant entrance may generate restless temperament or frequent expenditures unless balanced.',
        remedy: 'Display a copper sun emblem and place a red coral or carnelian crystal near the threshold.'
      },
      {
        value: 'south',
        label: 'South (Yama)',
        score: 4,
        rationale: 'Requires careful demarcation to prevent sudden energy drains.',
        remedy: 'Strengthen entry with heavy teak wood, warm red-brown tones, and avoid mirrors directly facing the door.'
      },
      {
        value: 'south-west',
        label: 'South-West (Nairutya)',
        score: 2,
        rationale: 'Nairutya is traditionally the zone of stability and closure, not suitable for entry gateways.',
        remedy: 'Traditional remedy: Install a yellow/ochre tile, lead helix, or Panchmukhi Hanuman plaque above the frame.'
      }
    ]
  },
  {
    id: 'kitchen',
    category: 'Fire Element (Agni)',
    title: 'Kitchen & Cooktop Position',
    description: 'In which sector of the home is the kitchen (and cooking gas/hob) installed?',
    options: [
      {
        value: 'south-east',
        label: 'South-East (Agneya Corner)',
        score: 10,
        rationale: 'The primordial fire sector. Cooking here ensures digestion, metabolic health, prosperity, and household warmth.',
        remedy: 'Cook facing East for enhanced vitality.'
      },
      {
        value: 'north-west',
        label: 'North-West (Vayavya Corner)',
        score: 8,
        rationale: 'Secondary favorable location governed by Vayu (air feeds fire safely).',
        remedy: 'Maintain spotless countertops and use ivory or soft pastel tones.'
      },
      {
        value: 'east',
        label: 'East Direction',
        score: 6.5,
        rationale: 'Morning sun creates hygienic cooking spaces, acceptable secondary option.',
        remedy: 'Ensure sink (water) is spaced at least 3 feet away from burner (fire).'
      },
      {
        value: 'west',
        label: 'West Direction',
        score: 5,
        rationale: 'Moderate stability but evening temperatures can rise.',
        remedy: 'Use granite tops and adequate exhaust ventilation.'
      },
      {
        value: 'south-west',
        label: 'South-West',
        score: 2.5,
        rationale: 'Earth element clash; may lead to unnecessary expenditures or friction.',
        remedy: 'Place a yellow jasper stone slab under the gas stove.'
      },
      {
        value: 'north-east',
        label: 'North-East (Ishanya)',
        score: 1.5,
        rationale: 'Fire in the sacred water quadrant disrupts mental peace and tranquility.',
        remedy: 'Keep cooking burner minimal; paint wall light mint green or cream; place bronze bells.'
      }
    ]
  },
  {
    id: 'master_bedroom',
    category: 'Earth Element (Prithvi)',
    title: 'Master Bedroom Location',
    description: 'Where is the master suite located for the head of the household?',
    options: [
      {
        value: 'south-west',
        label: 'South-West (Nairutya)',
        score: 10,
        rationale: 'Anchored in the heavy Earth zone. Grants emotional grounding, sound sleep, authority, and financial stability.',
        remedy: 'Sleep with head towards South or East. Avoid mirrors reflecting the bed.'
      },
      {
        value: 'south',
        label: 'South',
        score: 8.5,
        rationale: 'Deep restful delta sleep cycles and mental grounding.',
        remedy: 'Use earthy palettes like sand, ochre, and warm beige.'
      },
      {
        value: 'west',
        label: 'West',
        score: 8,
        rationale: 'Supports prosperity, leadership roles, and good health for mature adults.',
        remedy: 'Incorporate metallic or grey accent textures.'
      },
      {
        value: 'north-west',
        label: 'North-West',
        score: 6.5,
        rationale: 'Air element keeps thoughts mobile; great for couples who travel frequently.',
        remedy: 'Place heavy wardrobe cabinets on the southern wall.'
      },
      {
        value: 'east',
        label: 'East',
        score: 5.5,
        rationale: 'Stimulating and vibrant, well-suited for teenagers or guests.',
        remedy: 'Keep decor subtle and tranquil.'
      },
      {
        value: 'north-east',
        label: 'North-East',
        score: 2.5,
        rationale: 'Excessive spiritual sensitivity here can cause interrupted sleep for householders.',
        remedy: 'Use pastel blues; remove heavy furniture from North-East corner of the bedroom.'
      }
    ]
  },
  {
    id: 'pooja_space',
    category: 'Divine Zone (Brahma / Ishan)',
    title: 'Pooja / Meditation Corner',
    description: 'Where is your home temple, prayer shrine, or quiet meditation sanctuary?',
    options: [
      {
        value: 'north-east',
        label: 'North-East (Ishanya)',
        score: 10,
        rationale: 'The absolute supreme zone of spiritual resonance, clarity, and cosmic blessing.',
        remedy: 'Keep temple on a raised wooden or white marble platform.'
      },
      {
        value: 'east',
        label: 'East',
        score: 8.5,
        rationale: 'Connects to solar consciousness, wisdom, and educational triumphs.',
        remedy: 'Face East while reciting prayers or meditating.'
      },
      {
        value: 'north',
        label: 'North',
        score: 8,
        rationale: 'Facilitates divine grace, prosperity, and noble pursuits.',
        remedy: 'Use silver or brass diyas.'
      },
      {
        value: 'west',
        label: 'West',
        score: 6,
        rationale: 'Acceptable alternative in high-rise apartments.',
        remedy: 'Ensure idol faces East towards the devotee.'
      },
      {
        value: 'south-west',
        label: 'South or South-West',
        score: 2,
        rationale: 'Heavy zone unsuitable for light spiritual consecration.',
        remedy: 'Ensure shrine is enclosed in a dedicated teak mandir with doors closed during non-prayer hours.'
      }
    ]
  },
  {
    id: 'toilet',
    category: 'Disposal & Sanitation (Visarjan)',
    title: 'Toilet / Drainage Location',
    description: 'Where is the main shared or guest toilet situated?',
    options: [
      {
        value: 'north-west',
        label: 'North-West (Vayavya)',
        score: 10,
        rationale: 'Ideal wind sector for clean disposal, preventing stagnant foul energies.',
        remedy: 'Ensure proper ventilation and exhaust fans.'
      },
      {
        value: 'west',
        label: 'West / South-West of West',
        score: 8.5,
        rationale: 'Recognized disposal sector in classical texts.',
        remedy: 'Keep toilet lid closed when not in use.'
      },
      {
        value: 'south',
        label: 'South (South of South-West)',
        score: 7.5,
        rationale: 'Proper zone for discarding waste matter.',
        remedy: 'Use sea salt in a small ceramic bowl to absorb negativity.'
      },
      {
        value: 'south-east',
        label: 'South-East',
        score: 3.5,
        rationale: 'Water and sanitation in fire sector causes element clashing.',
        remedy: 'Hang a copper wire or strip around the bathroom frame.'
      },
      {
        value: 'north-east',
        label: 'North-East (Ishanya)',
        score: 0,
        rationale: 'Major Vastu flaw. Disrupts peace and financial wellbeing.',
        remedy: 'Traditional remedy: Place energized sea salt in a glass bowl, keep spotless, and place a brass pyramid strip.'
      }
    ]
  },
  {
    id: 'living_room',
    category: 'Social Harmony',
    title: 'Living Room / Family Lounge Position',
    description: 'Where is the main living room / entertaining hall located?',
    options: [
      {
        value: 'north-east',
        label: 'North-East or North',
        score: 10,
        rationale: 'Invites joy, welcoming hospitality, clear conversations, and pleasant visitors.',
        remedy: 'Keep central floor area (Brahmasthan) uncluttered.'
      },
      {
        value: 'east',
        label: 'East',
        score: 9,
        rationale: 'Flooded with morning sun, instilling high vibrancy and family bonding.',
        remedy: 'Position heavy sofas on South or West walls.'
      },
      {
        value: 'north-west',
        label: 'North-West',
        score: 8,
        rationale: 'Active zone encouraging pleasant social interactions.',
        remedy: 'Incorporate white and silver decor items.'
      },
      {
        value: 'west',
        label: 'West',
        score: 6.5,
        rationale: 'Comfortable evening family retreat.',
        remedy: 'Ensure bright warm lighting after sunset.'
      },
      {
        value: 'south-west',
        label: 'South-West',
        score: 4,
        rationale: 'Overly heavy for lively social gathering, causing early guest departure.',
        remedy: 'Add lively indoor plants and dynamic art.'
      }
    ]
  },
  {
    id: 'shape',
    category: 'Geometry & Proportion',
    title: 'Apartment Layout Geometry',
    description: 'What is the overall floor plan contour of the residence?',
    options: [
      {
        value: 'square',
        label: 'Square (1:1 aspect ratio)',
        score: 10,
        rationale: 'The divine archetype of Sthapatya Veda. Perfect distribution of magnetic and solar currents.',
        remedy: 'No remedy needed; optimal balance.'
      },
      {
        value: 'rectangle',
        label: 'Proportionate Rectangle (Up to 1:2 ratio)',
        score: 9.5,
        rationale: 'Highly auspicious, ensuring smooth progression of wealth and physical wellbeing.',
        remedy: 'Ensure center space remains open.'
      },
      {
        value: 'l-shape',
        label: 'L-Shaped with an extended wing',
        score: 5.5,
        rationale: 'One quadrant is naturally missing or recessed, causing localized energetic deficiency.',
        remedy: 'Use mirrors on the recessed corner wall to virtually complete the missing square.'
      },
      {
        value: 'irregular',
        label: 'Irregular / Cut corners / Triangular angles',
        score: 3.5,
        rationale: 'Angular cuts create energetic turbulence and scattered focus.',
        remedy: 'Place copper or zinc boundary strips along cut corners to re-establish energetic closure.'
      }
    ]
  },
  {
    id: 'sunlight',
    category: 'Solar Inflow & Ventilation',
    title: 'Natural Light & Cross-Ventilation',
    description: 'How does natural daylight enter the primary living areas?',
    options: [
      {
        value: 'east_north',
        label: 'Abundant morning light from East & North',
        score: 10,
        rationale: 'Infuses pure ultraviolet cleansing rays, elevating mood and natural circadian rhythms.',
        remedy: 'Keep sheer curtains during morning hours.'
      },
      {
        value: 'balanced',
        label: 'Balanced cross-ventilation from multiple sides',
        score: 9,
        rationale: 'Continuous prana exchange prevents energetic stagnation.',
        remedy: 'Maintain open windows during dawn and dusk.'
      },
      {
        value: 'west_only',
        label: 'Western exposure (strong afternoon sun)',
        score: 6.5,
        rationale: 'High infra-red thermal load during peak Mumbai summers.',
        remedy: 'Use double-glazed windows and thermal blackout drapes.'
      },
      {
        value: 'shaft_only',
        label: 'Primarily duct shafts with restricted natural light',
        score: 3,
        rationale: 'Stagnant energy accumulates in dimly lit interiors.',
        remedy: 'Install full-spectrum daylight LED illumination (5000K-6500K) and Himalayan salt lamps.'
      }
    ]
  }
];
