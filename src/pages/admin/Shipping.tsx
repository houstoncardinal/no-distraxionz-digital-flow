import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Truck } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shipping Settings</h1>
          <p className="text-muted-foreground">Configure shipping zones and rates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Shipping Zones</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
          <p className="text-2xl font-bold">3-5 days</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
          <p className="text-2xl font-bold">96%</p>
        </Card>
      </div>
    </div>
  );
};

export default Shipping;
