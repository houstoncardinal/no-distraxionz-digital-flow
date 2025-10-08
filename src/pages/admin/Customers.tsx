import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Download,
  Upload,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';

const Customers = () => {
  const { orders } = useOrders();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Process customer data from orders
  const customers = useMemo(() => {
    const customerMap = new Map();
    
    orders.forEach(order => {
      const email = order.customer_email;
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: email,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          totalOrders: 0,
          totalSpent: 0,
          firstOrder: order.created_at,
          lastOrder: order.created_at,
          orders: [],
          status: 'active',
        });
      }
      
      const customer = customerMap.get(email);
      customer.totalOrders += 1;
      customer.totalSpent += Number(order.total_amount);
      customer.orders.push(order);
      
      if (new Date(order.created_at) > new Date(customer.lastOrder)) {
        customer.lastOrder = order.created_at;
      }
      if (new Date(order.created_at) < new Date(customer.firstOrder)) {
        customer.firstOrder = order.created_at;
      }
    });
    
    return Array.from(customerMap.values()).sort((a, b) => 
      new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
    );
  }, [orders]);

  const filtered = useMemo(() => {
    let filtered = customers;
    
    // Search filter
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q)
      );
    }
    
    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((c) => c.status === 'active');
    } else if (statusFilter === 'vip') {
      filtered = filtered.filter((c) => c.totalSpent > 500);
    } else if (statusFilter === 'new') {
      filtered = filtered.filter((c) => {
        const daysSinceFirstOrder = Math.floor(
          (new Date().getTime() - new Date(c.firstOrder).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceFirstOrder <= 30;
      });
    }
    
    return filtered;
  }, [customers, query, statusFilter]);

  const customerStats = useMemo(() => {
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(c => {
      const daysSinceFirstOrder = Math.floor(
        (new Date().getTime() - new Date(c.firstOrder).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceFirstOrder <= 30;
    }).length;
    const vipCustomers = customers.filter(c => c.totalSpent > 500).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    
    return {
      totalCustomers,
      newCustomers,
      vipCustomers,
      totalRevenue,
    };
  }, [customers]);

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setViewOpen(true);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'text-primary',
    trend = null 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color?: string;
    trend?: { value: number; isPositive: boolean } | null;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
            </div>
          )}
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
          <h1 className="text-2xl font-semibold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customer relationships and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={customerStats.totalCustomers}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="New Customers"
          value={customerStats.newCustomers}
          subtitle="Last 30 days"
          icon={UserPlus}
          color="text-green-600"
        />
        <StatCard
          title="VIP Customers"
          value={customerStats.vipCustomers}
          subtitle="Spent $500+"
          icon={Star}
          color="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${customerStats.totalRevenue.toLocaleString()}`}
          subtitle="From all customers"
          icon={DollarSign}
          color="text-orange-600"
        />
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm">High Value</span>
              </div>
              <span className="text-sm font-medium">
                {customers.filter(c => c.totalSpent > 1000).length} customers
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm">Medium Value</span>
              </div>
              <span className="text-sm font-medium">
                {customers.filter(c => c.totalSpent > 200 && c.totalSpent <= 1000).length} customers
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm">Low Value</span>
              </div>
              <span className="text-sm font-medium">
                {customers.filter(c => c.totalSpent <= 200).length} customers
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Active (30 days)</span>
              </div>
              <span className="text-sm font-medium">
                {customers.filter(c => {
                  const daysSinceLastOrder = Math.floor(
                    (new Date().getTime() - new Date(c.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysSinceLastOrder <= 30;
                }).length} customers
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">At Risk (60+ days)</span>
              </div>
              <span className="text-sm font-medium">
                {customers.filter(c => {
                  const daysSinceLastOrder = Math.floor(
                    (new Date().getTime() - new Date(c.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysSinceLastOrder > 60;
                }).length} customers
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Inactive (90+ days)</span>
              </div>
              <span className="text-sm font-medium">
                {customers.filter(c => {
                  const daysSinceLastOrder = Math.floor(
                    (new Date().getTime() - new Date(c.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysSinceLastOrder > 90;
                }).length} customers
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="vip">VIP Customers</SelectItem>
            <SelectItem value="new">New Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b">
          <div className="text-sm text-muted-foreground">
            {filtered.length} customers
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.totalOrders} orders
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{customer.totalOrders}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(customer.lastOrder), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.totalSpent > 1000 ? (
                        <Badge variant="default" className="bg-purple-100 text-purple-700">
                          <Star className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      ) : customer.totalSpent > 500 ? (
                        <Badge variant="secondary">Premium</Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Details
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {selectedCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{selectedCustomer.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
                        </div>
                      </div>
                      {selectedCustomer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Customer since {format(new Date(selectedCustomer.firstOrder), 'MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Orders</span>
                        <span className="font-medium">{selectedCustomer.totalOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Spent</span>
                        <span className="font-medium">${selectedCustomer.totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Order</span>
                        <span className="font-medium">
                          ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Order</span>
                        <span className="font-medium">
                          {format(new Date(selectedCustomer.lastOrder), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <div className="space-y-3">
                  {selectedCustomer.orders.map((order: any) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${Number(order.total_amount).toFixed(2)}</div>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">
                    Activity timeline would go here
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">
                    Customer notes would go here
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;