import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

const Segments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customer Segments</h1>
          <p className="text-muted-foreground">Create customer segments for targeted marketing</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'VIP Customers', count: 0, color: 'text-purple-600' },
          { name: 'Repeat Buyers', count: 0, color: 'text-blue-600' },
          { name: 'At Risk', count: 0, color: 'text-orange-600' },
        ].map((segment) => (
          <Card key={segment.name} className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className={`h-5 w-5 ${segment.color}`} />
              <h3 className="font-semibold">{segment.name}</h3>
            </div>
            <p className="text-2xl font-bold">{segment.count}</p>
            <p className="text-sm text-muted-foreground">customers</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Segments;
