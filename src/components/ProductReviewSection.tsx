import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

interface ReviewFragment {
  id: string;
  product_id: string | null;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified_purchase: boolean;
  created_at: string | null;
}

const ratingLabels = ['Terrible', 'Needs Work', 'Okay', 'Great', 'Legendary'];

const ProductReviewSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewFragment[]>([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);

  const hasReviewed = useMemo(() => {
    if (!user) return false;
    return reviews.some((review) => review.customer_email === user.email);
  }, [reviews, user]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  const verifiedCount = reviews.filter((review) => review.verified_purchase).length;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast({
        title: 'Unable to load reviews',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user) {
        setIsVerifiedBuyer(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('order_items')
          .select('order_id, orders!inner(user_id, status)')
          .eq('product_id', productId)
          .eq('orders.user_id', user.id)
          .in('orders.status', ['processing', 'shipped', 'delivered', 'fulfilled']);

        setIsVerifiedBuyer(Boolean(data && data.length > 0));
      } catch (error) {
        setIsVerifiedBuyer(false);
      }
    };

    checkPurchase();
  }, [productId, user]);

  const renderStars = (ratingValue: number) =>
    Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-5 w-5 ${idx < ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Add a comment',
        description: 'Tell us what you think about this product.',
        variant: 'destructive',
      });
      return;
    }

    setFormSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        rating,
        title: title || null,
        comment,
        customer_name: user.user_metadata?.full_name || user.email || 'Guest',
        customer_email: user.email ?? 'guest@nodistraxionz.com',
        verified_purchase: isVerifiedBuyer,
        helpful_count: 0,
        admin_likes: 0,
        admin_response: null,
      });

      if (error) throw error;

      toast({
        title: 'Thank you',
        description: 'Your review is live and will help other customers.',
      });

      setTitle('');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: 'Unable to submit',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mt-16">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Customer Reviews</p>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-5xl font-semibold text-foreground">{averageRating || '—'}</span>
            <div>
              <div className="flex items-center gap-1">{renderStars(Math.round(averageRating || 0))}</div>
              <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs uppercase tracking-[0.3em]">
            {verifiedCount} verified buyer{verifiedCount === 1 ? '' : 's'}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">Rating</label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => {
              const value = idx + 1;
              return (
                <button
                  type="button"
                  key={value}
                  aria-label={`Set rating ${value}`}
                  onClick={() => setRating(value)}
                  className={`h-10 w-10 rounded-full border ${
                    value <= rating ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-gray-200 text-gray-400'
                  } flex items-center justify-center transition`}
                >
                  <Star className="h-4 w-4" />
                </button>
              );
            })}
            <span className="text-xs text-muted-foreground">{ratingLabels[rating - 1]}</span>
          </div>
        </div>
        <Input
          placeholder="Your review title (optional)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Textarea
          rows={4}
          placeholder="Tell us what you loved (or didn't) about the product"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <span>{isVerifiedBuyer ? 'Verified buyer' : 'Review will be marked as unverified'}</span>
          <span>{hasReviewed ? 'You already reviewed this product.' : 'Your voice shapes the brand.'}</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button type="submit" disabled={!user || hasReviewed || formSubmitting}>
            Submit Review
          </Button>
          {!user && (
            <span className="text-xs text-muted-foreground">Sign in to post a review.</span>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Be the first to review this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-gray-100 p-4 space-y-3 bg-gray-50/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{review.customer_name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                      {review.verified_purchase && <Badge variant="secondary" className="text-xs">Verified buyer</Badge>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                {review.title && <h3 className="text-base font-semibold">{review.title}</h3>}
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                {review.admin_response && (
                  <div className="rounded-2xl border border-primary/20 bg-white p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-[0.3em] text-primary">
                      <MessageSquare className="h-4 w-4" />
                      Brand Response
                    </div>
                    <p className="text-sm text-gray-700">{review.admin_response}</p>
                  </div>
                )}
                {review.admin_likes ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                    {review.admin_likes} likes from the team
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviewSection;
