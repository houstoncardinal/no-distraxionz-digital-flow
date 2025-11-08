import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number | null;
  current_uses: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDiscounts = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts((data || []) as DiscountCode[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const createDiscount = async (discount: Omit<DiscountCode, 'id' | 'created_at' | 'updated_at' | 'current_uses'>) => {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .insert([discount])
        .select()
        .single();

      if (error) throw error;

      setDiscounts([data as DiscountCode, ...discounts]);
      toast({
        title: 'Success',
        description: 'Discount code created successfully',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateDiscount = async (id: string, updates: Partial<DiscountCode>) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setDiscounts(discounts.map(d => d.id === id ? { ...d, ...updates } : d));
      toast({
        title: 'Success',
        description: 'Discount code updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDiscounts(discounts.filter(d => d.id !== id));
      toast({
        title: 'Success',
        description: 'Discount code deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    discounts,
    loading,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    refreshDiscounts: fetchDiscounts,
  };
};