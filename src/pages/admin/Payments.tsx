import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard } from 'lucide-react';

const Payments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Settings</h1>
        <p className="text-muted-foreground">Manage payment methods and gateways</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active Methods</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-2xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-bold">100%</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Stripe', 'PayPal'].map((method) => (
          <Card key={method} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <h3 className="font-semibold">{method}</h3>
              </div>
              <Badge variant="outline">Not Connected</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Payments;
