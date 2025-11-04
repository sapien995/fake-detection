
import React from 'react';
import type { AnalysisResult } from '../types';
import SummaryCard from './SummaryCard';
import PlatformBreakdown from './PlatformBreakdown';
import NetworkGraph from './NetworkGraph';
import { LoaderIcon } from './icons/LoaderIcon';

interface AnalysisDashboardProps {
  data: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-secondary rounded-lg">
        <LoaderIcon className="w-16 h-16 animate-spin text-brand-accent" />
        <p className="mt-4 text-lg font-semibold text-brand-text">Analyzing Narrative Vectors...</p>
        <p className="text-brand-text-secondary">AI is processing data from multiple sources.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <h3 className="text-xl font-bold text-red-400">Analysis Failed</h3>
        <p className="mt-2 text-red-300">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 bg-brand-secondary rounded-lg border-2 border-dashed border-gray-600">
        <h3 className="text-xl font-bold text-brand-text">Awaiting Intelligence Task</h3>
        <p className="mt-2 text-brand-text-secondary">Enter a topic or hashtag above to begin the disinformation analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SummaryCard summary={data.summary} keyNarratives={data.keyNarratives} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <NetworkGraph data={data.networkData} />
        </div>
        <PlatformBreakdown 
            breakdown={data.platformBreakdown}
            sentiment={data.sentiment}
        />
      </div>
    </div>
  );
};

export default AnalysisDashboard;
