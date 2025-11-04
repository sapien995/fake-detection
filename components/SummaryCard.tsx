
import React from 'react';
import type { AnalysisResult } from '../types';

interface SummaryCardProps {
  summary: string;
  keyNarratives: AnalysisResult['keyNarratives'];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, keyNarratives }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-brand-accent mb-4">Executive Summary</h3>
      <p className="text-brand-text-secondary mb-6">{summary}</p>
      
      <h4 className="text-xl font-semibold text-brand-text mb-4">Key Narratives Identified</h4>
      <div className="space-y-4">
        {keyNarratives.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1 text-brand-text-secondary text-sm">
              <span className="font-medium text-brand-text">{item.narrative}</span>
              <span className="font-bold text-brand-accent">{item.volume.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-brand-primary rounded-full h-2.5">
              <div
                className="bg-brand-accent h-2.5 rounded-full"
                style={{ width: `${item.volume}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
