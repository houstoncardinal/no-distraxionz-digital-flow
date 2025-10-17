import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

const Media = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your images and media files</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Images</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
      </div>
      <Card className="p-8 text-center text-muted-foreground">
        Upload and organize your product images and media files.
      </Card>
    </div>
  );
};

export default Media;
