import { vastuQuestions } from '../data/vastuData';
import { VastuQuestion, VastuItemOption } from '../types';

export interface VastuEvaluationResult {
  score: number; // 0 - 100
  rating: string;
  badgeColor: string;
  summary: string;
  itemBreakdown: Array<{
    question: VastuQuestion;
    selectedOption: VastuItemOption;
    scorePercent: number;
    status: 'optimal' | 'moderate' | 'concerning';
  }>;
  elementBalance: {
    water: number; // North-East
    fire: number; // South-East
    earth: number; // South-West
    air: number; // North-West
    space: number; // Center & proportion
  };
  recommendations: string[];
}

export function evaluateVastu(answers: Record<string, string>): VastuEvaluationResult {
  let totalAchieved = 0;
  let maxPossible = 0;

  const itemBreakdown: VastuEvaluationResult['itemBreakdown'] = [];
  const recommendations: string[] = [];

  vastuQuestions.forEach(q => {
    maxPossible += 10;
    const selectedVal = answers[q.id];
    const option = q.options.find(o => o.value === selectedVal) || q.options[0];

    const score = option.score;
    totalAchieved += score;

    let status: 'optimal' | 'moderate' | 'concerning' = 'optimal';
    if (score < 5) status = 'concerning';
    else if (score < 8) status = 'moderate';

    itemBreakdown.push({
      question: q,
      selectedOption: option,
      scorePercent: Math.round((score / 10) * 100),
      status
    });

    if (option.remedy && score < 8) {
      recommendations.push(`${q.title}: ${option.remedy}`);
    }
  });

  const finalScore = Math.min(100, Math.max(0, Math.round((totalAchieved / maxPossible) * 100)));

  let rating = '';
  let badgeColor = '';
  let summary = '';

  if (finalScore >= 85) {
    rating = 'Param Shubh – Superior Harmonic Alignment';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    summary = 'This residence demonstrates exceptional adherence to classical directional Vastu Shastra principles. Prana and solar energy flow naturally, supporting financial prosperity, mental peace, and family vitality.';
  } else if (finalScore >= 70) {
    rating = 'Shubh – Favourable Architectural Alignment';
    badgeColor = 'bg-teal-100 text-teal-800 border-teal-300';
    summary = 'The property exhibits strong elemental balance with only minor localized misalignments that can easily be harmonized through non-invasive color accents, lighting, and interior orientation.';
  } else if (finalScore >= 50) {
    rating = 'Madhyam – Moderate Energy Balance';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    summary = 'Several functional zones conflict with primary directional elements. We recommend incorporating traditional Vedic corrective measures such as zinc/brass thresholds, strategic mirror placement, and specific color themes.';
  } else {
    rating = 'Dosha Prone – Substantial Remediation Recommended';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    summary = 'Significant elemental tensions detected between Fire, Water, and Disposal zones. Prior to commitment, consider reviewing layout remedies or exploring alternative residences in our verified Vastu-compliant portfolio.';
  }

  // Calculate Element Balance
  const entrance = answers['entrance'] || 'north-east';
  const kitchen = answers['kitchen'] || 'south-east';
  const master = answers['master_bedroom'] || 'south-west';
  const toilet = answers['toilet'] || 'north-west';
  const shape = answers['shape'] || 'square';

  const elementBalance = {
    water: entrance.includes('north') || entrance.includes('east') ? 92 : 60,
    fire: kitchen === 'south-east' ? 95 : kitchen === 'north-west' ? 80 : 50,
    earth: master === 'south-west' ? 95 : master === 'south' ? 82 : 55,
    air: toilet === 'north-west' ? 90 : 65,
    space: shape === 'square' ? 96 : shape === 'rectangle' ? 90 : 60
  };

  return {
    score: finalScore,
    rating,
    badgeColor,
    summary,
    itemBreakdown,
    elementBalance,
    recommendations
  };
}
