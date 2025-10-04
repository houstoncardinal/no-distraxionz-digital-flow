import { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Sparkles, Clipboard, Image as ImageIcon, RefreshCw, Loader2 } from 'lucide-react';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

const CATEGORY_VALUES = categories.filter(c => c.value !== 'all').map(c => c.value);
const COMMON_SIZES = ['XS','S','M','L','XL','XXL'];
const WOMEN_SIZES = ['XS','S','M','L','XL'];
const KIDS_SIZES = ['6M','12M','18M','24M'];
const COMMON_COLORS = ['Black','White','Gray','Navy','Red','Pink','Charcoal'];

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  stock: number;
}

const Products = () => {
  const { products, loading, createProduct, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);

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
    if (!next) form.reset();
  }

  function setCategoryQuick(value: string) {
    form.setValue('category', value, { shouldDirty: true });
  }

  function pasteImageFromClipboard() {
    if (!navigator.clipboard) return;
    navigator.clipboard.readText().then((text) => {
      if (text) form.setValue('image', text, { shouldDirty: true });
    }).catch(() => {});
  }

  function autofillDescription() {
    const name = form.getValues('name');
    const category = form.getValues('category');
    const snippet = `Premium ${category.toLowerCase()} streetwear. Designed for focus, built for comfort. ${name ? name + ' pairs effortlessly with your daily grind.' : 'Engineered for daily wear and statement looks.'}`;
    form.setValue('description', snippet, { shouldDirty: true });
  }

  async function onSubmit(values: ProductFormData) {
    // Parse price to number
    const priceValue = parseFloat(values.price.replace(/[$,]/g, ''));
    
    await createProduct({
      name: values.name,
      description: values.description,
      price: priceValue,
      image: values.image,
      category: values.category,
      stock: values.stock,
    });

    setOpen(false);
    form.reset();
  }

  async function handleDelete(id: string) {
    await deleteProduct(id);
  }

  // Live preview data
  const previewData = {
    id: 'preview',
    name: form.watch('name') || 'New Product',
    price: form.watch('price') || '$45',
    priceRange: '',
    originalPrice: undefined,
    description: form.watch('description') || 'Premium streetwear with precision details.',
    category: form.watch('category') || 'Men',
    image: form.watch('image') || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: false,
    sizes: [],
    colors: [],
  };

  const canSubmit = form.formState.isValid && !!form.watch('name') && !!form.watch('price') && !!form.watch('category') && !!form.watch('image');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Products</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-7 h-8"
            />
          </div>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button onClick={() => setOpen(true)} className="gap-2 h-8 px-3">
              <Plus className="h-4 w-4" />Add product
            </Button>
            <DialogContent className="max-w-4xl p-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  Create product <Sparkles className="h-4 w-4 text-primary" />
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Complete the details below. Live preview updates as you type.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    {/* Category quick picks */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_VALUES.map((c) => (
                          <Button 
                            key={c} 
                            type="button" 
                            variant={form.watch('category') === c ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setCategoryQuick(c)} 
                            className="capitalize h-7 px-2.5 text-xs"
                          >
                            {c}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Tunnel Vision Tee" {...field} className="h-8" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="price"
                        rules={{ required: 'Price is required' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Price</FormLabel>
                            <FormControl>
                              <Input placeholder="45.00" type="number" step="0.01" {...field} className="h-8" />
                            </FormControl>
                            <FormDescription className="text-[11px]">Enter price (USD)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Stock</FormLabel>
                            <FormControl>
                              <Input placeholder="100" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="h-8" />
                            </FormControl>
                            <FormDescription className="text-[11px]">Available quantity</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <FormLabel className="text-xs">Image URL</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="image"
                          rules={{ required: 'Image URL is required' }}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="https://images.unsplash.com/..." {...field} className="h-8" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="outline" size="icon" title="Paste" className="h-8 w-8" onClick={pasteImageFromClipboard}>
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="rounded-md border bg-card p-1.5">
                        <img src={form.watch('image') || ''} alt="Preview" className="h-24 w-full object-cover rounded" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }} />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs">Description</FormLabel>
                            <Button type="button" variant="ghost" size="sm" className="gap-2 h-7 px-2.5 text-xs" onClick={autofillDescription}>
                              <Sparkles className="h-4 w-4" />Autofill
                            </Button>
                          </div>
                          <FormControl>
                            <Textarea rows={3} placeholder="Describe the product…" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" className="gap-2 h-8 px-3" onClick={() => form.reset()}>
                        <RefreshCw className="h-4 w-4" />Reset
                      </Button>
                      <Button type="submit" disabled={!canSubmit} className="h-8 px-3">
                        Create product
                      </Button>
                    </div>
                  </form>
                </Form>

                {/* Right: Live preview */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <ImageIcon className="h-4 w-4" />Live preview
                  </Label>
                  <Card className="p-2">
                    <ProductCard {...previewData} />
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </div>
        <div className="p-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Stock</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img src={p.image || ''} alt={p.name} className="h-8 w-8 rounded object-cover" />
                        <div>
                          <div className="text-sm">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">{p.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.category}</TableCell>
                    <TableCell className="text-sm">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{p.stock || 0}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
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
