import { supabase } from '@/integrations/supabase/client';

export const autoTuneFeaturedProducts = async () => {
  try {
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select('product_id, rating');

    if (reviewError) {
      throw reviewError;
    }

    const stats = new Map<string, { sum: number; count: number }>();

    (reviews || []).forEach((review) => {
      if (!review.product_id) return;
      const stat = stats.get(review.product_id) ?? { sum: 0, count: 0 };
      stat.sum += review.rating ?? 0;
      stat.count += 1;
      stats.set(review.product_id, stat);
    });

    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, featured');

    if (productError) {
      throw productError;
    }

    const toPromote: string[] = [];
    const toDemote: string[] = [];

    (products || []).forEach((product) => {
      const stat = stats.get(product.id);
      if (stat) {
        const avg = stat.sum / stat.count;
        if (avg >= 4.5 && stat.count >= 3 && !product.featured) {
          toPromote.push(product.id);
        }
        if (avg < 3 && product.featured) {
          toDemote.push(product.id);
        }
      } else if (product.featured) {
        toDemote.push(product.id);
      }
    });

    const updates = [];
    if (toPromote.length) {
      updates.push(supabase.from('products').update({ featured: true }).in('id', toPromote));
    }

    if (toDemote.length) {
      updates.push(supabase.from('products').update({ featured: false }).in('id', toDemote));
    }

    if (updates.length) {
      await Promise.all(updates);
    }

    return {
      promoted: toPromote.length,
      demoted: toDemote.length,
    };
  } catch (error) {
    console.error('autoTuneFeaturedProducts error', error);
    return { promoted: 0, demoted: 0, error: (error as Error).message };
  }
};
