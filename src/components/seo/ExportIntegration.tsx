import React from 'react';
import { Download, Globe, FileText, Database, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
}

interface CmsPlatform {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface ExportIntegrationProps {
  exportData: {
    export_formats?: ExportFormat[];
    cms_platforms?: CmsPlatform[];
  };
  onExport: (contentType: string, formatId: string, contentData: any) => void;
  onPublish: (contentType: string, platformId: string, contentData: any) => void;
  contentData: any;
}

const getFormatIcon = (extension: string) => {
  switch (extension.toLowerCase()) {
    case 'pdf': return <FileText className="h-6 w-6 text-red-600" />;
    case 'docx': return <FileText className="h-6 w-6 text-blue-600" />;
    case 'html': return <Globe className="h-6 w-6 text-orange-600" />;
    case 'md': return <FileText className="h-6 w-6 text-gray-600" />;
    case 'csv': return <Database className="h-6 w-6 text-green-600" />;
    case 'json': return <Database className="h-6 w-6 text-purple-600" />;
    default: return <Download className="h-6 w-6 text-gray-600" />;
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'wordpress': return <Globe className="h-6 w-6 text-blue-600" />;
    case 'webflow': return <Globe className="h-6 w-6 text-purple-600" />;
    case 'contentful': return <Database className="h-6 w-6 text-orange-600" />;
    case 'shopify': return <Share2 className="h-6 w-6 text-green-600" />;
    case 'hubspot': return <Share2 className="h-6 w-6 text-red-600" />;
    default: return <Globe className="h-6 w-6 text-gray-600" />;
  }
};

export const ExportIntegration: React.FC<ExportIntegrationProps> = ({
  exportData,
  onExport,
  onPublish,
  contentData
}) => {
  const exportFormats = exportData?.export_formats || [];
  const cmsPlatforms = exportData?.cms_platforms || [];

  return (
    <div className="space-y-8">
      {/* Export Formats Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Your Strategy</h3>
          <p className="text-gray-600">
            Download your SEO content strategy in various formats for offline use or sharing
          </p>
        </div>

        {exportFormats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportFormats.map((format, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {getFormatIcon(format.extension)}
                    <div>
                      <CardTitle className="text-lg">{format.name}</CardTitle>
                      <div className="text-xs text-gray-500 font-mono">
                        .{format.extension.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {format.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => onExport('content_strategy', format.id, contentData)}
                  >
                    <Download className="h-4 w-4" />
                    Export as {format.extension}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No export formats available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CMS Integration Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Publish to CMS</h3>
          <p className="text-gray-600">
            Integrate directly with your content management system to publish your strategy
          </p>
        </div>

        {cmsPlatforms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cmsPlatforms.map((platform, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(platform.name)}
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {platform.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => onPublish('content_strategy', platform.id, contentData)}
                  >
                    <Share2 className="h-4 w-4" />
                    Connect to {platform.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No CMS platforms available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Current connections and available integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-900">Export System</span>
              </div>
              <span className="text-sm text-green-700">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-yellow-900">CMS Integrations</span>
              </div>
              <span className="text-sm text-yellow-700">Limited Access</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-900">API Connections</span>
              </div>
              <span className="text-sm text-blue-700">Configure in Settings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common export and sharing options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onExport('full_strategy', 'pdf', contentData)}
            >
              <FileText className="h-6 w-6 text-red-600" />
              <div className="text-center">
                <div className="font-medium">Complete Report</div>
                <div className="text-xs text-gray-500">PDF with all sections</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onExport('keyword_data', 'csv', contentData)}
            >
              <Database className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Keyword Data</div>
                <div className="text-xs text-gray-500">CSV for analysis</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onExport('content_blueprint', 'docx', contentData)}
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Content Plan</div>
                <div className="text-xs text-gray-500">Editable document</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => onExport('optimization_guide', 'html', contentData)}
            >
              <Globe className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <div className="font-medium">SEO Guide</div>
                <div className="text-xs text-gray-500">Web-ready format</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
