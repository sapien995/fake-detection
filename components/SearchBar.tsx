
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(topic);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="topic-search" className="block text-lg font-medium text-brand-text-secondary mb-2">
        Analyze Topic or Hashtag
      </label>
      <div className="relative">
        <input
          id="topic-search"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., #KenyaEconomicForum, 'Nairobi water shortage'..."
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 bg-brand-secondary border-2 border-transparent focus:border-brand-accent focus:ring-0 rounded-lg text-brand-text placeholder-gray-500 transition-colors duration-200 ease-in-out disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !topic}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4 bg-brand-accent text-brand-primary rounded-r-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-secondary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <SearchIcon className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
