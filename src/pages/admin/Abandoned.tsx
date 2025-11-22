import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  ShoppingCart,
  Mail,
  Clock,
  DollarSign,
  TrendingUp,
  Send,
  Trash2,
  Eye,
  Loader2,
  RefreshCw,
  Target,
} from 'lucide-react';
import { useAbandonedCarts, AbandonedCart } from '@/hooks/useAbandonedCarts';
import { format } from 'date-fns';

const Abandoned = () => {
  const {
    abandonedCarts,
    loading,
    detectAbandonedCarts,
    markAsRecovered,
    sendRecoveryEmail,
    deleteAbandonedCart,
  } = useAbandonedCarts();

  const [query, setQuery] = useState('');
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [customEmailMessage, setCustomEmailMessage] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const filteredCarts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return abandonedCarts;
    return abandonedCarts.filter((cart) =>
      [cart.customer_name, cart.customer_email, cart.id].some(
        (field) => field?.toLowerCase().includes(q)
      )
    );
  }, [abandonedCarts, query]);

  const stats = useMemo(() => {
    const totalValue = abandonedCarts.reduce((sum, cart) => sum + Number(cart.total_value), 0);
    const recoveredValue = abandonedCarts
      .filter(cart => cart.recovered)
      .reduce((sum, cart) => sum + Number(cart.total_value), 0);
    const recoveryRate = totalValue > 0 ? (recoveredValue / totalValue) * 100 : 0;

    return {
      totalCarts: abandonedCarts.length,
      totalValue,
      recoveredValue,
      recoveryRate,
      recentCarts: abandonedCarts.filter(cart => {
        const abandonedDate = new Date(cart.abandoned_at);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return abandonedDate > sevenDaysAgo;
      }).length,
    };
  }, [abandonedCarts]);

  const handleViewDetails = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setCustomEmailMessage('');
    setDetailsOpen(true);
  };

  const handleMarkRecovered = async (cartId: string) => {
    await markAsRecovered(cartId);
  };

  const handleSendRecoveryEmail = async (cartId: string, customMessage?: string) => {
    await sendRecoveryEmail(cartId, customMessage);
  };

  const handleDelete = async (cartId: string) => {
    await deleteAbandonedCart(cartId);
  };

  const handleDetectCarts = async () => {
    setIsDetecting(true);
    try {
      await detectAbandonedCarts();
    } finally {
      setIsDetecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Abandoned Carts</h1>
          <p className="text-muted-foreground">Recover lost sales from abandoned shopping carts</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleDetectCarts} disabled={isDetecting} variant="outline">
            {isDetecting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Detect Carts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Abandoned</p>
              <p className="text-2xl font-bold">{stats.totalCarts}</p>
              <p className="text-xs text-muted-foreground">{stats.recentCarts} in last 7 days</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">${stats.recoveredValue.toFixed(2)} recovered</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recovery Rate</p>
              <p className="text-2xl font-bold">{stats.recoveryRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">potential revenue</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Cart Value</p>
              <p className="text-2xl font-bold">
                ${stats.totalCarts > 0 ? (stats.totalValue / stats.totalCarts).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-muted-foreground">per abandoned cart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search abandoned carts…"
          className="pl-7 h-8"
        />
      </div>

      {/* Carts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b text-xs text-muted-foreground">
          {filteredCarts.length} {filteredCarts.length === 1 ? 'abandoned cart' : 'abandoned carts'}
        </div>
        <div className="p-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Cart Value</TableHead>
                <TableHead className="text-xs">Abandoned</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-center text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No abandoned carts found. Run detection to find abandoned carts.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCarts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">
                          {cart.customer_name || 'Anonymous'}
                        </div>
                        {cart.customer_email && (
                          <div className="text-xs text-muted-foreground">
                            {cart.customer_email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ${Number(cart.total_value).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(cart.abandoned_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {cart.recovered ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Recovered
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Abandoned
                          </Badge>
                        )}
                        {cart.recovery_email_sent && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                            Email Sent
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(cart)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {!cart.recovered && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkRecovered(cart.id)}
                          >
                            <Target className="h-3 w-3" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete abandoned cart?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The abandoned cart will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cart.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Cart Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Abandoned Cart Details
            </DialogTitle>
          </DialogHeader>

          {selectedCart && (
            <div className="space-y-6">
              {/* Cart Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <div className="text-sm">{selectedCart.customer_name || 'Anonymous'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <div className="text-sm">{selectedCart.customer_email || 'Not provided'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Abandoned At</Label>
                      <div className="text-sm flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {format(new Date(selectedCart.abandoned_at), 'PPpp')}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Recovery Email Sent</Label>
                      <div className="text-sm">
                        {selectedCart.recovery_email_sent ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Cart Summary</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Total Value</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ${Number(selectedCart.total_value).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        {selectedCart.recovered ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Recovered
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Abandoned
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedCart.recovered && selectedCart.recovered_at && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Recovered At</Label>
                        <div className="text-sm">
                          {format(new Date(selectedCart.recovered_at), 'PPpp')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <h3 className="font-medium mb-3">Cart Items</h3>
                <Card className="p-4">
                  {selectedCart.cart_data ? (
                    <div className="text-sm">
                      <pre className="whitespace-pre-wrap bg-muted/30 p-3 rounded">
                        {JSON.stringify(selectedCart.cart_data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Cart data not available
                    </div>
                  )}
                </Card>
              </div>

              {/* Recovery Actions */}
              {!selectedCart.recovered && (
                <div className="space-y-4">
                  <h3 className="font-medium">Recovery Actions</h3>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="recoveryMessage">Custom Recovery Message</Label>
                      <Textarea
                        id="recoveryMessage"
                        value={customEmailMessage}
                        onChange={(e) => setCustomEmailMessage(e.target.value)}
                        placeholder="Enter personalized message to encourage completion..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSendRecoveryEmail(selectedCart.id, customEmailMessage)}
                        disabled={selectedCart.recovery_email_sent}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedCart.recovery_email_sent ? 'Recovery Email Sent' : 'Send Recovery Email'}
                      </Button>

                      <Button
                        onClick={() => handleMarkRecovered(selectedCart.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Mark as Recovered
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Abandoned;
