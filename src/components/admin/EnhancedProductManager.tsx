import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Copy,
  Archive,
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Tag,
  Layers,
  Settings,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

const EnhancedProductManager = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Form state for creating/editing products
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    featured: false,
    specifications: {
      material: '',
      weight: '',
      fit: '',
      care: '',
      origin: '',
      features: [] as string[]
    },
    tax_rate: '0.08',
    tags: [] as string[],
    sku: '',
    stock: ''
  });

  // Categories
  const categories = ['Shirts', 'Ladies', 'Hoodies', 'Hats', 'Toddler Shirts'];

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const featuredProducts = products.filter(p => p.featured).length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    return {
      totalProducts,
      featuredProducts,
      totalValue,
      avgPrice
    };
  }, [products]);

  // Handle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Handle create product
  const handleCreateProduct = async () => {
    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        image: formData.image,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        featured: formData.featured
      });

      toast({
        title: "Product created!",
        description: `${formData.name} has been added successfully.`,
      });

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        image: formData.image,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        featured: formData.featured
      });

      toast({
        title: "Product updated!",
        description: `${formData.name} has been updated successfully.`,
      });

      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      toast({
        title: "Product deleted!",
        description: "Product has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      await Promise.all(selectedProducts.map(id => deleteProduct(id)));
      toast({
        title: "Products deleted!",
        description: `${selectedProducts.length} products have been removed.`,
      });
      setSelectedProducts([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some products. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image: product.image,
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      featured: product.featured || false,
      specifications: {
        material: '',
        weight: '',
        fit: '',
        care: '',
        origin: '',
        features: []
      },
      tax_rate: '0.08',
      tags: [],
      sku: '',
      stock: ''
    });
    setIsEditDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      image: '',
      category: '',
      sizes: [],
      colors: [],
      featured: false,
      specifications: {
        material: '',
        weight: '',
        fit: '',
        care: '',
        origin: '',
        features: []
      },
      tax_rate: '0.08',
      tags: [],
      sku: '',
      stock: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-gray-900">{stats.featuredProducts}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-3xl font-bold text-gray-900">${stats.avgPrice.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              {selectedProducts.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedProducts.length})
                </Button>
              )}

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your catalog
                    </DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleCreateProduct}
                    onCancel={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length}
                      onCheckedChange={selectAllProducts}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <OptimizedImage
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateProduct}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingProduct(null);
              resetForm();
            }}
            isEdit
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ formData, setFormData, onSubmit, onCancel, isEdit = false }: any) => {
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  const addSize = () => {
    if (sizeInput && !formData.sizes.includes(sizeInput)) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput] });
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((s: string) => s !== size) });
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput] });
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter((c: string) => c !== color) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="original_price">Original Price</Label>
          <Input
            id="original_price"
            type="number"
            step="0.01"
            value={formData.original_price}
            onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="image">Image URL *</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/path/to/image.png"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shirts">Shirts</SelectItem>
              <SelectItem value="Ladies">Ladies</SelectItem>
              <SelectItem value="Hoodies">Hoodies</SelectItem>
              <SelectItem value="Hats">Hats</SelectItem>
              <SelectItem value="Toddler Shirts">Toddler Shirts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tax_rate">Tax Rate (%)</Label>
          <Input
            id="tax_rate"
            type="number"
            step="0.01"
            value={formData.tax_rate}
            onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
            placeholder="8.00"
          />
        </div>

        <div className="col-span-2">
          <Label>Sizes</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Add size (e.g., S, M, L)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <Button type="button" onClick={addSize}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sizes.map((size: string) => (
              <Badge key={size} variant="secondary" className="gap-1">
                {size}
                <button onClick={() => removeSize(size)} className="ml-1 hover:text-red-500">
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <Label>Colors</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Add color (e.g., Black, White)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <Button type="button" onClick={addColor}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color: string) => (
              <Badge key={color} variant="secondary" className="gap-1">
                {color}
                <button onClick={() => removeColor(color)} className="ml-1 hover:text-red-500">
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Mark as Featured Product
          </Label>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default EnhancedProductManager;

