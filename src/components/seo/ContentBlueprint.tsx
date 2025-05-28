import React from 'react';
import { FileText, CheckCircle, Lightbulb, Users, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContentBlueprintProps {
  contentBlueprint: {
    keyword?: string;
    outline?: {
      title?: string;
      sections?: Array<{
        heading: string;
        subsections: string[];
      }>;
    };
    recommendations?: string[];
    competitor_insights?: {
      common_topics?: string[];
      content_length?: {
        average: number;
        min: number;
        max: number;
      };
      sentiment_trend?: string;
    };
  };
}

const parseRecommendations = (recommendations: string[]): any[] => {
  const parsed = [];
  let currentRec: any = null;

  for (const text of recommendations) {
    if (text.includes(':**') || text.match(/^\d+\./) || text.includes('Create a') || text.includes('Develop a') || text.includes('Produce a')) {
      if (currentRec) {
        parsed.push(currentRec);
      }

      const titleMatch = text.match(/^(.+?):\*\*/) || text.match(/^(.+?):/);
      currentRec = {
        title: titleMatch ? titleMatch[1].replace(/^\d+\.\s*/, '').trim() : text.substring(0, 100) + '...',
        description: text.replace(/^.+?:\*\*\s*/, '').replace(/^.+?:\s*/, ''),
        actions: [],
        examples: [],
        priority: 'High Impact',
        type: text.includes('Pillar Page') ? 'content' : text.includes('Template') ? 'resource' : text.includes('Video') ? 'media' : 'strategy'
      };
    } else if (currentRec) {
      if (text.includes('Action:') || text.includes('Implementation:') || text.includes('Rationale:')) {
        currentRec.actions.push(text.replace(/^(Action:|Implementation:|Rationale:)\s*/, ''));
      } else if (text.includes('Example') || text.includes('e.g.')) {
        const examples = text.match(/e\.g\.,?\s*([^.]+)/g);
        if (examples) {
          currentRec.examples.push(...examples.map((e: string) => e.replace(/e\.g\.,?\s*/, '')));
        }
      } else if (text.trim().length > 20) {
        currentRec.actions.push(text);
      }
    }
  }

  if (currentRec) {
    parsed.push(currentRec);
  }

  return parsed;
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'content': return <FileText className="h-5 w-5 text-blue-600" />;
    case 'resource': return <Star className="h-5 w-5 text-yellow-600" />;
    case 'media': return <Users className="h-5 w-5 text-purple-600" />;
    default: return <Lightbulb className="h-5 w-5 text-green-600" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high impact': return 'bg-red-100 text-red-700';
    case 'medium impact': return 'bg-yellow-100 text-yellow-700';
    case 'low impact': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const ContentBlueprint: React.FC<ContentBlueprintProps> = ({ contentBlueprint }) => {
  const recommendations = contentBlueprint?.recommendations || [];
  const parsedRecommendations = parseRecommendations(recommendations);
  const competitorInsights = contentBlueprint?.competitor_insights;

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Blueprint
          </CardTitle>
          <CardDescription>No content blueprint available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Content Strategy Blueprint
          </CardTitle>
          <CardDescription>
            AI-powered content recommendations for "{contentBlueprint.keyword || 'your topic'}"
          </CardDescription>
        </CardHeader>
        {competitorInsights && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {competitorInsights.content_length?.average || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Word Count</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {competitorInsights.common_topics?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Common Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {competitorInsights.sentiment_trend || 'Neutral'}
                </div>
                <div className="text-sm text-gray-600">Market Sentiment</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parsedRecommendations.map((rec, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getTypeIcon(rec.type)}
                  <div>
                    <CardTitle className="text-lg text-blue-700 leading-tight">
                      {rec.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{rec.type}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-4 leading-relaxed">{rec.description}</p>

              {rec.actions && rec.actions.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Action Steps:
                  </h4>
                  <ul className="space-y-2">
                    {rec.actions.slice(0, 3).map((action: string, actionIndex: number) => (
                      <li key={actionIndex} className="flex items-start gap-3">
                        <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                          {actionIndex + 1}
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                  {rec.actions.length > 3 && (
                    <Button variant="ghost" size="sm" className="mt-2 text-xs">
                      Show {rec.actions.length - 3} more steps
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              )}

              {rec.examples && rec.examples.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    Examples:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.examples.slice(0, 3).map((example: string, exampleIndex: number) => (
                      <span key={exampleIndex} className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Outline */}
      {contentBlueprint.outline && (
        <Card>
          <CardHeader>
            <CardTitle>Content Outline</CardTitle>
            <CardDescription>Suggested structure for your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {contentBlueprint.outline.title || 'Content Title'}
                </h3>
              </div>
              
              {contentBlueprint.outline.sections?.map((section, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{section.heading}</h4>
                  {section.subsections?.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {section.subsections.map((sub, subIndex) => (
                        <li key={subIndex}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
