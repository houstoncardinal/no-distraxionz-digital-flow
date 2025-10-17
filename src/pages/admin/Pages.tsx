import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Pages = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">Manage static pages and content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>
      <Card className="p-8 text-center text-muted-foreground">
        Manage your store's static pages like About, Contact, and custom landing pages.
      </Card>
    </div>
  );
};

export default Pages;
