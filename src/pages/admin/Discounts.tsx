import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Copy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number | null;
  current_uses: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const Discounts = () => {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase_amount: '0',
    max_uses: '',
    starts_at: '',
    expires_at: '',
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data as DiscountCode[] || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load discounts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_purchase_amount: parseFloat(formData.min_purchase_amount) || 0,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      starts_at: formData.starts_at || null,
      expires_at: formData.expires_at || null,
      is_active: true,
    };

    try {
      if (editingDiscount) {
        const { error } = await supabase
          .from('discount_codes')
          .update(discountData)
          .eq('id', editingDiscount.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Discount updated successfully' });
      } else {
        const { error } = await supabase
          .from('discount_codes')
          .insert([discountData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Discount created successfully' });
      }
      
      setDialogOpen(false);
      setEditingDiscount(null);
      resetForm();
      fetchDiscounts();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Discount deleted successfully' });
      fetchDiscounts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete discount', variant: 'destructive' });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !isActive })
        .eq('id', id);
      if (error) throw error;
      fetchDiscounts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: 'Discount code copied to clipboard' });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase_amount: '0',
      max_uses: '',
      starts_at: '',
      expires_at: '',
    });
  };

  const openEditDialog = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      description: discount.description || '',
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
      min_purchase_amount: discount.min_purchase_amount.toString(),
      max_uses: discount.max_uses?.toString() || '',
      starts_at: discount.starts_at ? format(new Date(discount.starts_at), "yyyy-MM-dd'T'HH:mm") : '',
      expires_at: discount.expires_at ? format(new Date(discount.expires_at), "yyyy-MM-dd'T'HH:mm") : '',
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Discount Codes</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your store</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingDiscount(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Discount
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Total Codes</div>
          <div className="text-2xl font-bold">{discounts.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold">{discounts.filter(d => d.is_active).length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Total Uses</div>
          <div className="text-2xl font-bold">{discounts.reduce((sum, d) => sum + d.current_uses, 0)}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground">Expired</div>
          <div className="text-2xl font-bold">
            {discounts.filter(d => d.expires_at && new Date(d.expires_at) < new Date()).length}
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No discount codes yet. Create your first discount to boost sales.
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold">{discount.code}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(discount.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {discount.description && (
                      <div className="text-xs text-muted-foreground">{discount.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {discount.discount_type === 'percentage' 
                        ? `${discount.discount_value}%` 
                        : `$${discount.discount_value}`} off
                    </div>
                    {discount.min_purchase_amount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Min: ${discount.min_purchase_amount}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {discount.current_uses} / {discount.max_uses || '∞'}
                  </TableCell>
                  <TableCell>
                    {discount.expires_at ? (
                      <div className="text-sm">
                        {new Date(discount.expires_at) > new Date() ? (
                          <>Until {format(new Date(discount.expires_at), 'MMM dd, yyyy')}</>
                        ) : (
                          <span className="text-red-600">Expired</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No expiry</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={discount.is_active ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleActive(discount.id, discount.is_active)}
                    >
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(discount)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(discount.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
            <DialogDescription>Configure your discount code settings</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Discount Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER25"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount_type">Type</Label>
                  <Select value={formData.discount_type} onValueChange={(value) => setFormData({ ...formData, discount_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summer sale discount"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === 'percentage' ? '25' : '10.00'}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="min_purchase_amount">Min Purchase Amount</Label>
                  <Input
                    id="min_purchase_amount"
                    type="number"
                    step="0.01"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_uses">Max Uses (optional)</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="starts_at">Start Date (optional)</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDiscount ? 'Update' : 'Create'} Discount
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discounts;
