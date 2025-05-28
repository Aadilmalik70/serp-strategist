import React, { useState } from 'react';
import { contentStrategyService } from '@/lib/api';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import our new modular components
import { SearchForm } from '@/components/seo/SearchForm';
import { KeywordAnalysis } from '@/components/seo/KeywordAnalysis';
import { ContentBlueprint } from '@/components/seo/ContentBlueprint';
import { SerpOptimization } from '@/components/seo/SerpOptimization';
import { PerformancePrediction } from '@/components/seo/PerformancePrediction';
import { ExportIntegration } from '@/components/seo/ExportIntegration';
import { NavigationTabs, QuickStats } from '@/components/seo/Navigation';
import { AppHeader, AppFooter, ErrorBoundary, LoadingState, ErrorAlert } from '@/components/seo/Layout';

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
    setResults(null);

    try {
      const data = await contentStrategyService.processInput(input, domain);
      console.log('Received data:', data);
      setResults(data);
      // Auto-switch to first tab with data
      if (data.content_blueprint?.recommendations?.length > 0) {
        setActiveTab("blueprint");
      } else if (data.keyword_data?.keyword_metrics?.length > 0) {
        setActiveTab("keywords");
      }
    } catch (err: any) {
      console.error("Error processing input:", err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (contentType: string, formatId: string, contentData: any) => {
    try {
      const result = await contentStrategyService.exportContent(contentType, formatId, contentData);
      
      if (result.success && result.file_path) {
        // In a real app, this would trigger a download
        alert(`Content exported successfully! File: ${result.file_path}`);
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
  const getExportData = () => ({
    export_formats: results?.export_formats || [],
    cms_platforms: results?.cms_platforms || []
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <AppHeader />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Search Form */}
          <SearchForm
            input={input}
            domain={domain}
            loading={loading}
            onInputChange={setInput}
            onDomainChange={setDomain}
            onSubmit={handleSubmit}
          />

          {/* Error Alert */}
          {error && (
            <ErrorAlert 
              error={error} 
              onDismiss={() => setError(null)} 
            />
          )}

          {/* Loading State */}
          {loading && (
            <LoadingState message="Analyzing your SEO strategy and gathering intelligence..." />
          )}

          {/* Results Section */}
          {results && !loading && (
            <div className="space-y-8">
              {/* Quick Stats Overview */}
              <QuickStats data={results} />

              {/* Navigation Tabs */}
              <NavigationTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                resultData={results}
              />

              {/* Tab Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="blueprint" className="mt-6">
                  <ContentBlueprint contentBlueprint={getContentBlueprint()} />
                </TabsContent>

                <TabsContent value="keywords" className="mt-6">
                  <KeywordAnalysis keywordData={getKeywordData()} />
                </TabsContent>

                <TabsContent value="optimization" className="mt-6">
                  <SerpOptimization optimizationData={getOptimizationRecommendations()} />
                </TabsContent>

                <TabsContent value="prediction" className="mt-6">
                  <PerformancePrediction predictionData={getPerformancePrediction()} />
                </TabsContent>

                <TabsContent value="export" className="mt-6">
                  <ExportIntegration
                    exportData={getExportData()}
                    onExport={handleExport}
                    onPublish={handlePublish}
                    contentData={results}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Empty State */}
          {!results && !loading && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Dominate Search Results?
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter your topic or keyword above to generate a comprehensive SEO content strategy 
                  powered by advanced AI and real-time SERP data.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI-powered content recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time keyword analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>SERP feature optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Performance predictions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </main>

        <AppFooter />
      </div>
    </ErrorBoundary>
  );
}

export default App;
