import { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Loader2, Package, Image as ImageIcon } from 'lucide-react';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ProductVariations, ProductVariation } from '@/components/admin/ProductVariations';
import { MetaTags } from '@/components/admin/MetaTags';

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
  const { products, loading, createProduct, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.description].some((f) => (f || '').toLowerCase().includes(q))
    );
  }, [products, query]);

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
    
    await createProduct({
      name: values.name,
      description: values.description,
      price: priceValue,
      image: primaryImage,
      category: values.category,
      stock: values.stock,
    });

    setOpen(false);
    form.reset();
    setUploadedImages([]);
    setVariations([]);
  }

  async function handleDelete(id: string) {
    await deleteProduct(id);
  }

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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Products</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-7 h-9"
            />
          </div>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button onClick={() => setOpen(true)} className="gap-2 h-9 px-4 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add product</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
              <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Create Product
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Add a new product with images, variations, and SEO optimization
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
                        Create Product
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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

      {/* Products Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-12"></TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Category</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs hidden lg:table-cell">Stock</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="relative">
                        <img src={p.image || ''} alt={p.name} className="h-10 w-10 rounded object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{p.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm hidden md:table-cell">{p.category}</TableCell>
                    <TableCell className="text-sm font-medium">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-sm hidden lg:table-cell">
                      <span className={p.stock && p.stock < 10 ? 'text-orange-500' : ''}>
                        {p.stock || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. {p.name} will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Products;
