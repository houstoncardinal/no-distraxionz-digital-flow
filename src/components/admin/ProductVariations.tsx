import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ProductVariation {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductVariationsProps {
  variations: ProductVariation[];
  onChange: (variations: ProductVariation[]) => void;
}

export const ProductVariations = ({ variations, onChange }: ProductVariationsProps) => {
  const [newVariation, setNewVariation] = useState<ProductVariation>({
    name: '',
    sku: '',
    price: '',
    stock: 0,
    attributes: {},
  });

  const addVariation = () => {
    if (!newVariation.name || !newVariation.sku || !newVariation.price) {
      return;
    }

    onChange([...variations, { ...newVariation, id: Math.random().toString() }]);
    setNewVariation({
      name: '',
      sku: '',
      price: '',
      stock: 0,
      attributes: {},
    });
  };

  const removeVariation = (index: number) => {
    onChange(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <Label className="text-sm font-medium">Product Variations</Label>
        </div>
        <span className="text-xs text-muted-foreground">
          {variations.length} variation(s)
        </span>
      </div>

      {/* Existing Variations */}
      {variations.length > 0 && (
        <Card className="p-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">SKU</TableHead>
                  <TableHead className="text-xs">Price</TableHead>
                  <TableHead className="text-xs">Stock</TableHead>
                  <TableHead className="text-xs w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variations.map((variation, index) => (
                  <TableRow key={variation.id || index}>
                    <TableCell>
                      <Input
                        value={variation.name}
                        onChange={(e) => updateVariation(index, 'name', e.target.value)}
                        className="h-8 text-sm"
                        placeholder="e.g. Black / M"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={variation.sku}
                        onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                        className="h-8 text-sm font-mono"
                        placeholder="SKU-001"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={variation.price}
                        onChange={(e) => updateVariation(index, 'price', e.target.value)}
                        className="h-8 text-sm"
                        placeholder="49.99"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={variation.stock}
                        onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value))
                        }
                        className="h-8 text-sm"
                        placeholder="100"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeVariation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add New Variation */}
      <Card className="p-4 bg-muted/30">
        <div className="space-y-3">
          <Label className="text-xs font-medium">Add Variation</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Name (e.g. Black / M)"
              value={newVariation.name}
              onChange={(e) => setNewVariation({ ...newVariation, name: e.target.value })}
              className="h-9 text-sm"
            />
            <Input
              placeholder="SKU"
              value={newVariation.sku}
              onChange={(e) => setNewVariation({ ...newVariation, sku: e.target.value })}
              className="h-9 text-sm font-mono"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newVariation.price}
              onChange={(e) => setNewVariation({ ...newVariation, price: e.target.value })}
              className="h-9 text-sm"
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newVariation.stock}
              onChange={(e) => setNewVariation({ ...newVariation, stock: parseInt(e.target.value) || 0 })}
              className="h-9 text-sm"
            />
          </div>
          <Button
            type="button"
            onClick={addVariation}
            className="w-full md:w-auto gap-2 h-9"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Variation
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Add variations for size, color, or other attributes. Each variation can have its own price and stock level.
      </p>
    </div>
  );
};
