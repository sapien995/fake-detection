
export interface Node {
  id: string;
  group: 'Influencer' | 'Bot' | 'Media' | 'Citizen';
  influenceScore: number;
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: Node[];
  links: Link[];
}

export interface AnalysisResult {
  summary: string;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keyNarratives: {
    narrative: string;
    volume: number;
  }[];
  platformBreakdown: {
    twitter: number;
    facebook: number;
    tiktok: number;
  };
  networkData: NetworkData;
}
