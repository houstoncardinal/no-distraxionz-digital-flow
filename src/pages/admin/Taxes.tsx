import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ShieldCheck } from 'lucide-react';

const Taxes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tax Settings</h1>
          <p className="text-muted-foreground">Configure tax rates and rules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax Rate
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Tax Regions</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Default Rate</p>
          <p className="text-2xl font-bold">0%</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Tax Collected</p>
          <p className="text-2xl font-bold">$0.00</p>
        </Card>
      </div>
      <Card className="p-8 text-center text-muted-foreground">
        Set up automatic tax calculations based on customer location.
      </Card>
    </div>
  );
};

export default Taxes;
