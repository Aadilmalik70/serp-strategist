import React from 'react';
import { Search, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SearchFormProps {
  input: string;
  domain: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  input,
  domain,
  loading,
  onInputChange,
  onDomainChange,
  onSubmit
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Generate Your SEO Content Strategy
        </CardTitle>
        <CardDescription>
          Enter a topic, keyword, or content idea to get AI-powered SEO strategy recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="input" className="block text-sm font-medium mb-1">
              Topic or Keyword *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="input"
                placeholder="e.g., AI content strategy, keyword research tools"
                className="pl-10"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
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
                onChange={(e) => onDomainChange(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={loading || !input.trim()}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Analyzing...</span>
            </>
          ) : (
            "Generate SEO Strategy"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
