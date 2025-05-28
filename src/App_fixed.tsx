import React, { useState } from 'react';
import { contentStrategyService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search, FileText, BarChart2, Award, Download, Globe, Zap, AlertCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
              <CardDescription>
                An error occurred while rendering the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [input, setInput] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("blueprint");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await contentStrategyService.processInput(input, domain);
      console.log('Received data:', data); // Debug log
      setResults(data);
    } catch (err: any) {
      console.error("Error processing input:", err);
      setError(err.response?.data?.error || err.message || "An error occurred while processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (contentType: string, formatId: string, contentData: any) => {
    try {
      const result = await contentStrategyService.exportContent(contentType, formatId, contentData);
      
      if (result.success && result.file_path) {
        alert(`Content exported successfully! File would be downloaded in a real deployment.`);
      } else {
        alert(`Export failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Error exporting content:", err);
      alert("Failed to export content. Please try again.");
    }
  };

  const handlePublish = async (contentType: string, platformId: string, contentData: any) => {
    const mockCredentials = {
      username: "demo_user",
      password: "demo_password",
      api_key: "demo_api_key",
      site_url: "https://example.com"
    };
    
    try {
      const result = await contentStrategyService.publishToCms(
        contentType, 
        platformId, 
        contentData, 
        mockCredentials
      );
      
      if (result.success) {
        alert(`Content published successfully to ${platformId}!`);
      } else {
        alert(`Publishing failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Error publishing content:", err);
      alert("Failed to publish content. Please try again.");
    }
  };

  // Safe accessor functions
  const getContentBlueprint = () => results?.content_blueprint || {};
  const getKeywordData = () => results?.keyword_data || {};
  const getOptimizationRecommendations = () => results?.optimization_recommendations || {};
  const getPerformancePrediction = () => results?.performance_prediction || {};
  const getExportFormats = () => results?.export_formats || [];
  const getCmsPlatforms = () => results?.cms_platforms || [];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-950 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Content Strategist
                </h1>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Your Content Strategy</CardTitle>
              <CardDescription>
                Enter a topic, keyword, or content idea to get AI-powered content strategy recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="input" className="block text-sm font-medium mb-1">
                    Topic or Keyword
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="input"
                      placeholder="e.g., AI content strategy for SERP dominance"
                      className="pl-10"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium mb-1">
                    Domain (optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="domain"
                      placeholder="e.g., yourdomain.com"
                      className="pl-10"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="w-full sm:w-auto"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Generate Content Strategy"}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="xl" text="Analyzing content strategy opportunities..." />
            </div>
          )}

          {results && !loading && (
            <div className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                  <TabsTrigger value="blueprint" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden md:inline">Content Blueprint</span>
                    <span className="md:hidden">Blueprint</span>
                  </TabsTrigger>
                  <TabsTrigger value="keywords" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span className="hidden md:inline">Keyword Analysis</span>
                    <span className="md:hidden">Keywords</span>
                  </TabsTrigger>
                  <TabsTrigger value="optimization" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="hidden md:inline">SERP Optimization</span>
                    <span className="md:hidden">SERP</span>
                  </TabsTrigger>
                  <TabsTrigger value="prediction" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    <span className="hidden md:inline">Performance Prediction</span>
                    <span className="md:hidden">Prediction</span>
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden md:inline">Export & Integration</span>
                    <span className="md:hidden">Export</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="blueprint" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {getContentBlueprint().outline?.title || `Content Strategy for: ${getContentBlueprint().keyword || input}`}
                      </CardTitle>
                      <CardDescription>
                        AI-powered content recommendations and strategy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getContentBlueprint().recommendations && getContentBlueprint().recommendations.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Recommendations</h3>
                          <div className="space-y-3">
                            {getContentBlueprint().recommendations.map((rec: string, index: number) => (
                              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No content blueprint available</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => handleExport('content_blueprint', 'pdf', getContentBlueprint())}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Blueprint
                      </Button>
                      <Button variant="default">
                        Generate Full Content
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="keywords" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Keyword Analysis</CardTitle>
                      <CardDescription>
                        Detailed analysis of keywords with metrics and trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getKeywordData().keyword_metrics && getKeywordData().keyword_metrics.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4">Keyword</th>
                                <th className="text-left py-3 px-4">Search Volume</th>
                                <th className="text-left py-3 px-4">Difficulty</th>
                                <th className="text-left py-3 px-4">Opportunity</th>
                                <th className="text-left py-3 px-4">CPC</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getKeywordData().keyword_metrics.map((keyword: any, index: number) => (
                                <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <td className="py-3 px-4 font-medium">{keyword.keyword}</td>
                                  <td className="py-3 px-4">{keyword.search_volume?.toLocaleString() || "N/A"}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                          className="bg-blue-600 h-2 rounded-full"
                                          style={{ width: `${keyword.difficulty || 0}%` }}
                                        ></div>
                                      </div>
                                      <span>{keyword.difficulty || 0}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                          className="bg-green-600 h-2 rounded-full"
                                          style={{ width: `${keyword.opportunity || 0}%` }}
                                        ></div>
                                      </div>
                                      <span>{keyword.opportunity || 0}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">${keyword.cpc?.toFixed(2) || "0.00"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No keyword data available</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('keyword_data', 'csv', getKeywordData())}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Keyword Data
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="optimization" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SERP Feature Optimization</CardTitle>
                      <CardDescription>
                        Strategies to optimize for different SERP features
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getOptimizationRecommendations().recommendations && getOptimizationRecommendations().recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {getOptimizationRecommendations().recommendations.map((item: any, index: number) => (
                            <Card key={index} variant="outline">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg capitalize">{item.feature?.replace(/_/g, " ") || `Feature ${index + 1}`}</CardTitle>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      item.opportunity === "high"
                                        ? "bg-green-100 text-green-800"
                                        : item.opportunity === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {item.opportunity || "low"} opportunity
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {(item.recommendations || []).map((rec: string, recIndex: number) => (
                                    <li key={recIndex} className="flex items-start">
                                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs mr-2 mt-0.5">
                                        {recIndex + 1}
                                      </span>
                                      <span className="text-sm">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No optimization recommendations available</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        onClick={() => handleExport('optimization_recommendations', 'pdf', getOptimizationRecommendations())}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Recommendations
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="prediction" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Performance Prediction</CardTitle>
                      <CardDescription>
                        AI-based prediction of how your content will perform in search results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {getPerformancePrediction().estimated_serp_position ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card variant="gradient">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Estimated SERP Position</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-4xl font-bold">{getPerformancePrediction().estimated_serp_position}</div>
                                <p className="text-sm text-blue-700 mt-1">
                                  {Math.round((getPerformancePrediction().ranking_probability || 0) * 100)}% probability
                                </p>
                              </CardContent>
                            </Card>
                            <Card variant="gradient">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Estimated Monthly Traffic</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-4xl font-bold">{getPerformancePrediction().estimated_traffic}</div>
                                <p className="text-sm text-blue-700 mt-1">
                                  {((getPerformancePrediction().estimated_ctr || 0) * 100).toFixed(1)}% click-through rate
                                </p>
                              </CardContent>
                            </Card>
                            <Card variant="gradient">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Confidence Score</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-4xl font-bold">{getPerformancePrediction().confidence_score}%</div>
                                <p className="text-sm text-blue-700 mt-1">
                                  Based on {(getPerformancePrediction().ranking_factors || []).length} ranking factors
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          {getPerformancePrediction().ranking_factors && getPerformancePrediction().ranking_factors.length > 0 && (
                            <>
                              <h3 className="text-lg font-medium mb-4">Ranking Factors</h3>
                              <div className="space-y-4 mb-8">
                                {getPerformancePrediction().ranking_factors.map((factor: any, index: number) => (
                                  <div key={index} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <h4 className="font-medium">{factor.factor_name}</h4>
                                      <span className="text-sm font-medium">
                                        {Math.round((factor.score || 0) * 100)}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(factor.score || 0) * 100}%` }}
                                      ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                      {factor.description}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                      {factor.details}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {getPerformancePrediction().improvement_suggestions && getPerformancePrediction().improvement_suggestions.length > 0 && (
                            <>
                              <h3 className="text-lg font-medium mb-4">Improvement Suggestions</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getPerformancePrediction().improvement_suggestions.map((suggestion: any, index: number) => (
                                  <Card key={index} variant="outline">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-md">{suggestion.area}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                      <p className="mb-2 text-sm">{suggestion.suggestion}</p>
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center">
                                          <span className="font-medium mr-1">Impact:</span>
                                          <span
                                            className={`${
                                              suggestion.impact === "High"
                                                ? "text-green-600"
                                                : suggestion.impact === "Medium"
                                                ? "text-yellow-600"
                                                : "text-gray-600"
                                            }`}
                                          >
                                            {suggestion.impact}
                                          </span>
                                        </span>
                                        <span className="flex items-center">
                                          <span className="font-medium mr-1">Effort:</span>
                                          <span
                                            className={`${
                                              suggestion.effort === "Low"
                                                ? "text-green-600"
                                                : suggestion.effort === "Medium"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                          >
                                            {suggestion.effort}
                                          </span>
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No performance prediction available</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        onClick={() => handleExport('performance_prediction', 'pdf', getPerformancePrediction())}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Performance Report
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="export" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Export & Integration</CardTitle>
                      <CardDescription>
                        Export your content strategy or integrate with CMS platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Export Formats</h3>
                          {getExportFormats().length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {getExportFormats().map((format: any, index: number) => (
                                <Card key={index} variant="interactive" className="flex flex-col h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-md">{format.name}</CardTitle>
                                    <CardDescription>{format.description}</CardDescription>
                                  </CardHeader>
                                  <CardFooter className="mt-auto pt-0">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => handleExport('content_blueprint', format.id, getContentBlueprint())}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Export as {format.extension}
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No export formats available</p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">CMS Integration</h3>
                          {getCmsPlatforms().length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {getCmsPlatforms().map((platform: any, index: number) => (
                                <Card key={index} variant="interactive" className="flex flex-col h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-md">{platform.name}</CardTitle>
                                    <CardDescription>{platform.description}</CardDescription>
                                  </CardHeader>
                                  <CardFooter className="mt-auto pt-0">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => handlePublish('content_blueprint', platform.id, getContentBlueprint())}
                                    >
                                      Connect to {platform.name}
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No CMS platforms available</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>

        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">AI Content Strategist for SERP Dominance</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Documentation
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;