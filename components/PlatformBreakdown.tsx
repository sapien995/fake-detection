import React from 'react';
import type { AnalysisResult } from '../types';

interface PlatformBreakdownProps {
    breakdown: AnalysisResult['platformBreakdown'];
    sentiment: AnalysisResult['sentiment'];
}

const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({ breakdown, sentiment }) => {
  const platforms = [
    { name: 'Twitter/X', value: breakdown.twitter, color: 'bg-sky-400' },
    { name: 'Facebook', value: breakdown.facebook, color: 'bg-blue-600' },
    { name: 'TikTok', value: breakdown.tiktok, color: 'bg-pink-500' },
  ];

  const sentiments = [
    { name: 'Positive', value: sentiment.positive, color: 'bg-green-500' },
    { name: 'Negative', value: sentiment.negative, color: 'bg-red-500' },
    { name: 'Neutral', value: sentiment.neutral, color: 'bg-gray-500' },
  ];

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg space-y-8">
      <div>
        <h3 className="text-xl font-bold text-brand-accent mb-4">Platform Activity</h3>
        <div className="space-y-3">
          {platforms.map(p => (
            <div key={p.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-brand-text">{p.name}</span>
                <span className="text-brand-text-secondary">{p.value.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-brand-primary rounded-full h-2.5">
                <div className={`${p.color} h-2.5 rounded-full`} style={{ width: `${p.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-brand-accent mb-4">Overall Sentiment</h3>
        <div className="space-y-3">
          {sentiments.map(s => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-brand-text">{s.name}</span>
                <span className="text-brand-text-secondary">{s.value.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-brand-primary rounded-full h-2.5">
                <div className={`${s.color} h-2.5 rounded-full`} style={{ width: `${s.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformBreakdown;