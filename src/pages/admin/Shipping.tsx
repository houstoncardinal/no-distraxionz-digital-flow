import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Truck, Edit, Trash2, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ShippingZone {
  id: string;
  name: string;
  countries: any;
  rates: any;
  is_active: boolean;
}

const Shipping = () => {
  const { toast } = useToast();
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    countries: '[]',
    rates: '[]',
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setZones(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load shipping zones', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .insert([{
          name: formData.name,
          countries: JSON.parse(formData.countries),
          rates: JSON.parse(formData.rates),
          is_active: true,
        }]);
      if (error) throw error;
      toast({ title: 'Success', description: 'Shipping zone created' });
      setDialogOpen(false);
      fetchZones();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('shipping_zones').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Zone deleted' });
      fetchZones();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shipping Settings</h1>
          <p className="text-muted-foreground">Configure shipping zones and rates</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Shipping Zones</p>
              <p className="text-2xl font-bold">{zones.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
          <p className="text-2xl font-bold">3-5 days</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
          <p className="text-2xl font-bold">96%</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No shipping zones configured
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">{zone.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={zone.is_active ? 'default' : 'secondary'}>
                      {zone.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(zone.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shipping Zone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Zone Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="North America"
                  required
                />
              </div>
              <div>
                <Label htmlFor="countries">Countries (JSON)</Label>
                <Input
                  id="countries"
                  value={formData.countries}
                  onChange={(e) => setFormData({ ...formData, countries: e.target.value })}
                  placeholder='["US", "CA"]'
                />
              </div>
              <div>
                <Label htmlFor="rates">Rates (JSON)</Label>
                <Input
                  id="rates"
                  value={formData.rates}
                  onChange={(e) => setFormData({ ...formData, rates: e.target.value })}
                  placeholder='[{"name": "Standard", "price": 5.99}]'
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Zone</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shipping;
