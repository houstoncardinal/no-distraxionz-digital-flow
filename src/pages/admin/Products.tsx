import { useEffect, useMemo, useRef, useState } from 'react';
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
  DialogFooter,
  DialogTrigger,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Sparkles, Clipboard, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Product, categories } from '@/data/products';
import { createProduct, deleteProduct, listProducts } from '@/lib/adminRepo';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

const CATEGORY_VALUES = categories.filter(c => c.value !== 'all').map(c => c.value);
const COMMON_SIZES = ['XS','S','M','L','XL','XXL'];
const WOMEN_SIZES = ['XS','S','M','L','XL'];
const KIDS_SIZES = ['6M','12M','18M','24M'];
const COMMON_COLORS = ['Black','White','Gray','Navy','Red','Pink','Charcoal'];

const Products = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    setItems(listProducts());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [p.name, p.category, p.description].some((f) => f.toLowerCase().includes(q))
    );
  }, [items, query]);

  type NewProduct = Omit<Product, 'id'>;

  const form = useForm<NewProduct>({
    defaultValues: {
      name: '',
      price: '',
      originalPrice: '',
      priceRange: '',
      description: '',
      category: 'Men',
      image: '',
      featured: true,
      sizes: [],
      colors: [],
    },
    mode: 'onChange',
  });

  // Guard against accidental close if there are unsaved changes
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

  // Helpers to toggle chip selections
  function toggleInArray(name: 'sizes' | 'colors', value: string) {
    const arr = (form.getValues(name) as string[]) || [];
    if (arr.includes(value)) {
      form.setValue(name, arr.filter(v => v !== value), { shouldDirty: true });
    } else {
      form.setValue(name, [...arr, value], { shouldDirty: true });
    }
  }

  function setCategoryQuick(value: string) {
    form.setValue('category', value, { shouldDirty: true });
    if (value === 'Women') {
      form.setValue('sizes', WOMEN_SIZES, { shouldDirty: true });
    } else if (value === 'Kids') {
      form.setValue('sizes', KIDS_SIZES, { shouldDirty: true });
    } else {
      form.setValue('sizes', COMMON_SIZES, { shouldDirty: true });
    }
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

  function onSubmit(values: NewProduct) {
    const sizes = Array.isArray(values.sizes)
      ? values.sizes
      : String(values.sizes || '').split(',').map(s => s.trim()).filter(Boolean);
    const colors = Array.isArray(values.colors)
      ? values.colors
      : String(values.colors || '').split(',').map(s => s.trim()).filter(Boolean);
    const priceRange = values.priceRange || values.price || '';

    const next = createProduct({ ...values, sizes, colors, priceRange });
    setItems((prev) => [next, ...prev]);
    setOpen(false);
    form.reset();
    toast({ title: 'Product added', description: `${next.name} was created.` });
  }

  function handleDelete(id: string) {
    const ok = deleteProduct(id);
    if (ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      toast({ title: 'Product deleted', description: `The product has been removed.` });
    } else {
      toast({ title: 'Delete failed', description: 'Unable to delete the product.', variant: 'destructive' });
    }
  }

  // Live preview data
  const previewData: Product = {
    id: 'preview',
    name: form.watch('name') || 'New Product',
    price: form.watch('price') || '$45',
    originalPrice: form.watch('originalPrice') || undefined,
    priceRange: form.watch('priceRange') || '',
    description: form.watch('description') || 'Premium streetwear with precision details.',
    category: form.watch('category') || 'Men',
    image: form.watch('image') || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: !!form.watch('featured'),
    sizes: (form.watch('sizes') as string[]) || [],
    colors: (form.watch('colors') as string[]) || [],
  };

  const canSubmit = form.formState.isValid && !!form.watch('name') && !!form.watch('price') && !!form.watch('category') && !!form.watch('image');

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
            <DialogTrigger asChild>
              <Button className="gap-2 h-8 px-3"><Plus className="h-4 w-4" />Add product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">Create product <Sparkles className="h-4 w-4 text-primary" /></DialogTitle>
                <DialogDescription className="text-xs">Complete the details below. Live preview updates as you type.</DialogDescription>
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
                          <Button key={c} type="button" variant={form.watch('category') === c ? 'default' : 'outline'} size="sm" onClick={() => setCategoryQuick(c)} className="capitalize h-7 px-2.5 text-xs">
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
                              <Input placeholder="$45" {...field} className="h-8" />
                            </FormControl>
                            <FormDescription className="text-[11px]">Display price (include currency)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Original price</FormLabel>
                            <FormControl>
                              <Input placeholder="$60" {...field} className="h-8" />
                            </FormControl>
                            <FormDescription className="text-[11px]">Optional compare-at</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="priceRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Price range</FormLabel>
                          <FormControl>
                            <Input placeholder="$35-50 (optional)" {...field} className="h-8" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

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
                            <Button type="button" variant="ghost" size="sm" className="gap-2 h-7 px-2.5 text-xs" onClick={autofillDescription}><Sparkles className="h-4 w-4" />Autofill</Button>
                          </div>
                          <FormControl>
                            <Textarea rows={3} placeholder="Describe the product…" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Sizes</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {(form.watch('category') === 'Kids' ? KIDS_SIZES : form.watch('category') === 'Women' ? WOMEN_SIZES : COMMON_SIZES).map(s => (
                            <Button key={s} type="button" size="sm" className="h-7 px-2.5 text-xs" variant={(form.watch('sizes') as string[])?.includes(s) ? 'default' : 'outline'} onClick={() => toggleInArray('sizes', s)}>{s}</Button>
                          ))}
                        </div>
                        <FormDescription className="text-[11px]">Click to select. Change category to update suggestions.</FormDescription>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs">Colors</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {COMMON_COLORS.map(c => (
                            <Button key={c} type="button" size="sm" className="h-7 px-2.5 text-xs capitalize" variant={(form.watch('colors') as string[])?.includes(c) ? 'default' : 'outline'} onClick={() => toggleInArray('colors', c)}>{c}</Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={!!form.watch('featured')} onCheckedChange={(v) => form.setValue('featured', !!v, { shouldDirty: true })} />
                        <Label className="text-xs">Featured on homepage</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" className="gap-2 h-8 px-3" onClick={() => form.reset()}><RefreshCw className="h-4 w-4" />Reset</Button>
                        <Button type="submit" disabled={!canSubmit} className="h-8 px-3">Create product</Button>
                      </div>
                    </div>
                  </form>
                </Form>

                {/* Right: Live preview */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs"><ImageIcon className="h-4 w-4" />Live preview</Label>
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
                <TableHead className="text-xs">Featured</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover" />
                      <div>
                        <div className="text-sm">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.priceRange || p.price}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell className="text-sm">{p.price}</TableCell>
                  <TableCell className="text-sm">{p.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground text-sm">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Products; 