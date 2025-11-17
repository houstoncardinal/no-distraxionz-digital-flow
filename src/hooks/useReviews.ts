import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  admin_response: string | null;
  admin_likes: number | null;
}

export const useReviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
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
    try {
      const target = reviews.find((review) => review.id === id);
      const nextLikes = (target?.admin_likes ?? 0) + 1;
      const { error } = await supabase
        .from('reviews')
        .update({ admin_likes: nextLikes })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Thumbs up',
        description: 'Review like recorded.',
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

  const respondToReview = async (id: string, response: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ admin_response: response })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Reply saved',
        description: 'The customer will see your response momentarily.',
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

  return {
    reviews,
    loading,
    deleteReview,
    likeReview,
    respondToReview,
    refetch: fetchReviews,
  };
};
