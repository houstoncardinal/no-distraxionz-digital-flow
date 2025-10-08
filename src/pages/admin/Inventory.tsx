import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Archive,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Zap,
  Target,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const Inventory = () => {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);
  const [bulkUpdateValue, setBulkUpdateValue] = useState('');

  const filtered = useMemo(() => {
    let filtered = products;
    
    // Search filter
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) || 
        (p.category || '').toLowerCase().includes(q)
      );
    }
    
    // Status filter
    if (statusFilter === 'in-stock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 0);
    } else if (statusFilter === 'low-stock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 10);
    } else if (statusFilter === 'out-of-stock') {
      filtered = filtered.filter((p) => (p.stock || 0) === 0);
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    
    return filtered;
  }, [products, query, statusFilter, categoryFilter]);

  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(p => (p.stock || 0) > 0).length;
    const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
    
    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
    };
  }, [products]);

  const handleBulkStockUpdate = async () => {
    if (!bulkUpdateValue || selectedProducts.length === 0) return;
    
    const newStock = parseInt(bulkUpdateValue);
    if (isNaN(newStock)) return;

    try {
      for (const productId of selectedProducts) {
        await updateProduct(productId, { stock: newStock });
      }
      
      toast({
        title: 'Success',
        description: `Updated stock for ${selectedProducts.length} products`,
      });
      
      setSelectedProducts([]);
      setBulkUpdateOpen(false);
      setBulkUpdateValue('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filtered.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filtered.map(p => p.id));
    }
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
          <h1 className="text-2xl font-semibold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product stock levels</p>
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
            <Plus className="h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={inventoryStats.totalProducts}
          icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="In Stock"
          value={inventoryStats.inStock}
          subtitle={`${Math.round((inventoryStats.inStock / inventoryStats.totalProducts) * 100)}% of total`}
          icon={Target}
          color="text-green-600"
        />
        <StatCard
          title="Low Stock"
          value={inventoryStats.lowStock}
          subtitle="Need restocking"
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <StatCard
          title="Out of Stock"
          value={inventoryStats.outOfStock}
          subtitle="Requires attention"
          icon={AlertCircle}
          color="text-red-600"
        />
      </div>

      {/* Inventory Value */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Inventory Value</h3>
          <Badge variant="outline" className="gap-1">
            <BarChart3 className="h-3 w-3" />
            ${inventoryStats.totalValue.toLocaleString()}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${inventoryStats.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${Math.round(inventoryStats.totalValue / inventoryStats.totalProducts).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Value per Product</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((inventoryStats.inStock / inventoryStats.totalProducts) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Stock Coverage</div>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Men">Men</SelectItem>
            <SelectItem value="Women">Women</SelectItem>
            <SelectItem value="Kids">Kids</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedProducts.length} products selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkUpdateOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Stock
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProducts([])}
            >
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filtered.length} products
          </div>
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <img 
                          src={product.image || ''} 
                          alt={product.name} 
                          className="h-10 w-10 rounded object-cover" 
                        />
                        {(product.stock || 0) === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.stock || 0}</div>
                    </TableCell>
                    <TableCell>
                      {(product.stock || 0) === 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : (product.stock || 0) < 10 ? (
                        <Badge variant="secondary">Low Stock</Badge>
                      ) : (
                        <Badge variant="outline">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${((product.stock || 0) * product.price).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Bulk Update Dialog */}
      <Dialog open={bulkUpdateOpen} onOpenChange={setBulkUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Stock Update</DialogTitle>
            <DialogDescription>
              Update stock levels for {selectedProducts.length} selected products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="stock">New Stock Level</Label>
              <Input
                id="stock"
                type="number"
                value={bulkUpdateValue}
                onChange={(e) => setBulkUpdateValue(e.target.value)}
                placeholder="Enter stock quantity"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setBulkUpdateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkStockUpdate}>
                Update Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
