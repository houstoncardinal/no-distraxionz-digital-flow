import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug } from 'lucide-react';

const Integrations = () => {
  const integrations = [
    { name: 'Google Analytics', description: 'Track website traffic and user behavior', status: 'not_connected' },
    { name: 'Mailchimp', description: 'Email marketing automation', status: 'not_connected' },
    { name: 'Facebook Pixel', description: 'Track conversions and retargeting', status: 'not_connected' },
    { name: 'Shopify', description: 'Sync products with Shopify', status: 'not_connected' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect third-party services to your store</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Plug className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
              <Badge variant="outline">Not Connected</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Connect
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
