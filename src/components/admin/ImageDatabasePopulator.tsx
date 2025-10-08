import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle, Image, Package, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { populateProductsFromImageDatabase } from '@/utils/populateFromImages';
import { discoverImages } from '@/utils/imageDatabase';

const ImageDatabasePopulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showImages, setShowImages] = useState(false);
  const { toast } = useToast();

  const discoveredImages = discoverImages();
  const totalImages = Object.values(discoveredImages).reduce((sum, images) => sum + images.length, 0);

  const handlePopulate = async () => {
    setIsLoading(true);
    setStatus('idle');

    try {
      await populateProductsFromImageDatabase();
      setStatus('success');
      toast({
        title: 'Success!',
        description: `Populated ${totalImages} products from your image database.`,
      });
    } catch (error) {
      console.error('Error populating from images:', error);
      setStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to populate from image database. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Image Database Integration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover and populate products from your existing image database in the public folder.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalImages}</div>
            <div className="text-sm text-gray-600">Total Images Found</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Object.keys(discoveredImages).length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{totalImages}</div>
            <div className="text-sm text-gray-600">Products to Create</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Discovered Images by Category:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(discoveredImages).map(([category, images]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-gray-600" />
                  <span className="font-medium capitalize">{category}</span>
                </div>
                <Badge variant="secondary">{images.length} images</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handlePopulate}
            disabled={isLoading}
            className="flex-1"
            variant={status === 'success' ? 'default' : 'outline'}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Populating from Images...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Populate from Image Database
              </>
            )}
          </Button>
          
          <Button
            onClick={() => setShowImages(!showImages)}
            variant="outline"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showImages ? 'Hide' : 'Show'} Images
          </Button>
        </div>

        {/* Image Preview */}
        {showImages && (
          <div className="space-y-4">
            <h4 className="font-medium">Image Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(discoveredImages).map(([category, images]) => (
                <div key={category} className="space-y-2">
                  <h5 className="font-medium text-sm capitalize">{category}</h5>
                  <div className="space-y-2">
                    {images.slice(0, 3).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.fullPath}
                          alt={image.filename}
                          className="w-full h-20 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-1 left-1 right-1">
                          <Badge className="text-xs bg-black/70 text-white">
                            {image.filename}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {images.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{images.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Successfully populated products from image database!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Failed to populate from image database</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageDatabasePopulator;


