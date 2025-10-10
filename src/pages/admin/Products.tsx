import EnhancedProductManager from '@/components/admin/EnhancedProductManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { populateToddlerShirts } from '@/utils/populateToddlerShirts';
import { populateProductsFromImageDatabase } from '@/utils/populateFromImages';
import { quickPopulateProducts } from '@/utils/quickPopulate';
import { useToast } from '@/hooks/use-toast';
import { Package, Sparkles, Upload } from 'lucide-react';

const Products = () => {
  const { toast } = useToast();

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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quick Actions
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
              Populate Toddler Shirts
            </Button>
            <Button
              onClick={handlePopulateFromImages}
              variant="outline"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Populate from Images
            </Button>
            <Button
              onClick={handleQuickPopulate}
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Quick Populate All
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Use these actions to quickly populate your database with products from various sources.
          </p>
        </CardContent>
      </Card>

      {/* Enhanced Product Manager */}
      <EnhancedProductManager />
    </div>
  );
};

export default Products;