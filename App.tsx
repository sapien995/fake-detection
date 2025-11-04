
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AnalysisDashboard from './components/AnalysisDashboard';
import { getDisinformationAnalysis } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (topic: string) => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await getDisinformationAnalysis(topic);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        <div className="mt-8">
          <AnalysisDashboard
            data={analysisResult}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
