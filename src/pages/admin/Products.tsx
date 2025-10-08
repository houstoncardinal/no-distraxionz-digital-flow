import { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Search, 
  Trash2, 
  Loader2, 
  Package, 
  Image as ImageIcon, 
  Edit, 
  Eye, 
  MoreHorizontal,
  Filter,
  Download,
  Upload,
  Archive,
  Star,
  StarOff,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ProductVariations, ProductVariation } from '@/components/admin/ProductVariations';
import { MetaTags } from '@/components/admin/MetaTags';
import { populateDatabase } from '@/utils/populateDatabase';
import QuickPopulate from '@/components/admin/QuickPopulate';
import ImageDatabasePopulator from '@/components/admin/ImageDatabasePopulator';
import ProductGallery from '@/components/admin/ProductGallery';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CATEGORY_VALUES = categories.filter(c => c.value !== 'all').map(c => c.value);

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  stock: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const Products = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const closingRef = useRef(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const filtered = useMemo(() => {
    let filtered = products;
    
    // Search filter
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((p) =>
        [p.name, p.category, p.description].some((f) => (f || '').toLowerCase().includes(q))
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    
    // Status filter
    if (statusFilter === 'in-stock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 0);
    } else if (statusFilter === 'low-stock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 10);
    } else if (statusFilter === 'out-of-stock') {
      filtered = filtered.filter((p) => (p.stock || 0) === 0);
    }
    
    return filtered;
  }, [products, query, categoryFilter, statusFilter]);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      price: '',
      description: '',
      category: 'Men',
      image: '',
      stock: 0,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
    },
    mode: 'onChange',
  });

  function handleOpenChange(next: boolean) {
    if (!next && form.formState.isDirty && !closingRef.current) {
      const confirmClose = window.confirm('Discard your changes?');
      if (!confirmClose) return;
      closingRef.current = true;
      setOpen(false);
      setTimeout(() => { closingRef.current = false; }, 0);
      return;
    }
    setOpen(next);
    if (!next) {
      form.reset();
      setUploadedImages([]);
      setVariations([]);
    }
  }

  async function onSubmit(values: ProductFormData) {
    const priceValue = parseFloat(values.price.replace(/[$,]/g, ''));
    const primaryImage = uploadedImages[0] || values.image;
    
    const productData = {
      name: values.name,
      description: values.description,
      price: priceValue,
      image: primaryImage,
      category: values.category,
      stock: values.stock,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await createProduct(productData);
    }

    setOpen(false);
    setEditingProduct(null);
    form.reset();
    setUploadedImages([]);
    setVariations([]);
  }

  async function handleDelete(id: string) {
    await deleteProduct(id);
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category || 'Men',
      image: product.image || '',
      stock: product.stock || 0,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
    });
    setUploadedImages(product.image ? [product.image] : []);
    setOpen(true);
  };

  const handleView = (product: any) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedProducts) {
      await deleteProduct(id);
    }
    setSelectedProducts([]);
  };

  const handlePopulateProducts = async () => {
    try {
      await populateDatabase();
      // Refresh products after population
      window.location.reload();
    } catch (error) {
      console.error('Error populating products:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filtered.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filtered.map(p => p.id));
    }
  };

  const canSubmit = form.formState.isValid && 
    !!form.watch('name') && 
    !!form.watch('price') && 
    !!form.watch('category') && 
    (uploadedImages.length > 0 || !!form.watch('image'));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Quick Populate Section */}
      {products.length === 0 && (
        <div className="mb-6 space-y-6">
          <ImageDatabasePopulator />
          <QuickPopulate />
        </div>
      )}

      {/* Product Gallery */}
      {products.length > 0 ? (
        <ProductGallery />
      ) : (
        <div className="space-y-6">
          {/* Enhanced Toolbar for Empty State */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Products</h1>
                <p className="text-sm text-muted-foreground">Manage your product catalog</p>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handlePopulateProducts}
                >
                  <Package className="h-4 w-4" />
                  Populate Products
                </Button>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                  <Button onClick={() => setOpen(true)} className="gap-2 h-9 px-4">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5" />
                      {editingProduct ? 'Edit Product' : 'Create Product'}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                      {editingProduct ? 'Update product information' : 'Add a new product with images, variations, and SEO optimization'}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="px-6 py-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="basic">Basic Info</TabsTrigger>
                          <TabsTrigger value="images">Images</TabsTrigger>
                          <TabsTrigger value="variations">Variations</TabsTrigger>
                          <TabsTrigger value="seo">SEO</TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-4 mt-4">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              rules={{ required: 'Name is required' }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Premium Focus Hoodie" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <div className="flex flex-wrap gap-2">
                                      {CATEGORY_VALUES.map((cat) => (
                                        <Button
                                          key={cat}
                                          type="button"
                                          variant={field.value === cat ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => field.onChange(cat)}
                                          className="capitalize"
                                        >
                                          {cat}
                                        </Button>
                                      ))}
                                    </div>
                                  </FormItem>
                                )}
                              />

                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="price"
                                  rules={{ required: 'Price is required' }}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Price (USD)</FormLabel>
                                      <FormControl>
                                        <Input placeholder="49.99" type="number" step="0.01" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="stock"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Stock Quantity</FormLabel>
                                      <FormControl>
                                        <Input placeholder="100" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      rows={4}
                                      placeholder="Describe your product in detail..."
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>

                        {/* Images Tab */}
                        <TabsContent value="images" className="mt-4">
                          <ImageUpload
                            onImageUploaded={(url) => {
                              setUploadedImages(prev => [...prev, url]);
                              if (!form.getValues('image')) {
                                form.setValue('image', url);
                              }
                            }}
                            currentImages={uploadedImages}
                            maxImages={5}
                          />
                        </TabsContent>

                        {/* Variations Tab */}
                        <TabsContent value="variations" className="mt-4">
                          <ProductVariations
                            variations={variations}
                            onChange={setVariations}
                          />
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo" className="mt-4">
                          <MetaTags
                            metaTitle={form.watch('metaTitle')}
                            metaDescription={form.watch('metaDescription')}
                            metaKeywords={form.watch('metaKeywords')}
                            onMetaTitleChange={(value) => form.setValue('metaTitle', value)}
                            onMetaDescriptionChange={(value) => form.setValue('metaDescription', value)}
                            onMetaKeywordsChange={(keywords) => form.setValue('metaKeywords', keywords)}
                            productName={form.watch('name')}
                            productDescription={form.watch('description')}
                          />
                        </TabsContent>
                      </Tabs>

                      <Separator />

                      <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOpenChange(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={!canSubmit} className="gap-2">
                          <Plus className="h-4 w-4" />
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-7 h-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORY_VALUES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedProducts.length} selected
            </span>
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">In Stock</div>
          <div className="text-2xl font-bold">
            {products.filter(p => (p.stock || 0) > 0).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Low Stock</div>
          <div className="text-2xl font-bold">
            {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Value</div>
          <div className="text-2xl font-bold">
            ${products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0).toFixed(2)}
          </div>
        </Card>
      </div>

      {/* Enhanced Products Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {filtered.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              <Checkbox 
                checked={selectedProducts.length === filtered.length && filtered.length > 0}
                className="mr-2"
              />
              Select All
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-12">
                  <Checkbox 
                    checked={selectedProducts.length === filtered.length && filtered.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-xs w-12"></TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Category</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Stock</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
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
                filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedProducts.includes(p.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts([...selectedProducts, p.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <img src={p.image || ''} alt={p.name} className="h-10 w-10 rounded object-cover" />
                        {(p.stock || 0) === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{p.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {p.category}
                        </Badge>
                        {p.featured && (
                          <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <div className="font-medium">${p.price.toFixed(2)}</div>
                        {p.original_price && (
                          <div className="text-xs text-muted-foreground line-through">
                            ${p.original_price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm hidden lg:table-cell">
                      <div>
                        <div className="font-medium">{p.stock || 0}</div>
                        {p.sizes && p.sizes.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {p.sizes.length} sizes
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm hidden lg:table-cell">
                      <div className="space-y-1">
                        <div>
                          {(p.stock || 0) === 0 ? (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          ) : (p.stock || 0) < 10 ? (
                            <Badge variant="secondary" className="text-xs">Low Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">In Stock</Badge>
                          )}
                        </div>
                        {p.colors && p.colors.length > 0 && (
                          <div className="flex gap-1">
                            {p.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {p.colors.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{p.colors.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(p)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(p)}
                        >
                          <Edit className="h-4 w-4" />
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
                            <DropdownMenuItem onClick={() => handleView(p)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(p)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

      {/* Product View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details
            </DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <img 
                      src={viewProduct.image || ''} 
                      alt={viewProduct.name} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{viewProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">{viewProduct.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="text-lg font-semibold">${viewProduct.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Stock</div>
                      <div className="text-lg font-semibold">{viewProduct.stock || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <Badge variant="outline">{viewProduct.category}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      {(viewProduct.stock || 0) === 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : (viewProduct.stock || 0) < 10 ? (
                        <Badge variant="secondary">Low Stock</Badge>
                      ) : (
                        <Badge variant="outline">In Stock</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;