import React from 'react';
import { FileText, BarChart2, Award, TrendingUp, Download, Target, Eye, Activity } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  resultData?: any;
}

const getTabCount = (tabId: string, data: any) => {
  if (!data) return 0;
  
  switch (tabId) {
    case 'blueprint':
      return data.content_blueprint?.recommendations?.length || 0;
    case 'keywords':
      return data.keyword_data?.keyword_metrics?.length || 0;
    case 'optimization':
      return data.optimization_recommendations?.recommendations?.length || 0;
    case 'prediction':
      return data.performance_prediction?.ranking_factors?.length || 0;
    case 'export':
      return (data.export_formats?.length || 0) + (data.cms_platforms?.length || 0);
    default:
      return 0;
  }
};

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  resultData 
}) => {
  const tabs = [
    {
      id: 'blueprint',
      label: 'Content Strategy',
      shortLabel: 'Strategy',
      icon: FileText,
      description: 'AI-powered content recommendations',
      color: 'text-blue-600'
    },
    {
      id: 'keywords',
      label: 'Keyword Intelligence',
      shortLabel: 'Keywords',
      icon: Target,
      description: 'Detailed keyword analysis & metrics',
      color: 'text-green-600'
    },
    {
      id: 'optimization',
      label: 'SERP Optimization',
      shortLabel: 'SERP',
      icon: Award,
      description: 'Feature optimization strategies',
      color: 'text-purple-600'
    },
    {
      id: 'prediction',
      label: 'Performance Forecast',
      shortLabel: 'Forecast',
      icon: TrendingUp,
      description: 'AI ranking predictions',
      color: 'text-orange-600'
    },
    {
      id: 'export',
      label: 'Export & Integrate',
      shortLabel: 'Export',
      icon: Download,
      description: 'Export formats & CMS integration',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="mb-8">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-auto p-1 bg-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id, resultData);
              
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-2 p-4 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${tab.color}`} />
                    <span className="font-medium">{tab.label}</span>
                    {count > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 text-center leading-tight">
                    {tab.description}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full bg-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id, resultData);
              
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-2 h-auto text-xs data-[state=active]:bg-white"
                >
                  <div className="relative">
                    <Icon className={`h-4 w-4 ${tab.color}`} />
                    {count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center text-[10px]">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </div>
                  <span className="font-medium leading-tight">{tab.shortLabel}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Indicators */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = getTabCount(tab.id, resultData);
          const isActive = activeTab === tab.id;
          
          return (
            <div
              key={tab.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isActive 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                  {tab.shortLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QuickStats: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;

  const stats = [
    {
      label: 'Keywords Analyzed',
      value: data.keyword_data?.keyword_metrics?.length || 0,
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Content Ideas',
      value: data.content_blueprint?.recommendations?.length || 0,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      label: 'SERP Features',
      value: data.optimization_recommendations?.recommendations?.length || 0,
      icon: Award,
      color: 'text-purple-600'
    },
    {
      label: 'Predicted Position',
      value: data.performance_prediction?.estimated_serp_position || 'N/A',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm font-medium text-gray-600">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
