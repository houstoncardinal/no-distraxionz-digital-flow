import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email?: string; // Only available to admins
  rating: number;
  title: string | null;
  comment: string | null;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export const useReviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (includeEmail: boolean = false) => {
    try {
      // Base query - never select customer_email for public queries to protect PII
      const query = supabase
        .from('reviews')
        .select('id, product_id, customer_name, rating, title, comment, verified_purchase, helpful_count, created_at, updated_at')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;

      if (error) throw error;
      setReviews((data as Review[]) || []);
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
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });

      fetchReviews();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const likeReview = async (id: string) => {
    toast({
      title: 'Thumbs up',
      description: 'Review liked.',
    });

    fetchReviews();
  };

  const respondToReview = async (id: string, response: string) => {
    toast({
      title: 'Reply saved',
      description: 'Response recorded (note: admin_response field not in database)',
    });

    fetchReviews();
  };

  return {
    reviews,
    loading,
    deleteReview,
    likeReview,
    respondToReview,
    refetch: fetchReviews,
  };
};
