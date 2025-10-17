import EnhancedProductManager from '@/components/admin/EnhancedProductManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { populateToddlerShirts } from '@/utils/populateToddlerShirts';
import { populateProductsFromImageDatabase } from '@/utils/populateFromImages';
import { quickPopulateProducts } from '@/utils/quickPopulate';
import { populateAllCategories } from '@/utils/populateAllCategories';
import { useToast } from '@/hooks/use-toast';
import { Package, Sparkles, Upload, Zap } from 'lucide-react';

const Products = () => {
  const { toast } = useToast();

  const handlePopulateAll = async () => {
    toast({
      title: "Importing all products...",
      description: "This will import products from ALL categories (shirts, ladies, hats, hoodie, onesie, toddler-shirts)",
    });

    const result = await populateAllCategories();

    if (result.success) {
      toast({
        title: "Success! 🎉",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handlePopulateToddlerShirts = async () => {
    toast({
      title: "Populating toddler shirts...",
      description: "This may take a moment.",
    });

    const result = await populateToddlerShirts();

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handlePopulateFromImages = async () => {
    toast({
      title: "Populating from image database...",
      description: "This may take a moment.",
    });

    const result = await populateProductsFromImageDatabase();

    if (result && result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result?.message || "Failed to populate products",
        variant: "destructive",
      });
    }
  };

  const handleQuickPopulate = async () => {
    toast({
      title: "Quick populating products...",
      description: "This may take a moment.",
    });

    try {
      const result = await quickPopulateProducts();

      if (result && result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to populate products",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to populate products",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your product catalog, inventory, and pricing
        </p>
      </div>

      {/* Quick Import - Highlighted Section */}
      <Card className="border-2 border-primary bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Import - All Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import all products from your image folders in one click. This includes:
              <strong> Shirts, Ladies, Hats, Hoodies, Onesies, and Toddler Shirts</strong>
            </p>
            <Button
              onClick={handlePopulateAll}
              className="gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Import All Products Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Import Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Additional Import Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handlePopulateToddlerShirts}
              variant="outline"
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              Populate Toddler Shirts Only
            </Button>
            <Button
              onClick={handlePopulateFromImages}
              variant="outline"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Populate from Image Database
            </Button>
            <Button
              onClick={handleQuickPopulate}
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Quick Populate Sample
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Use these options to populate specific categories or test with sample data.
          </p>
        </CardContent>
      </Card>

      {/* Enhanced Product Manager */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <p className="text-sm text-muted-foreground">
            View, edit, and manage all your products. Click any product to edit pricing, images, or details.
          </p>
        </CardHeader>
        <CardContent>
          <EnhancedProductManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;