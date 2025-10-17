import { Card } from '@/components/ui/card';
import { Search, TrendingUp } from 'lucide-react';

const SEO = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SEO Management</h1>
        <p className="text-muted-foreground">Optimize your store for search engines</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">SEO Score</p>
              <p className="text-2xl font-bold">85/100</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Organic Traffic</p>
              <p className="text-2xl font-bold">+12%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Indexed Pages</p>
          <p className="text-2xl font-bold">24</p>
        </Card>
      </div>
      <Card className="p-8 text-center text-muted-foreground">
        Manage meta tags, sitemaps, and SEO settings for your store.
      </Card>
    </div>
  );
};

export default SEO;
