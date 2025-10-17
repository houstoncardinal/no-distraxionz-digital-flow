import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

const Abandoned = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Abandoned Carts</h1>
        <p className="text-muted-foreground">Recover lost sales from abandoned shopping carts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Abandoned Carts</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">Recovery Rate</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
        </Card>
      </div>
      <Card className="p-8 text-center text-muted-foreground">
        No abandoned carts found. Enable cart tracking to see abandoned carts here.
      </Card>
    </div>
  );
};

export default Abandoned;
