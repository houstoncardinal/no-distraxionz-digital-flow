import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import ProductPopulator from '@/components/ProductPopulator';
import { SystemStatus } from '@/components/admin/SystemStatus';
import { StripeTesting } from '@/components/admin/StripeTesting';
import { supabase } from '@/integrations/supabase/client';
import { generateProductListingFromFiles } from '@/utils/aiProductComposer';
import {
  CloudUpload,
  Loader2,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AutoProductDraft {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string[];
  slug?: string;
  schemaData?: Record<string, unknown>;
  imageUrls?: string[];
}

interface DashboardStats {
  orders24h: number;
  revenue: number;
  products: number;
  customers: number;
}

const heroStatButtonClass =
  'group relative w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/5 to-slate-900/30 px-5 py-6 text-left text-white transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/70 focus-visible:outline-offset-2';

const highlightButtonClass =
  'group w-full rounded-2xl border border-border/60 bg-muted/30 p-4 text-left text-sm font-semibold text-foreground transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/70 focus-visible:outline-offset-2';

const orderStatusButtonClass =
  'group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/80 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/70 focus-visible:outline-offset-2';

const bigCardInteractiveClass =
  'cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/70 focus-visible:outline-offset-2';

const productHighlights = [
  'Central catalog intelligence with metadata verification',
  'Automatic low-stock alerts and featured rotation',
  'Live image-backed product builder with AI descriptions',
];

const orderStatuses = [
  { label: 'Awaiting payment', detail: 'Hold until cleared', key: 'pending' },
  { label: 'Processing', detail: 'Picking & packing', key: 'processing' },
  { label: 'Ready to ship', detail: 'Batch shipping today', key: 'shipped' },
  { label: 'Fulfilled', detail: 'Shipped in last 24h', key: 'delivered' },
];

const initialOrderCounts = orderStatuses.reduce<Record<string, number>>((acc, status) => {
  acc[status.key] = 0;
  return acc;
}, {});

const AdminDashboard = () => {
  const [drafts, setDrafts] = useState<AutoProductDraft[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    orders24h: 0,
    revenue: 0,
    products: 0,
    customers: 0,
  });
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>(initialOrderCounts);
  const [loadingStats, setLoadingStats] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState('AI product listings are ready for review.');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const analysisController = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const heroStats = useMemo(
    () => [
      {
        label: 'Orders (24h)',
        value: loadingStats ? '…' : stats.orders24h.toString(),
        detail: 'Last 24 hours',
      },
      {
        label: 'Revenue',
        value: loadingStats ? '…' : `$${stats.revenue.toFixed(2)}`,
        detail: 'Last 24 hours',
      },
      {
        label: 'Products in catalog',
        value: loadingStats ? '…' : stats.products.toString(),
        detail: 'Live catalog',
      },
      {
        label: 'Customers',
        value: loadingStats ? '…' : stats.customers.toString(),
        detail: 'Active profiles',
      },
    ],
    [stats, loadingStats],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardMetrics = async () => {
      setLoadingStats(true);
      try {
        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const recentOrdersRes = await supabase
          .from('orders')
          .select('total_amount', { count: 'exact' })
          .gte('created_at', since24h);

        if (recentOrdersRes.error) {
          throw recentOrdersRes.error;
        }

        const recentOrders = recentOrdersRes.data ?? [];
        const orders24h = recentOrders.length;
        const revenue = recentOrders.reduce((sum, order) => sum + (order.total_amount ?? 0), 0);

        const productCountRes = await supabase
          .from('products')
          .select('*', { head: true, count: 'exact' });

        const customerCountRes = await supabase
          .from('profiles')
          .select('*', { head: true, count: 'exact' });

        const statusCounts = await Promise.all(
          orderStatuses.map((status) =>
            supabase
              .from('orders')
              .select('id', { head: true, count: 'exact' })
              .eq('status', status.key),
          ),
        );

        const statusMap: Record<string, number> = {};
        statusCounts.forEach((result, index) => {
          const key = orderStatuses[index].key;
          if (result.error) {
            console.error('Error counting orders for status', key, result.error);
            statusMap[key] = 0;
            return;
          }
          statusMap[key] = result.count ?? 0;
        });

        if (!isMounted) return;

        setStats({
          orders24h,
          revenue,
          products: productCountRes.count ?? 0,
          customers: customerCountRes.count ?? 0,
        });
        setOrderCounts(statusMap);
        try {
          const result = await autoTuneFeaturedProducts();
          console.info('Self-healing run', result);
        } catch (error) {
          console.warn('Self-healing failed', error);
        }
      } catch (error) {
        console.error('Unable to load dashboard metrics', error);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    fetchDashboardMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFiles.length) {
      setAnalysisSummary('Upload images to trigger AI product creation.');
      return;
    }

    analysisController.current?.abort();
    const controller = new AbortController();
    analysisController.current = controller;

    const runAIAnalysis = async () => {
      setAnalysisLoading(true);
      try {
        const aiResult = await generateProductListingFromFiles(selectedFiles, controller.signal);
        if (controller.signal.aborted) return;

        const aiDrafts = aiResult.listings.map((listing, index) => ({
          id: listing.slug || `ai-${index}`,
          title: listing.title,
          category: listing.category || 'AI Collection',
          price: typeof listing.price === 'number' ? listing.price.toFixed(2) : listing.price,
          description: listing.description,
          metaTitle: listing.metaTitle,
          metaDescription: listing.metaDescription,
          seoKeywords: listing.keywords,
          slug: listing.slug,
          schemaData: listing.schema,
          imageUrls: listing.images,
        }));

        if (aiDrafts.length > 0) {
          setDrafts(aiDrafts);
        }
        setAnalysisSummary(aiResult.summary);
      } catch (error) {
        if ((error as any)?.name === 'AbortError') return;
        console.error('AI analysis error', error);
        setAnalysisSummary('AI analysis failed. Try again or use manual drafts.');
      } finally {
        if (!controller.signal.aborted) {
          setAnalysisLoading(false);
        }
      }
    };

    runAIAnalysis();

    return () => {
      controller.abort();
    };
  }, [selectedFiles]);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);

    const vibes = ['Signature', 'Street', 'Heritage', 'Elemental'];
    const generated = files.map((file, index) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
      const mood = vibes[index % vibes.length];
      return {
        id: `${file.name}-${index}`,
        title: `${cleanName}`,
        category: `${mood} Collection`,
        price: (38 + index * 4).toFixed(2),
        description: `Auto-generated listing inspired by the ${mood.toLowerCase()} story of ${cleanName}. Perfect fit, premium texture, no guesswork.`,
      };
    });

    setDrafts(generated);
  };

  const handleDraftChange = (id: string, field: keyof AutoProductDraft, value: string) => {
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === id ? { ...draft, [field]: value } : draft)),
    );
  };

  const handleCardAction = (label: string) => {
    if (orderStatuses.some((status) => status.label === label)) {
      navigate('/admin/orders');
      return;
    }

    if (label.includes('Orders')) {
      navigate('/admin/orders');
      return;
    }

    if (label.includes('Revenue')) {
      navigate('/admin/analytics');
      return;
    }

    if (label.includes('Customers')) {
      navigate('/admin/customers');
      return;
    }

    if (label.toLowerCase().includes('product') || label.toLowerCase().includes('catalog')) {
      navigate('/admin/products');
      return;
    }

    navigate('/admin');
  };

  const handleInteractiveKeyDown = (
    event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
    label: string,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardAction(label);
    }
  };

  const handleUploadCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleQuickAction = (path: string) => () => navigate(path);

  const handleQueueReview = () => {
    if (drafts.length === 0) {
      handleUploadCardClick();
      return;
    }
    navigate('/admin/products');
  };

  const handleClearSelections = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDrafts([]);
    setSelectedFiles([]);
  };

  const filesSummary = selectedFiles.length
    ? `${selectedFiles.slice(0, 3).map((file) => file.name).join(' • ')}${
        selectedFiles.length > 3 ? ` • +${selectedFiles.length - 3} more` : ''
      }`
    : 'No images selected yet';

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/80 p-8 shadow-2xl shadow-black/40 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.4em] leading-none">
              Commerce HQ
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Admin Dashboard
            </h1>
            <p className="text-sm text-white/70">
              Prioritize your catalog, orders, and automation in a single confident workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              className="bg-white/90 text-slate-900 hover:bg-white"
              onClick={handleQuickAction('/admin/products')}
            >
              Manage products
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white"
              onClick={handleQuickAction('/admin/orders')}
            >
              Review orders
            </Button>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white" onClick={handleUploadCardClick}>
              Bulk AI upload
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {heroStats.map((stat) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => handleCardAction(stat.label)}
              onKeyDown={(event) => handleInteractiveKeyDown(event, stat.label)}
              className={heroStatButtonClass}
              aria-label={`View ${stat.label}`}
            >
              <div className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition duration-500 group-hover:opacity-60" />
              <div className="relative space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{stat.label}</p>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  {stat.detail}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
        <Card
          role="button"
          tabIndex={0}
          aria-label="Product management hub"
          onClick={() => handleCardAction('Product Management Hub')}
          onKeyDown={(event) => handleInteractiveKeyDown(event, 'Product Management Hub')}
          className={`rounded-[30px] border border-border/60 bg-background/60 p-6 shadow-xl shadow-slate-900/40 ${bigCardInteractiveClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Focus</p>
              <h2 className="mt-1 text-2xl font-semibold">Product Management Hub</h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to publish, preview, and maintain an accurate catalog.
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {productHighlights.map((highlight, index) => (
              <button
                key={highlight}
                type="button"
                onClick={() => handleCardAction(highlight)}
                onKeyDown={(event) => handleInteractiveKeyDown(event, highlight)}
                className={highlightButtonClass}
                aria-label={`Highlight: ${highlight}`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>{index + 1}</span>
                </div>
                <p className="mt-3 text-sm leading-snug text-muted-foreground">{highlight}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="sm" className="h-10 rounded-2xl bg-primary/90 text-white hover:bg-primary" onClick={handleQuickAction('/admin/products')}>
              Add new product
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-primary/30 text-primary"
              onClick={handleQuickAction('/admin/inventory')}
            >
              View catalog integrity
            </Button>
            <Button variant="ghost" size="sm" className="h-10 rounded-2xl text-muted-foreground" onClick={handleQuickAction('/admin/products')}>
              Track featured drops
            </Button>
          </div>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          aria-label="Order command center"
          onClick={() => handleCardAction('Order Command Center')}
          onKeyDown={(event) => handleInteractiveKeyDown(event, 'Order Command Center')}
          className={`rounded-[30px] border border-border/60 bg-background/60 p-6 shadow-xl shadow-slate-900/40 ${bigCardInteractiveClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Priority</p>
              <h2 className="mt-1 text-2xl font-semibold">Order Command Center</h2>
              <p className="text-sm text-muted-foreground">Monitor fulfillment stages without leaving this panel.</p>
            </div>
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>

          <div className="mt-6 space-y-4">
            {orderStatuses.map((status) => (
              <button
                key={status.label}
                type="button"
                onClick={() => handleCardAction(status.label)}
                onKeyDown={(event) => handleInteractiveKeyDown(event, status.label)}
                className={orderStatusButtonClass}
                aria-label={`Order status: ${status.label}`}
              >
                <div>
                  <p className="text-sm font-semibold">{status.label}</p>
                  <p className="text-xs text-muted-foreground">{status.detail}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Badge className="rounded-full border border-border/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-primary">
                    {loadingStats ? '…' : orderCounts[status.key] ?? 0}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Fulfillment pace</p>
              <p className="text-xs text-muted-foreground">96% on-time</p>
            </div>
            <Progress value={96} className="mt-2 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">Package tracking integrated with shipping carriers.</p>
          </div>
        </Card>
      </div>

      <Card className="rounded-[30px] border border-border/70 bg-background/70 p-6 shadow-2xl shadow-slate-900/30">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">AI Assisted Uploads</p>
            <h2 className="text-2xl font-semibold">Bulk Product Upload</h2>
            <p className="text-sm text-muted-foreground">
              Drop multiple product images and let the system draft listings. Review, edit, and approve before publishing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="h-10 rounded-2xl border-border/60 text-muted-foreground"
              onClick={handleUploadCardClick}
            >
              Upload images
            </Button>
            <Badge className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary">
              Image-to-product
            </Badge>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-border/40 bg-muted/10 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {analysisLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Sparkles className="h-4 w-4 text-primary" />
            )}
            <span>{analysisLoading ? 'Analyzing images with OpenAI…' : 'AI insights ready'}</span>
          </div>
          <p className="max-w-2xl text-[11px] leading-tight text-muted-foreground">{analysisSummary}</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <label className="flex min-h-[220px] flex-col justify-center gap-3 rounded-3xl border-2 border-dashed border-border/60 bg-muted/10 p-6 text-center transition hover:border-primary">
            <CloudUpload className="mx-auto h-10 w-10 text-primary" />
            <span className="text-base font-semibold">Drag & drop or browse</span>
            <span className="text-xs text-muted-foreground">PNG, JPG, or HEIC · Up to 20 files · High resolution encouraged</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleFileSelection}
              ref={fileInputRef}
            />
            <p className="text-xs text-muted-foreground">Selected: {filesSummary}</p>
          </label>

          <div className="space-y-4 rounded-3xl border border-border/60 bg-muted/10 p-4">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                <p>No drafts yet.</p>
                <p>Upload images to auto-generate product titles, categories, descriptions, and prices.</p>
              </div>
            ) : (
              drafts.map((draft, index) => (
                <div
                  key={draft.id}
                  className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm shadow-black/10"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Draft #{index + 1}</p>
                    <Badge className="rounded-full border border-border/50 bg-border/20 px-3 py-0.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      AI draft
                    </Badge>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Title</p>
                      <Input
                        value={draft.title}
                        onChange={(event) => handleDraftChange(draft.id, 'title', event.target.value)}
                        className="mt-1 text-sm"
                        placeholder="Product title"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Category</p>
                      <Input
                        value={draft.category}
                        onChange={(event) => handleDraftChange(draft.id, 'category', event.target.value)}
                        className="mt-1 text-sm"
                        placeholder="Category e.g. Lifestyle Apparel"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Price</p>
                      <Input
                        value={draft.price}
                        onChange={(event) => handleDraftChange(draft.id, 'price', event.target.value)}
                        className="mt-1 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Description</p>
                      <Textarea
                        value={draft.description}
                        onChange={(event) => handleDraftChange(draft.id, 'description', event.target.value)}
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
            {drafts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="h-10 rounded-2xl bg-primary text-white hover:bg-primary/90"
              onClick={handleQueueReview}
              disabled={analysisLoading}
            >
              Queue for review
            </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-2xl border-border/60 text-muted-foreground"
                  onClick={handleClearSelections}
                >
                  Clear selections
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">System health</p>
            <h2 className="text-2xl font-semibold">Supabase Integration Status</h2>
          </div>
          <Badge className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary">
            Connected
          </Badge>
        </div>
        <SystemStatus />
      </section>

      {/* Stripe Testing */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Payment testing</p>
            <h2 className="text-2xl font-semibold">Stripe Sandbox Testing</h2>
          </div>
          <Badge className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary">
            Sandbox Mode
          </Badge>
        </div>
        <StripeTesting />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Shotgun import</p>
            <h2 className="text-2xl font-semibold">Legacy product sync</h2>
          </div>
          <Badge className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary">
            Optional
          </Badge>
        </div>
        <ProductPopulator />
      </section>
    </div>
  );
};

export default AdminDashboard;
