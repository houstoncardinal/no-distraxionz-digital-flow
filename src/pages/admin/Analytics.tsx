import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';

const Analytics = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = new Set(orders.map(order => order.customer_email)).size;
    
    // Calculate growth rates (mock data for demo)
    const revenueGrowth = 12.5;
    const ordersGrowth = 8.3;
    const productsGrowth = 5.2;
    const customersGrowth = 15.7;

    // Top products by revenue (mock data)
    const topProducts = [
      { name: 'Tunnel Vision Tee', revenue: 2140, orders: 28, growth: 12.5 },
      { name: 'Legendary Heavyweight', revenue: 1580, orders: 22, growth: 8.3 },
      { name: 'Time Is Money Tee', revenue: 1130, orders: 18, growth: 5.2 },
    ];

    // Recent orders
    const recentOrders = orders.slice(0, 5);

    // Sales by category
    const salesByCategory = [
      { category: 'Men', revenue: 4520, percentage: 65, growth: 8.2 },
      { category: 'Women', revenue: 2130, percentage: 31, growth: 12.5 },
      { category: 'Kids', revenue: 280, percentage: 4, growth: -2.1 },
    ];

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueGrowth,
      ordersGrowth,
      productsGrowth,
      customersGrowth,
      topProducts,
      recentOrders,
      salesByCategory,
    };
  }, [orders, products]);

  const MetricCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    trend = 'up',
    color = 'text-primary' 
  }: {
    title: string;
    value: string | number;
    growth: number;
    icon: any;
    trend?: 'up' | 'down';
    color?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {growth}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-muted/50 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          growth={analyticsData.revenueGrowth}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.totalOrders}
          growth={analyticsData.ordersGrowth}
          icon={ShoppingBag}
          trend="up"
        />
        <MetricCard
          title="Total Products"
          value={analyticsData.totalProducts}
          growth={analyticsData.productsGrowth}
          icon={Package}
          trend="up"
        />
        <MetricCard
          title="Total Customers"
          value={analyticsData.totalCustomers}
          growth={analyticsData.customersGrowth}
          icon={Users}
          trend="up"
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sales Performance</h3>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5%
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue Target</span>
                  <span className="text-sm font-medium">$8,500 / $10,000</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Orders Target</span>
                  <span className="text-sm font-medium">127 / 150</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </Card>

            {/* Top Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Products</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{product.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {analyticsData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${Number(order.total_amount).toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Category */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
              <div className="space-y-4">
                {analyticsData.salesByCategory.map((category) => (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">${category.revenue.toLocaleString()}</span>
                        <span className={`text-xs ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {category.growth > 0 ? '+' : ''}{category.growth}%
                        </span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Inventory Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Stock</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {products.filter(p => (p.stock || 0) > 0).length} products
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Stock</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length} products
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Out of Stock</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {products.filter(p => (p.stock || 0) === 0).length} products
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">New Customers</h3>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="text-2xl font-bold">+{analyticsData.customersGrowth}</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Retention</h3>
                  <p className="text-sm text-muted-foreground">Rate</p>
                </div>
              </div>
              <div className="text-2xl font-bold">87%</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Avg. Order Value</h3>
                  <p className="text-sm text-muted-foreground">Per customer</p>
                </div>
              </div>
              <div className="text-2xl font-bold">
                ${analyticsData.totalOrders > 0 ? (analyticsData.totalRevenue / analyticsData.totalOrders).toFixed(2) : '0.00'}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Trends</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">$1,240</span>
                    <Badge variant="outline" className="text-green-600">+8.2%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">$8,420</span>
                    <Badge variant="outline" className="text-green-600">+12.5%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">$34,180</span>
                    <Badge variant="outline" className="text-green-600">+15.3%</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="text-sm font-medium">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cart Abandonment</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Return Rate</span>
                  <span className="text-sm font-medium">2.1%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
