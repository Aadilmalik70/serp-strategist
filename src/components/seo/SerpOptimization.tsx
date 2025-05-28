import React from 'react';
import { Award, Star, AlertCircle, CheckCircle, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SerpFeature {
  feature: string;
  opportunity: string;
  recommendations: string[];
  status?: string;
}

interface SerpOptimizationProps {
  optimizationData: {
    keyword?: string;
    recommendations?: SerpFeature[];
    serp_features?: Array<{
      name: string;
      presence: string;
      data?: any;
    }>;
  };
}

const getOpportunityColor = (opportunity: string) => {
  switch (opportunity.toLowerCase()) {
    case 'high': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getFeatureIcon = (feature: string) => {
  const featureName = feature.toLowerCase().replace(/_/g, ' ');
  
  if (featureName.includes('snippet')) return <Star className="h-5 w-5 text-yellow-600" />;
  if (featureName.includes('people') || featureName.includes('ask')) return <Target className="h-5 w-5 text-blue-600" />;
  if (featureName.includes('image')) return <Award className="h-5 w-5 text-purple-600" />;
  if (featureName.includes('video')) return <TrendingUp className="h-5 w-5 text-red-600" />;
  if (featureName.includes('local')) return <CheckCircle className="h-5 w-5 text-green-600" />;
  
  return <AlertCircle className="h-5 w-5 text-gray-600" />;
};

const formatFeatureName = (feature: string) => {
  return feature
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const getPresenceColor = (presence: string) => {
  switch (presence.toLowerCase()) {
    case 'strong': return 'bg-green-100 text-green-800';
    case 'present': return 'bg-blue-100 text-blue-800';
    case 'weak': return 'bg-yellow-100 text-yellow-800';
    case 'none': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const SerpOptimization: React.FC<SerpOptimizationProps> = ({ optimizationData }) => {
  const recommendations = optimizationData?.recommendations || [];
  const serpFeatures = optimizationData?.serp_features || [];

  if (recommendations.length === 0 && serpFeatures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            SERP Feature Optimization
          </CardTitle>
          <CardDescription>No optimization data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SERP Features Overview */}
      {serpFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current SERP Landscape</CardTitle>
            <CardDescription>
              Analysis of SERP features present for your target keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serpFeatures.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getFeatureIcon(feature.name)}
                      <h4 className="font-medium">{formatFeatureName(feature.name)}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPresenceColor(feature.presence)}`}>
                      {feature.presence}
                    </span>
                  </div>
                  {feature.data && (
                    <div className="text-sm text-gray-600">
                      {feature.data.count && <p>Count: {feature.data.count}</p>}
                      {feature.data.description && <p className="mt-1">{feature.data.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Recommendations */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFeatureIcon(item.feature)}
                    <CardTitle className="text-lg capitalize">
                      {formatFeatureName(item.feature)}
                    </CardTitle>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOpportunityColor(item.opportunity)}`}>
                    {item.opportunity} opportunity
                  </span>
                </div>
                {item.status && (
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    Status: {item.status}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Optimization Strategies:
                  </h4>
                  <ul className="space-y-2">
                    {(item.recommendations || []).map((rec: string, recIndex: number) => (
                      <li key={recIndex} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mt-0.5 flex-shrink-0">
                          {recIndex + 1}
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Wins Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Quick Wins
          </CardTitle>
          <CardDescription>
            Immediate optimization opportunities for better SERP visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Featured Snippet</h4>
              <p className="text-sm text-green-800 mb-2">
                Structure your content to answer questions directly
              </p>
              <ul className="text-xs text-green-700 list-disc list-inside space-y-1">
                <li>Use clear H2 headings for questions</li>
                <li>Provide concise 40-60 word answers</li>
                <li>Include relevant lists and tables</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">People Also Ask</h4>
              <p className="text-sm text-blue-800 mb-2">
                Create FAQ sections addressing related questions
              </p>
              <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                <li>Research related questions</li>
                <li>Create comprehensive FAQ sections</li>
                <li>Use schema markup for Q&A</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Image Pack</h4>
              <p className="text-sm text-purple-800 mb-2">
                Optimize images for better visibility
              </p>
              <ul className="text-xs text-purple-700 list-disc list-inside space-y-1">
                <li>Use descriptive file names</li>
                <li>Add comprehensive alt text</li>
                <li>Implement image schema markup</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Video Results</h4>
              <p className="text-sm text-yellow-800 mb-2">
                Create video content for enhanced visibility
              </p>
              <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
                <li>Create relevant video content</li>
                <li>Optimize titles and descriptions</li>
                <li>Add video schema markup</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
