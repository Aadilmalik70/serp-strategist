// SEO Components
export { SearchForm } from './SearchForm';
export { KeywordAnalysis } from './KeywordAnalysis';
export { ContentBlueprint } from './ContentBlueprint';
export { SerpOptimization } from './SerpOptimization';
export { PerformancePrediction } from './PerformancePrediction';
export { ExportIntegration } from './ExportIntegration';
export { NavigationTabs, QuickStats } from './Navigation';
export { 
  AppHeader, 
  AppFooter, 
  ErrorBoundary, 
  LoadingState, 
  ErrorAlert 
} from './Layout';

// Component Types
export interface KeywordMetric {
  keyword: string;
  search_volume: number;
  keyword_difficulty: number;
  opportunity: number;
  cpc: number;
  competition: number;
  trend_direction: string;
  data_source: string;
  is_enhanced: boolean;
}

export interface SerpFeature {
  feature: string;
  opportunity: string;
  recommendations: string[];
  status?: string;
}

export interface RankingFactor {
  factor_name: string;
  score: number;
  description: string;
  details: string;
}

export interface ImprovementSuggestion {
  area: string;
  suggestion: string;
  impact: string;
  effort: string;
}

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
}

export interface CmsPlatform {
  id: string;
  name: string;
  description: string;
  icon?: string;
}
