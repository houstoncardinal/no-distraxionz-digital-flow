import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Layers, Edit, Trash2, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  product_count?: number;
}

const Collections = () => {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (collectionsError) throw collectionsError;

      const collectionsWithCounts = await Promise.all(
        (collectionsData || []).map(async (collection) => {
          const { count } = await supabase
            .from('collection_products')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);
          
          return { ...collection, product_count: count || 0 };
        })
      );

      setCollections(collectionsWithCounts);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load collections', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const collectionData = {
      name: formData.name,
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_active: true,
      sort_order: collections.length,
    };

    try {
      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(collectionData)
          .eq('id', editingCollection.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Collection updated successfully' });
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([collectionData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Collection created successfully' });
      }
      
      setDialogOpen(false);
      setEditingCollection(null);
      resetForm();
      fetchCollections();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Collection deleted successfully' });
      fetchCollections();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete collection', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
    });
  };

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      image_url: collection.image_url || '',
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Organize products into collections</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingCollection(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Total Collections</div>
          <div className="text-2xl font-bold">{collections.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Active Collections</div>
          <div className="text-2xl font-bold">{collections.filter(c => c.is_active).length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-bold">{collections.reduce((sum, c) => sum + (c.product_count || 0), 0)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {collection.image_url && (
              <div className="h-48 bg-muted overflow-hidden">
                <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                </div>
                <Badge variant={collection.is_active ? 'default' : 'secondary'}>
                  {collection.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {collection.description && (
                <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Package className="h-4 w-4" />
                {collection.product_count || 0} products
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(collection)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(collection.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {collections.length === 0 && !loading && (
        <Card className="p-8 text-center text-muted-foreground">
          No collections yet. Create your first collection to organize your products.
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCollection ? 'Edit Collection' : 'Create Collection'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Featured Products"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this collection..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCollection ? 'Update' : 'Create'} Collection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Collections;
