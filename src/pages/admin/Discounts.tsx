import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Discounts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Discount Codes</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your store</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Discount
        </Button>
      </div>
      <Card className="p-8 text-center text-muted-foreground">
        No discount codes yet. Create your first discount to boost sales.
      </Card>
    </div>
  );
};

export default Discounts;
