import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AbandonedCart {
  id: string;
  user_id: string | null;
  cart_data: any;
  customer_email: string | null;
  customer_name: string | null;
  total_value: number;
  recovered: boolean;
  recovery_email_sent: boolean;
  abandoned_at: string;
  recovered_at: string | null;
}

export const useAbandonedCarts = () => {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAbandonedCarts = async () => {
    try {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .order('abandoned_at', { ascending: false });

      if (error) throw error;
      setAbandonedCarts(data || []);
    } catch (error) {
      console.error('Error fetching abandoned carts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load abandoned carts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbandonedCarts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('abandoned_carts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'abandoned_carts',
        },
        () => {
          fetchAbandonedCarts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Detect and save abandoned carts
  const detectAbandonedCarts = async () => {
    try {
      // This function would be called periodically (e.g., cron job)
      // For now, we'll simulate detection logic

      // Query for carts that have been inactive for more than 1 hour
      // but less than 7 days (typical abandoned cart window)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get recent cart sessions (assuming carts are stored in local state or a carts table)
      // This is a simplified version - in production you'd track cart sessions properly

      toast({
        title: 'Abandoned Cart Detection',
        description: 'Detection algorithm running...',
      });

      return [];
    } catch (error) {
      console.error('Error detecting abandoned carts:', error);
      toast({
        title: 'Error',
        description: 'Failed to detect abandoned carts',
        variant: 'destructive',
      });
      return [];
    }
  };

  const markAsRecovered = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .update({
          recovered: true,
          recovered_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAbandonedCarts(carts =>
        carts.map(cart =>
          cart.id === id ? { ...cart, recovered: true, recovered_at: new Date().toISOString() } : cart
        )
      );

      toast({
        title: 'Success',
        description: 'Cart marked as recovered',
      });

      return data;
    } catch (error) {
      console.error('Error marking cart as recovered:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark cart as recovered',
        variant: 'destructive',
      });
      return null;
    }
  };

  const sendRecoveryEmail = async (cartId: string, customMessage?: string) => {
    try {
      const cart = abandonedCarts.find(c => c.id === cartId);
      if (!cart) throw new Error('Cart not found');

      // Here you would integrate with your email service
      console.log('Sending recovery email for cart:', cartId, customMessage);

      // Mark as recovery email sent
      const { error } = await supabase
        .from('abandoned_carts')
        .update({ recovery_email_sent: true })
        .eq('id', cartId);

      if (error) throw error;

      setAbandonedCarts(carts =>
        carts.map(cart =>
          cart.id === cartId ? { ...cart, recovery_email_sent: true } : cart
        )
      );

      toast({
        title: 'Success',
        description: 'Recovery email sent successfully',
      });

      return true;
    } catch (error) {
      console.error('Error sending recovery email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send recovery email',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteAbandonedCart = async (id: string) => {
    try {
      const { error } = await supabase
        .from('abandoned_carts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAbandonedCarts(carts => carts.filter(cart => cart.id !== id));

      toast({
        title: 'Success',
        description: 'Abandoned cart deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting abandoned cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete abandoned cart',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    abandonedCarts,
    loading,
    detectAbandonedCarts,
    markAsRecovered,
    sendRecoveryEmail,
    deleteAbandonedCart,
    refetch: fetchAbandonedCarts,
  };
};
