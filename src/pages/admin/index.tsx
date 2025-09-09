import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingBag, Package, Users, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';

const MetricCard = ({ label, value, trend, icon: Icon, accent }: { label: string; value: string; trend?: string; icon: any; accent: string }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Icon className={`h-4 w-4 ${accent}`} />
    </div>
    <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    {trend && (
      <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-600">
        <TrendingUp className="h-3 w-3" />
        {trend}
      </div>
    )}
  </Card>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Key shop insights and quick actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live</Badge>
          <Button size="sm" variant="outline" className="h-8 px-3">Export report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Orders (24h)" value="128" trend="12% vs yesterday" icon={ShoppingBag} accent="text-primary" />
        <MetricCard label="Revenue" value="$7,420" trend="8% vs last week" icon={DollarSign} accent="text-primary" />
        <MetricCard label="Products" value="342" trend="12 low stock" icon={Package} accent="text-primary" />
        <MetricCard label="Customers" value="5,108" trend="210 new" icon={Users} accent="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Fulfillment SLA</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-sm text-foreground mb-2">96% orders shipped <span className="text-muted-foreground">within 24h</span></div>
          <Progress value={96} className="h-2" />
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Return rate</span>
          </div>
          <div className="text-sm text-foreground mb-2">2.1% <span className="text-muted-foreground">last 30 days</span></div>
          <Progress value={98} className="h-2" />
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Inventory health</span>
          </div>
          <div className="text-sm text-foreground mb-2">88% <span className="text-muted-foreground">in-stock coverage</span></div>
          <Progress value={88} className="h-2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-base font-semibold">Recent orders</h2>
              <p className="text-xs text-muted-foreground">Latest order activity</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-3">View all</Button>
          </div>
          <div className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Order</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[{ id: '#2931', name: 'Marcus J.', status: 'Paid', total: '$185.00' }, { id: '#2928', name: 'Lena R.', status: 'Fulfilled', total: '$72.00' }, { id: '#2927', name: 'Ibrahim K.', status: 'Pending', total: '$45.00' }].map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium text-sm">{o.id}</TableCell>
                    <TableCell className="text-sm">{o.name}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant={o.status === 'Pending' ? 'outline' : 'secondary'}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">{o.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-base font-semibold">Top products</h2>
              <p className="text-xs text-muted-foreground">By revenue</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-3">Manage</Button>
          </div>
          <div className="p-4 space-y-3">
            {[{ name: 'Tunnel Vision Tee', revenue: '$2,140', pct: 72 }, { name: 'Legendary Heavyweight', revenue: '$1,580', pct: 54 }, { name: 'Time Is Money Tee', revenue: '$1,130', pct: 41 }].map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-muted-foreground">{p.revenue}</div>
                </div>
                <Progress value={p.pct} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-semibold">Quick actions</h2>
            <p className="text-xs text-muted-foreground">Manage the most important parts of your shop</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3">Add product</Button>
            <Button variant="outline" size="sm" className="h-8 px-3">Create discount</Button>
            <Button variant="outline" size="sm" className="h-8 px-3">Review orders</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 