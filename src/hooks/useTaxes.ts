import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  country: string | null;
  state: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTaxes = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTaxRates = async () => {
    try {
      const { data, error } = await supabase
        .from('tax_rates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTaxRates(data || []);
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
    fetchTaxRates();
  }, []);

  const createTaxRate = async (taxRate: Omit<TaxRate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tax_rates')
        .insert([taxRate])
        .select()
        .single();

      if (error) throw error;

      setTaxRates([data, ...taxRates]);
      toast({
        title: 'Success',
        description: 'Tax rate created successfully',
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

  const updateTaxRate = async (id: string, updates: Partial<TaxRate>) => {
    try {
      const { error } = await supabase
        .from('tax_rates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTaxRates(taxRates.map(t => t.id === id ? { ...t, ...updates } : t));
      toast({
        title: 'Success',
        description: 'Tax rate updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteTaxRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tax_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTaxRates(taxRates.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Tax rate deleted successfully',
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
    taxRates,
    loading,
    createTaxRate,
    updateTaxRate,
    deleteTaxRate,
    refreshTaxRates: fetchTaxRates,
  };
};