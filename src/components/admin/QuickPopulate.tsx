import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { quickPopulateProducts } from '@/utils/quickPopulate';

const QuickPopulate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handlePopulate = async () => {
    setIsLoading(true);
    setStatus('idle');

    try {
      await quickPopulateProducts();
      setStatus('success');
      toast({
        title: 'Success!',
        description: 'Products have been populated successfully.',
      });
    } catch (error) {
      console.error('Error populating products:', error);
      setStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to populate products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Quick Populate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Populate your database with all your static products from the data file.
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePopulate}
            disabled={isLoading}
            className="w-full"
            variant={status === 'success' ? 'default' : 'outline'}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Populating...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Populate Products
              </>
            )}
          </Button>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Products populated successfully!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Failed to populate products</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickPopulate;

