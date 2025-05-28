import React from 'react';
import { BarChart2, TrendingUp, Target, Eye, Award, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RankingFactor {
  factor_name: string;
  score: number;
  description: string;
  details: string;
}

interface ImprovementSuggestion {
  area: string;
  suggestion: string;
  impact: string;
  effort: string;
}

interface PerformancePredictionProps {
  predictionData: {
    estimated_serp_position?: number;
    estimated_traffic?: number;
    estimated_ctr?: number;
    confidence_score?: number;
    ranking_probability?: number;
    ranking_factors?: RankingFactor[];
    improvement_suggestions?: ImprovementSuggestion[];
  };
}

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

const getEffortColor = (effort: string) => {
  switch (effort.toLowerCase()) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getConfidenceLevel = (score: number) => {
  if (score >= 90) return { level: 'Very High', color: 'text-green-600', bg: 'bg-green-100' };
  if (score >= 80) return { level: 'High', color: 'text-green-600', bg: 'bg-green-100' };
  if (score >= 70) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  if (score >= 60) return { level: 'Low', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { level: 'Very Low', color: 'text-red-600', bg: 'bg-red-100' };
};

const getPositionColor = (position: number) => {
  if (position <= 3) return 'text-green-600';
  if (position <= 10) return 'text-yellow-600';
  if (position <= 20) return 'text-orange-600';
  return 'text-red-600';
};

export const PerformancePrediction: React.FC<PerformancePredictionProps> = ({ predictionData }) => {
  const {
    estimated_serp_position,
    estimated_traffic,
    estimated_ctr,
    confidence_score,
    ranking_probability,
    ranking_factors = [],
    improvement_suggestions = []
  } = predictionData;

  if (!estimated_serp_position && !confidence_score) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Performance Prediction
          </CardTitle>
          <CardDescription>No performance prediction data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const confidenceLevel = getConfidenceLevel(confidence_score || 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Predicted SERP Position</p>
                <p className={`text-3xl font-bold ${getPositionColor(estimated_serp_position || 50)}`}>
                  #{estimated_serp_position || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((ranking_probability || 0) * 100)}% probability
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Traffic</p>
                <p className="text-3xl font-bold text-green-600">
                  {estimated_traffic?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((estimated_ctr || 0) * 100).toFixed(1)}% CTR
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence Score</p>
                <p className={`text-3xl font-bold ${confidenceLevel.color}`}>
                  {confidence_score || 0}%
                </p>
                <p className={`text-xs mt-1 px-2 py-1 rounded-full ${confidenceLevel.bg} ${confidenceLevel.color}`}>
                  {confidenceLevel.level}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ranking Factors</p>
                <p className="text-3xl font-bold text-orange-600">
                  {ranking_factors.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Analyzed signals
                </p>
              </div>
              <BarChart2 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Factors Analysis */}
      {ranking_factors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ranking Factors Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of factors affecting your potential ranking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ranking_factors.map((factor, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">{factor.factor_name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {Math.round((factor.score || 0) * 100)}%
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        factor.score >= 0.8 ? 'bg-green-500' :
                        factor.score >= 0.6 ? 'bg-yellow-500' :
                        factor.score >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${
                        factor.score >= 0.8 ? 'bg-green-500' :
                        factor.score >= 0.6 ? 'bg-yellow-500' :
                        factor.score >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(factor.score || 0) * 100}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{factor.description}</p>
                  <p className="text-xs text-gray-500">{factor.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      {improvement_suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Improvement Recommendations
            </CardTitle>
            <CardDescription>
              Actionable suggestions to improve your predicted ranking performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvement_suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{suggestion.area}</h4>
                    <div className="flex items-center gap-1">
                      {suggestion.impact === 'High' && <AlertTriangle className="h-4 w-4 text-green-600" />}
                      {suggestion.impact === 'Medium' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {suggestion.impact === 'Low' && <AlertTriangle className="h-4 w-4 text-gray-600" />}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{suggestion.suggestion}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-600">Impact:</span>
                      <span className={`font-medium ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-600">Effort:</span>
                      <span className={`font-medium ${getEffortColor(suggestion.effort)}`}>
                        {suggestion.effort}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>
            Overall assessment of your content's ranking potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {ranking_factors.filter(f => f.score >= 0.8).length}
              </div>
              <div className="text-sm text-gray-600">Strong Factors</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {ranking_factors.filter(f => f.score >= 0.6 && f.score < 0.8).length}
              </div>
              <div className="text-sm text-gray-600">Moderate Factors</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {ranking_factors.filter(f => f.score < 0.6).length}
              </div>
              <div className="text-sm text-gray-600">Needs Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
