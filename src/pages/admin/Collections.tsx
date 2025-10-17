import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Layers } from 'lucide-react';

const Collections = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Organize products into collections</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Collection
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Featured', 'New Arrivals', 'Best Sellers', 'Sale'].map((collection) => (
          <Card key={collection} className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{collection}</h3>
            </div>
            <p className="text-sm text-muted-foreground">0 products</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Collections;
