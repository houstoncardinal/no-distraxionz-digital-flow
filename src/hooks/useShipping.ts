import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ShippingZone {
  id: string;
  name: string;
  countries: any;
  rates: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useShipping = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setZones(data || []);
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
    fetchZones();
  }, []);

  const createZone = async (zone: Omit<ShippingZone, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('shipping_zones')
        .insert([zone])
        .select()
        .single();

      if (error) throw error;

      setZones([data, ...zones]);
      toast({
        title: 'Success',
        description: 'Shipping zone created successfully',
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

  const updateZone = async (id: string, updates: Partial<ShippingZone>) => {
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setZones(zones.map(z => z.id === id ? { ...z, ...updates } : z));
      toast({
        title: 'Success',
        description: 'Shipping zone updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteZone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setZones(zones.filter(z => z.id !== id));
      toast({
        title: 'Success',
        description: 'Shipping zone deleted successfully',
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
    zones,
    loading,
    createZone,
    updateZone,
    deleteZone,
    refreshZones: fetchZones,
  };
};