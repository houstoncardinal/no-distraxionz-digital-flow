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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Eye,
  Trash2,
  Loader2,
  Package,
  Truck,
  MessageSquare,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Send,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { useOrders, Order } from '@/hooks/useOrders';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const Orders = () => {
  const {
    orders,
    loading,
    updateOrderStatus,
    deleteOrder,
    updateFulfillment,
    sendCustomerEmail,
    addOrderNote
  } = useOrders();
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fulfillment state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [newNote, setNewNote] = useState('');
  const [customEmailMessage, setCustomEmailMessage] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      [order.customer_name, order.customer_email, order.id, order.status].some(
        (field) => field?.toLowerCase().includes(q)
      )
    );
  }, [orders, query]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.tracking_number || '');
    setCarrier(order.carrier || '');
    setNewNote('');
    setCustomEmailMessage('');
    setDetailsOpen(true);
  };

  const handleFulfillmentUpdate = async () => {
    if (!selectedOrder) return;

    await updateFulfillment(selectedOrder.id, {
      tracking_number: trackingNumber,
      carrier: carrier,
    });

    // Update local state
    setSelectedOrder({
      ...selectedOrder,
      tracking_number: trackingNumber,
      carrier: carrier,
    });
  };

  const handleAddNote = async () => {
    if (!selectedOrder || !newNote.trim()) return;
    await addOrderNote(selectedOrder.id, newNote);
    setNewNote('');

    // Update local state
    setSelectedOrder({
      ...selectedOrder,
      notes: selectedOrder.notes ? `${selectedOrder.notes}\n\n[${new Date().toLocaleString()}] ${newNote}` : `[${new Date().toLocaleString()}] ${newNote}`,
    });
  };

  const handleSendEmail = async (emailType: 'shipped' | 'delivered' | 'custom') => {
    if (!selectedOrder) return;

    const message = emailType === 'custom' ? customEmailMessage : undefined;
    await sendCustomerEmail(selectedOrder.id, emailType, message);

    // Update local state
    setSelectedOrder({
      ...selectedOrder,
      customer_notified: true,
      last_email_sent: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders…"
            className="pl-7 h-8"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold">
            {orders.filter((o) => o.status === 'pending').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold">
            {orders.filter((o) => o.status === 'processing').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold">
            ${orders.reduce((sum, o) => sum + Number(o.total_amount), 0).toFixed(2)}
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 border-b text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
        </div>
        <div className="p-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Order ID</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.customer_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.created_at
                        ? format(new Date(order.created_at), 'MMM dd, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ${Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="h-7 w-32">
                          <SelectValue>
                            <Badge
                              variant="outline"
                              className={statusColors[order.status] || ''}
                            >
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete order?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The order will be permanently
                                deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(order.id)}>
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

      {/* Enhanced Order Management Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order {selectedOrder?.id.slice(0, 8)}...
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <Tabs defaultValue="details" className="flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="fulfillment" className="gap-2">
                  <Truck className="h-4 w-4" />
                  Fulfillment
                </TabsTrigger>
                <TabsTrigger value="communication" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communication
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Notes
                </TabsTrigger>
              </TabsList>

              {/* Order Details Tab */}
              <TabsContent value="details" className="flex-1 overflow-y-auto max-h-[60vh] mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Order Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Order ID</Label>
                          <div className="font-mono text-sm">{selectedOrder.id}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Status</Label>
                          <div className="mt-1">
                            <Badge variant="outline" className={statusColors[selectedOrder.status] || ''}>
                              {selectedOrder.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Order Date</Label>
                          <div className="text-sm">
                            {selectedOrder.created_at
                              ? format(new Date(selectedOrder.created_at), 'PPpp')
                              : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Total Amount</Label>
                          <div className="text-xl font-bold">
                            ${Number(selectedOrder.total_amount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Customer Information</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <div className="flex items-center gap-2">
                            <div className="text-sm">{selectedOrder.customer_name}</div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <div className="text-sm">{selectedOrder.customer_email}</div>
                          </div>
                        </div>
                        {selectedOrder.customer_phone && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <div className="text-sm">{selectedOrder.customer_phone}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedOrder.shipping_address && (
                    <div>
                      <h3 className="font-medium mb-3">Shipping Address</h3>
                      <Card className="p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div>{selectedOrder.shipping_address.address}</div>
                            <div>
                              {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <Card className="p-0 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Product ID</TableHead>
                              <TableHead className="text-xs">Quantity</TableHead>
                              <TableHead className="text-xs text-right">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedOrder.order_items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="text-sm font-mono">
                                  {item.product_id?.slice(0, 8) || 'N/A'}
                                </TableCell>
                                <TableCell className="text-sm">{item.quantity}</TableCell>
                                <TableCell className="text-sm text-right">
                                  ${Number(item.price).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Fulfillment & Shipping Tab */}
              <TabsContent value="fulfillment" className="flex-1 overflow-y-auto max-h-[60vh] mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Shipping & Tracking</h3>
                    <Card className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tracking">Tracking Number</Label>
                          <Input
                            id="tracking"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="carrier">Carrier</Label>
                          <Select value={carrier} onValueChange={setCarrier}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select carrier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USPS">USPS</SelectItem>
                              <SelectItem value="UPS">UPS</SelectItem>
                              <SelectItem value="FedEx">FedEx</SelectItem>
                              <SelectItem value="DHL">DHL</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleFulfillmentUpdate} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Update Fulfillment
                      </Button>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Fulfillment Status</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4 text-center">
                        <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <div className="text-xs text-muted-foreground">Ordered</div>
                        <div className="text-sm font-medium">
                          {selectedOrder.created_at ? format(new Date(selectedOrder.created_at), 'MMM dd') : 'N/A'}
                        </div>
                      </Card>
                      <Card className="p-4 text-center">
                        <Truck className={`h-8 w-8 mx-auto mb-2 ${selectedOrder.fulfilled_at ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="text-xs text-muted-foreground">Shipped</div>
                        <div className="text-sm font-medium">
                          {selectedOrder.fulfilled_at ? format(new Date(selectedOrder.fulfilled_at), 'MMM dd') : 'Pending'}
                        </div>
                      </Card>
                      <Card className="p-4 text-center">
                        <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${selectedOrder.status === 'delivered' ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <div className="text-xs text-muted-foreground">Delivered</div>
                        <div className="text-sm font-medium">
                          {selectedOrder.status === 'delivered' ? 'Complete' : 'Pending'}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Customer Communication Tab */}
              <TabsContent value="communication" className="flex-1 overflow-y-auto max-h-[60vh] mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Customer Communication</h3>

                    <div className="space-y-3">
                      <Button
                        onClick={() => handleSendEmail('shipped')}
                        disabled={selectedOrder.status !== 'shipped'}
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Shipped Notification
                      </Button>

                      <Button
                        onClick={() => handleSendEmail('delivered')}
                        disabled={selectedOrder.status !== 'delivered'}
                        variant="outline"
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Delivered Notification
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="customEmail">Custom Email Message</Label>
                      <Textarea
                        id="customEmail"
                        value={customEmailMessage}
                        onChange={(e) => setCustomEmailMessage(e.target.value)}
                        placeholder="Enter custom message to send to customer..."
                        rows={4}
                        className="mt-1"
                      />
                      <Button
                        onClick={() => handleSendEmail('custom')}
                        disabled={!customEmailMessage.trim()}
                        className="w-full mt-2"
                        variant="outline"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Custom Email
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Communication History</h4>
                    <Card className="p-4">
                      {selectedOrder.customer_notified ? (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Customer notified via email
                          {selectedOrder.last_email_sent && (
                            <span className="text-muted-foreground">
                              {format(new Date(selectedOrder.last_email_sent), 'MMM dd, yyyy HH:mm')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No email notifications sent yet
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Order Notes Tab */}
              <TabsContent value="notes" className="flex-1 overflow-y-auto max-h-[60vh] mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Add Order Note</h3>
                    <div className="space-y-3">
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add an internal note about this order..."
                        rows={3}
                      />
                      <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Order Notes History</h4>
                    <Card className="p-4">
                      {selectedOrder.notes ? (
                        <div className="text-sm whitespace-pre-line bg-muted/30 p-3 rounded">
                          {selectedOrder.notes}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          No notes added yet
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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

export default Orders;
