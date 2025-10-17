import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone } from 'lucide-react';

const Campaigns = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Marketing Campaigns</h1>
          <p className="text-muted-foreground">Create and manage marketing campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Megaphone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Reach</p>
          <p className="text-2xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold">0%</p>
        </Card>
      </div>
    </div>
  );
};

export default Campaigns;
