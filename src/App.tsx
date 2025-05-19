import React, { useState } from 'react';
import { contentStrategyService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search, FileText, BarChart2, Award, Download, Globe, Zap } from 'lucide-react';

export default function App() {
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
      setResults(data);
    } catch (err: any) {
      console.error("Error processing input:", err);
      setError(err.response?.data?.error || "An error occurred while processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (contentType: string, formatId: string, contentData: any) => {
    try {
      const result = await contentStrategyService.exportContent(contentType, formatId, contentData);
      
      if (result.success && result.file_path) {
        // In a real app, we would handle the file download here
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
    // In a real app, we would collect credentials from the user
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

  return (
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
                    <CardTitle>{results.content_blueprint.title}</CardTitle>
                    <CardDescription>{results.content_blueprint.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {results.content_blueprint.sections.map((section: any, index: number) => (
                        <AccordionItem key={index} value={`section-${index}`}>
                          <AccordionTrigger className="text-lg font-medium">
                            {section.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="mb-4">{section.content}</div>
                            {section.subsections && section.subsections.length > 0 && (
                              <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                                {section.subsections.map((subsection: any, subIndex: number) => (
                                  <div key={subIndex}>
                                    <h4 className="text-md font-medium mb-1">{subsection.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {subsection.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => handleExport('content_blueprint', 'pdf', results.content_blueprint)}
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
                      Detailed analysis of keywords with enhanced metrics and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Keyword</th>
                            <th className="text-left py-3 px-4">Search Volume</th>
                            <th className="text-left py-3 px-4">Difficulty</th>
                            <th className="text-left py-3 px-4">Opportunity</th>
                            <th className="text-left py-3 px-4">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(results.keyword_data.keyword_scores).map(
                            ([keyword, scores]: [string, any], index: number) => (
                              <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="py-3 px-4 font-medium">{keyword}</td>
                                <td className="py-3 px-4">
                                  {results.keyword_data.enhanced_metrics[keyword]?.search_volume || "N/A"}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${scores.difficulty}%` }}
                                      ></div>
                                    </div>
                                    <span>{scores.difficulty}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${scores.opportunity}%` }}
                                      ></div>
                                    </div>
                                    <span>{scores.opportunity}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {results.keyword_data.trend_analysis[keyword]?.trend_direction === "up" ? "↑" : "↓"}{" "}
                                    {results.keyword_data.trend_analysis[keyword]?.trend_strength}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('keyword_data', 'csv', results.keyword_data)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(results.optimization_recommendations).map(
                        ([feature, data]: [string, any], index: number) => (
                          <Card key={index} variant="outline">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg capitalize">{feature.replace(/_/g, " ")}</CardTitle>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    data.opportunity === "high"
                                      ? "bg-green-100 text-green-800"
                                      : data.opportunity === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {data.opportunity} opportunity
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {data.recommendations.map((rec: string, recIndex: number) => (
                                  <li key={recIndex} className="flex items-start">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs mr-2 mt-0.5">
                                      {recIndex + 1}
                                    </span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      onClick={() => handleExport('optimization_recommendations', 'pdf', results.optimization_recommendations)}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card variant="gradient">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Estimated SERP Position</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold">{results.performance_prediction.estimated_serp_position}</div>
                          <p className="text-sm text-blue-700 mt-1">
                            {results.performance_prediction.ranking_probability * 100}% probability
                          </p>
                        </CardContent>
                      </Card>
                      <Card variant="gradient">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Estimated Monthly Traffic</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold">{results.performance_prediction.estimated_traffic}</div>
                          <p className="text-sm text-blue-700 mt-1">
                            {results.performance_prediction.estimated_ctr}% click-through rate
                          </p>
                        </CardContent>
                      </Card>
                      <Card variant="gradient">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Confidence Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold">{results.performance_prediction.confidence_score}%</div>
                          <p className="text-sm text-blue-700 mt-1">
                            Based on {results.performance_prediction.ranking_factors.length} ranking factors
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="text-lg font-medium mb-4">Ranking Factors</h3>
                    <div className="space-y-4 mb-8">
                      {results.performance_prediction.ranking_factors.map((factor: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{factor.factor_name}</h4>
                            <span className="text-sm font-medium">
                              {Math.round(factor.score * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${factor.score * 100}%` }}
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

                    <h3 className="text-lg font-medium mb-4">Improvement Suggestions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.performance_prediction.improvement_suggestions.map(
                        (suggestion: any, index: number) => (
                          <Card key={index} variant="outline">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-md">{suggestion.area}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="mb-2">{suggestion.suggestion}</p>
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
                        )
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      onClick={() => handleExport('performance_prediction', 'pdf', results.performance_prediction)}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {results.export_formats.map((format: any, index: number) => (
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
                                  onClick={() => handleExport('content_blueprint', format.id, results.content_blueprint)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Export as {format.extension}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">CMS Integration</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {results.cms_platforms.map((platform: any, index: number) => (
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
                                  onClick={() => handlePublish('content_blueprint', platform.id, results.content_blueprint)}
                                >
                                  Connect to {platform.name}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
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
  );
}
