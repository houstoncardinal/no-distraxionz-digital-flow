import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { populateAllProducts } from '@/utils/populateAllProducts';
import { AlertCircle, CheckCircle2, Package } from 'lucide-react';

const PopulateProducts = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePopulate = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await populateAllProducts();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to populate products');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Populate Products Database
          </CardTitle>
          <CardDescription>
            Populate your Supabase database with all products from the public folders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What this will do:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Clear existing products (if any)</li>
              <li>• Add 4 Shirt products from /shirts folder</li>
              <li>• Add 4 Ladies products from /ladies folder</li>
              <li>• Add 4 Hoodie products from /hoodie folder</li>
              <li>• Add 4 Hat products from /hats folder</li>
              <li>• Add 6 Toddler Shirt products from /toddler-shirts folder</li>
              <li className="font-semibold pt-2">Total: 22 products</li>
            </ul>
          </div>

          <Button 
            onClick={handlePopulate} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Populating...' : 'Populate Products Now'}
          </Button>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Success!</h4>
                <p className="text-sm text-green-800">
                  All 22 products have been successfully added to your database. 
                  You can now view them on your shop page.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Error</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Note:</strong> Make sure your Supabase connection is properly configured.</p>
            <p>After populating, navigate to the Shop page to see your products.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopulateProducts;

