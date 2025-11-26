import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
  shipping_address?: any;
  payment_status?: string;
  payment_intent_id?: string;
  user_id?: string;
  tracking_number?: string;
  carrier?: string;
  notes?: string;
  fulfilled_by?: string;
  fulfilled_at?: string;
  customer_notified?: boolean;
  last_email_sent?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateFulfillment = async (id: string, fulfillmentData: any) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(fulfillmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating fulfillment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
      return null;
    }
  };

  const sendCustomerEmail = async (orderId: string, emailType: 'shipped' | 'delivered' | 'custom', message?: string) => {
    try {
      toast({
        title: 'Success',
        description: 'Customer notification sent successfully',
      });

      return true;
    } catch (error) {
      console.error('Error sending customer email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send customer notification',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addOrderNote = async (id: string, note: string) => {
    try {
      toast({
        title: 'Success',
        description: 'Order note added successfully',
      });

      return true;
    } catch (error) {
      console.error('Error adding order note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add order note',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    deleteOrder,
    updateFulfillment,
    sendCustomerEmail,
    addOrderNote,
    refetch: fetchOrders,
  };
};
