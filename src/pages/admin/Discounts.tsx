import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Percent, DollarSign } from 'lucide-react';
import { useDiscounts } from '@/hooks/useDiscounts';

const Discounts = () => {
  const { discounts, loading, createDiscount, updateDiscount, deleteDiscount } = useDiscounts();
  const [isOpen, setIsOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_purchase_amount: 0,
    max_uses: null as number | null,
    starts_at: null as string | null,
    expires_at: null as string | null,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDiscount) {
      await updateDiscount(editingDiscount.id, formData);
    } else {
      await createDiscount(formData);
    }
    
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase_amount: 0,
      max_uses: null,
      starts_at: null,
      expires_at: null,
      is_active: true,
    });
    setEditingDiscount(null);
  };

  const handleEdit = (discount: any) => {
    setEditingDiscount(discount);
    setFormData(discount);
    setIsOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Discount Codes</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your store</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Create New Discount'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Discount Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select value={formData.discount_type} onValueChange={(value: any) => setFormData({ ...formData, discount_type: value })}>
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
                  placeholder="20% off your purchase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="min_purchase">Minimum Purchase</Label>
                  <Input
                    id="min_purchase"
                    type="number"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_uses">Max Uses (optional)</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses || ''}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at">Expires At (optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at || ''}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value || null })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDiscount ? 'Update' : 'Create'} Discount
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Uses</TableHead>
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
                    <div>
                      <div className="font-medium">{discount.code}</div>
                      {discount.description && (
                        <div className="text-sm text-muted-foreground">{discount.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {discount.discount_type === 'percentage' ? (
                      <div className="flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        <span>Percentage</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Fixed</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {discount.discount_type === 'percentage' 
                      ? `${discount.discount_value}%` 
                      : `$${discount.discount_value}`
                    }
                  </TableCell>
                  <TableCell>
                    {discount.max_uses 
                      ? `${discount.current_uses} / ${discount.max_uses}`
                      : `${discount.current_uses} / ∞`
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={discount.is_active ? 'default' : 'secondary'}>
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(discount)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteDiscount(discount.id)}>
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
    </div>
  );
};

export default Discounts;