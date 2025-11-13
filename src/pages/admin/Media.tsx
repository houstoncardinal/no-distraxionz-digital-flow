import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Trash2, Search, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: any;
}

const Media = () => {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('product-images')
        .list();

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `${files.length} image(s) uploaded successfully`,
      });

      loadImages();
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      loadImages();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const getImageUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied',
      description: 'Image URL copied to clipboard',
    });
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your product images and media files</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => document.getElementById('file-upload')?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Images</p>
              <p className="text-2xl font-bold">{images.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-bold">
                {(images.reduce((sum, img) => sum + (img.metadata?.size || 0), 0) / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Image Grid */}
      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Loading images...
        </Card>
      ) : filteredImages.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {searchQuery ? 'No images found matching your search.' : 'No images uploaded yet. Upload your first product image to get started.'}
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => {
            const imageUrl = getImageUrl(image.name);
            return (
              <Card key={image.id} className="group relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={imageUrl}
                      alt={image.name}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(imageUrl)}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => copyToClipboard(imageUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => window.open(imageUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(image.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs truncate text-muted-foreground">{image.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {((image.metadata?.size || 0) / 1024).toFixed(0)} KB
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              Click the buttons below to copy URL or open in new tab
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedImage || ''} alt="Preview" className="w-full h-auto rounded-lg" />
            <div className="flex gap-2">
              <Button onClick={() => selectedImage && copyToClipboard(selectedImage)} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button onClick={() => selectedImage && window.open(selectedImage, '_blank')} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
            <Input value={selectedImage || ''} readOnly className="text-xs" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Media;
