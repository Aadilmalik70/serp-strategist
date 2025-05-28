import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AppHeaderProps {
  onDocumentationClick?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onDocumentationClick }) => (
  <header className="bg-white dark:bg-gray-950 shadow-sm border-b">
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-8 w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SERP Strategist
            </h1>
            <p className="text-sm text-gray-600">AI-Powered SEO Content Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onDocumentationClick}>
            Documentation
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>API Online</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export const AppFooter: React.FC = () => (
  <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-16">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">SERP Strategist</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Advanced SEO content intelligence platform powered by AI. 
            Generate data-driven content strategies that dominate search results.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
            <li><a href="#" className="hover:text-gray-900">API Reference</a></li>
            <li><a href="#" className="hover:text-gray-900">Case Studies</a></li>
            <li><a href="#" className="hover:text-gray-900">Best Practices</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
            <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-gray-900">GDPR Compliance</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600">
          © 2024 SERP Strategist. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-sm text-gray-600">Powered by Advanced AI</span>
        </div>
      </div>
    </div>
  </footer>
);

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
              <CardDescription>
                An unexpected error occurred while loading the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-mono">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Reload Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = "Analyzing your SEO strategy..." 
}) => (
  <div className="flex flex-col items-center justify-center py-16 space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
    </div>
    <div className="text-center">
      <p className="text-lg font-medium text-gray-900">{message}</p>
      <p className="text-sm text-gray-600 mt-1">This may take a few moments...</p>
    </div>
    <div className="flex space-x-1 mt-4">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

export const ErrorAlert: React.FC<{ error: string; onDismiss?: () => void }> = ({ 
  error, 
  onDismiss 
}) => (
  <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-red-900 mb-1">Analysis Error</h4>
        <p className="text-sm text-red-800 leading-relaxed">{error}</p>
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss} className="text-red-600 hover:text-red-900">
          ×
        </Button>
      )}
    </div>
  </div>
);
