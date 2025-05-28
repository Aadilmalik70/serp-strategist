import React from 'react';
import { BarChart2, TrendingUp, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KeywordMetric {
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

interface KeywordDataProps {
  keywordData: {
    keyword_metrics?: KeywordMetric[];
    related_keywords?: KeywordMetric[];
    trend_analysis?: Record<string, any>;
  };
}

const DifficultyBadge: React.FC<{ value: number }> = ({ value }) => {
  const getColor = (difficulty: number) => {
    if (difficulty <= 30) return 'bg-green-100 text-green-800';
    if (difficulty <= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLabel = (difficulty: number) => {
    if (difficulty <= 30) return 'Easy';
    if (difficulty <= 60) return 'Medium';
    return 'Hard';
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor(value)}`}>
      {getLabel(value)}
    </span>
  );
};

const TrendIcon: React.FC<{ direction: string }> = ({ direction }) => {
  if (direction === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (direction === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
  return <div className="h-4 w-4 rounded-full bg-gray-400" />;
};

export const KeywordAnalysis: React.FC<KeywordDataProps> = ({ keywordData }) => {
  const keywords = keywordData?.keyword_metrics || [];
  const relatedKeywords = keywordData?.related_keywords || [];

  if (keywords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Keyword Analysis
          </CardTitle>
          <CardDescription>No keyword data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Keywords</p>
                <p className="text-2xl font-bold">{keywords.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Search Volume</p>
                <p className="text-2xl font-bold">
                  {Math.round(keywords.reduce((sum, k) => sum + (k.search_volume || 0), 0) / keywords.length).toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Difficulty</p>
                <p className="text-2xl font-bold">
                  {Math.round(keywords.reduce((sum, k) => sum + (k.keyword_difficulty || 0), 0) / keywords.length)}
                </p>
              </div>
              <BarChart2 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Opportunity</p>
                <p className="text-2xl font-bold">
                  {keywords.filter(k => (k.opportunity || 0) > 70).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Keywords</CardTitle>
          <CardDescription>Detailed analysis of your target keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium">Keyword</th>
                  <th className="text-left py-3 px-4 font-medium">Search Volume</th>
                  <th className="text-left py-3 px-4 font-medium">Difficulty</th>
                  <th className="text-left py-3 px-4 font-medium">Opportunity</th>
                  <th className="text-left py-3 px-4 font-medium">CPC</th>
                  <th className="text-left py-3 px-4 font-medium">Trend</th>
                  <th className="text-left py-3 px-4 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{keyword.keyword}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {keyword.search_volume?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${keyword.keyword_difficulty || 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{keyword.keyword_difficulty || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${keyword.opportunity || 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{keyword.opportunity || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">${keyword.cpc?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-4">
                      <TrendIcon direction={keyword.trend_direction || 'stable'} />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        keyword.data_source === 'serpapi' 
                          ? 'bg-green-100 text-green-700' 
                          : keyword.is_enhanced 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-orange-100 text-orange-700'
                      }`}>
                        {keyword.data_source === 'serpapi' 
                          ? '✓ SerpAPI' 
                          : keyword.is_enhanced 
                            ? '⚡ Enhanced' 
                            : '⚠ Basic'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Related Keywords */}
      {relatedKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Keywords</CardTitle>
            <CardDescription>Additional keyword opportunities to consider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedKeywords.slice(0, 9).map((keyword, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{keyword.keyword}</h4>
                    <DifficultyBadge value={keyword.keyword_difficulty || 0} />
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Volume:</span>
                      <span>{keyword.search_volume?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opportunity:</span>
                      <span>{keyword.opportunity || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
