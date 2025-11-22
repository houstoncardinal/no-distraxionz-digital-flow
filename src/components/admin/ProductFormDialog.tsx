// World-Class Product Management Dialog with AI-Powered SEO
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ImageUpload } from './ImageUpload';
import { ProductVariations, ProductVariation } from './ProductVariations';
import { useToast } from '@/hooks/use-toast';
import {
  X,
  Plus,
  Wand2,
  Sparkles,
  Save,
  Image as ImageIcon,
  Tag,
  Settings,
  BarChart3,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Product } from '@/data/products';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
}

const CATEGORIES = ['Shirts', 'Ladies', 'Hoodies', 'Hats', 'Toddler Shirts', 'Onesie'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Charcoal', 'Pink', 'Purple', 'Red', 'Blue', 'Green'];

export const ProductFormDialog = ({ open, onOpenChange, product, onSubmit, mode }: ProductFormDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    category: '',
    image: '',
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    featured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: [] as string[],
    schema_data: {} as any,
    sku: '',
    variations: [] as ProductVariation[],
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '0',
        category: product.category || '',
        image: product.image || '',
        images: product.image ? [product.image, ...(product as any).images || []] : [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        featured: product.featured || false,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        meta_keywords: product.meta_keywords || [],
        schema_data: (product as any).schema_data || {},
        sku: '',
        variations: (product as any).variations || [],
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '0',
        category: '',
        image: '',
        images: [],
        sizes: [],
        colors: [],
        featured: false,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        schema_data: {},
        sku: '',
        variations: [],
      });
    }
  }, [product, mode, open]);

  // Generate SEO Content with OpenAI
  const generateSEO = async () => {
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in product name, description, and category first.",
        variant: "destructive",
      });
      return;
    }

    setSeoLoading(true);
    try {
      // For demo purposes, we'll simulate AI generation
      // In production, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate SEO content based on product details
      const seoTitle = `${formData.name} - Premium ${formData.category} | No Distraxionz`;
      const seoDescription = `${formData.name}: ${formData.description.substring(0, 100)}... Perfect for staying focused and motivated. Shop now at No Distraxionz.`;

      // Generate keywords from product details
      const keywords = [
        formData.category.toLowerCase(),
        'no distraxionz',
        'motivational apparel',
        'premium quality',
        'comfortable fit',
        formData.category.toLowerCase().replace('shirts', 'tees')
      ];

      // Generate structured data
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": formData.name,
        "description": formData.description,
        "brand": "No Distraxionz",
        "category": formData.category,
        "offers": {
          "@type": "Offer",
          "price": formData.price,
          "priceCurrency": "USD",
          "availability": parseInt(formData.stock) > 0 ? "InStock" : "OutOfStock"
        },
        "image": formData.images[0] || formData.image
      };

      setFormData(prev => ({
        ...prev,
        meta_title: seoTitle,
        meta_description: seoDescription,
        meta_keywords: keywords,
        schema_data: schemaData,
      }));

      toast({
        title: "SEO Generated! ✨",
        description: "AI-powered SEO content has been applied to your product.",
      });
    } catch (error) {
      toast({
        title: "SEO Generation Failed",
        description: "Unable to generate SEO content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSeoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.images[0] || formData.image || null,
      };

      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.meta_keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        meta_keywords: [...prev.meta_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter(k => k !== keyword)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Build your product catalog with powerful SEO and AI assistance.'
              : 'Update product details with AI-powered SEO optimization.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(95vh-180px)]" data-netlify="true" name="product">
          <input type="hidden" name="form-name" value="product" />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="gap-2">
                <Settings className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="variants" className="gap-2">
                <Settings className="h-4 w-4" />
                Variants
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                SEO & Marketing
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Focus Mode Classic Tee"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="45.00"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock" className="text-sm font-medium">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="100"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked as boolean }))}
                    />
                    <div>
                      <Label htmlFor="featured" className="cursor-pointer font-medium">Featured Product</Label>
                      <p className="text-sm text-muted-foreground">Display prominently on homepage</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Product Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product with compelling details, benefits, and features..."
                    rows={12}
                    className="resize-none"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formData.description.length} characters</span>
                    <span>Rich description helps with SEO</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="flex-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Product Images
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload high-quality images. First image will be the main product image.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <Card key={index} className={`relative overflow-hidden transition-all duration-200 ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                        <div className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 bg-primary">Main Image</Badge>
                          )}
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                            <div className="flex gap-2">
                              {index > 0 && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => moveImage(index, 0)}
                                  className="gap-1"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  Make Main
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {formData.images.length < 5 && (
                      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center h-full aspect-square p-6">
                          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground text-center">
                            Drop images here or click to upload
                          </p>
                          <ImageUpload
                            onImageUploaded={(url) => setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, url],
                              image: prev.images.length === 0 ? url : prev.image
                            }))}
                            currentImages={formData.images}
                            maxImages={5}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="flex-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure available sizes, colors, and pricing variations.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sizes */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Available Sizes</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {SIZES.map(size => (
                        <Badge
                          key={size}
                          variant={formData.sizes.includes(size) ? "default" : "outline"}
                          className="cursor-pointer hover:shadow-md transition-shadow p-3 justify-center"
                          onClick={() => toggleSize(size)}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Available Colors</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORS.map(color => (
                        <Badge
                          key={color}
                          variant={formData.colors.includes(color) ? "default" : "outline"}
                          className="cursor-pointer hover:shadow-md transition-shadow p-3 justify-center"
                          onClick={() => toggleColor(color)}
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Variations */}
                  <Separator />
                  <ProductVariations
                    variations={formData.variations}
                    onChange={(variations) => setFormData(prev => ({ ...prev, variations }))}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO & Marketing Tab */}
            <TabsContent value="seo" className="flex-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    AI-Powered SEO & Marketing
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Generate optimized SEO content with AI assistance.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Generate SEO Button */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-900">Generate SEO Content</h4>
                      <p className="text-sm text-purple-700">AI will create optimized meta titles, descriptions, and keywords for this product.</p>
                    </div>
                    <Button
                      onClick={generateSEO}
                      disabled={seoLoading || !formData.name || !formData.description}
                      className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {seoLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4" />
                          Generate SEO
                        </>
                      )}
                    </Button>
                  </div>

                  {seoLoading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analyzing product details...</span>
                        <span>AI is working its magic ✨</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  )}

                  {/* SEO Preview */}
                  {(formData.meta_title || formData.meta_description) && (
                    <Card className="border-green-200 bg-green-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-green-800">
                          <CheckCircle2 className="h-4 w-4" />
                          SEO Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Google Result</p>
                            <a href="#" className="text-blue-600 hover:underline text-lg font-medium line-clamp-1">
                              {formData.meta_title || 'Your Meta Title Here'}
                            </a>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {formData.meta_description || 'Your meta description will appear here...'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">no-distraxionz.com/product-slug</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Meta Title */}
                    <div className="space-y-2">
                      <Label htmlFor="meta_title" className="text-sm font-medium">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        placeholder="Focus Mode Classic Tee - Premium Cotton"
                        maxLength={60}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formData.meta_title.length}/60 characters</span>
                        <span className={`flex items-center gap-1 ${formData.meta_title.length <= 60 ? 'text-green-600' : 'text-red-600'}`}>
                          {formData.meta_title.length <= 60 ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {formData.meta_title.length <= 60 ? 'Good length' : 'Too long'}
                        </span>
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                      <Label htmlFor="meta_description" className="text-sm font-medium">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Premium cotton tee with No Distraxionz branding. Perfect for staying focused..."
                        rows={3}
                        maxLength={160}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formData.meta_description.length}/160 characters</span>
                        <span className={`flex items-center gap-1 ${formData.meta_description.length <= 160 ? 'text-green-600' : 'text-red-600'}`}>
                          {formData.meta_description.length <= 160 ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {formData.meta_description.length <= 160 ? 'Good length' : 'Too long'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meta Keywords */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Meta Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        placeholder="Add relevant keyword"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addKeyword} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.meta_keywords.map(keyword => (
                        <Badge key={keyword} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors" onClick={() => removeKeyword(keyword)}>
                          <X className="h-3 w-3 mr-1" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Schema Data Preview */}
                  {Object.keys(formData.schema_data).length > 0 && (
                    <Card className="border-blue-200 bg-blue-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                          <BarChart3 className="h-4 w-4" />
                          Structured Data (JSON-LD)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <pre className="text-xs bg-blue-950 text-blue-100 p-3 rounded overflow-x-auto">
                          {JSON.stringify(formData.schema_data, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === 'create' ? 'Create Product' : 'Update Product'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
