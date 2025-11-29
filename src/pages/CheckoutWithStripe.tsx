import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, CheckCircle, Lock, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { stripePromise } from '@/lib/stripe';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  address: z.string().min(5, 'Address is required').max(200, 'Address too long'),
  city: z.string().min(2, 'City is required').max(100, 'City too long'),
  state: z.string().min(2, 'State is required').max(50, 'State too long'),
  zipCode: z.string().min(5, 'ZIP code is required').max(10, 'ZIP code too long'),
  phone: z.string().optional(),
  newsletter: z.boolean(),
});

const CheckoutWithStripe = () => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // v2: Forcing fresh deployment with updated Supabase env vars
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    newsletter: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const shipping = state.total > 75 ? 0 : 9.99;
  const tax = state.total * 0.08;
  const finalTotal = state.total + shipping + tax;
  const getImageSrc = (image: string | null) => image || '/placeholder.svg';

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      checkoutSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
        toast({
          title: "Please check your information",
          description: "Some required fields are missing or invalid.",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  // Create payment intent when component mounts
  useEffect(() => {
    if (state.items.length > 0 && !clientSecret) {
      createPaymentIntent();
    }
  }, [state.items]);

  const createPaymentIntent = async () => {
    setIsLoadingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: Math.round(finalTotal * 100), // Convert to cents
          metadata: {
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`,
          }
        }
      });

      if (error) throw error;
      
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment setup failed",
        description: "Unable to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Validate form before processing payment
    if (!validateForm()) {
      return;
    }

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_amount: finalTotal,
          status: 'processing',
          user_id: user?.id || null,
          shipping_address: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          payment_status: 'paid',
          payment_intent_id: paymentIntentId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: typeof item.product.price === 'number' 
          ? item.product.price 
          : parseFloat(String(item.product.price).replace('$', ''))
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send order confirmation email
      try {
        const emailData = {
          orderNumber: order.id,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          items: state.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: typeof item.product.price === 'number' 
              ? item.product.price 
              : parseFloat(String(item.product.price).replace('$', ''))
          })),
          subtotal: state.total,
          shipping,
          tax,
          total: finalTotal,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        };

        await supabase.functions.invoke('send-order-confirmation', {
          body: emailData
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the order if email fails
      }

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });

      clearCart();
      navigate('/order-confirmation', { state: { orderNumber: order.id } });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order creation failed",
        description: "Payment was successful but order creation failed. Please contact support.",
        variant: "destructive"
      });
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-full container-padding-modern py-16">
          <div className="w-full text-center space-y-8">
            <h1 className="text-3xl font-playfair font-medium">Your cart is empty</h1>
            <p className="text-muted-foreground">Add some items to proceed to checkout.</p>
            <Button asChild size="lg">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#000000',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full container-padding-modern py-8">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-playfair font-medium mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="your@email.com"
                      className={formErrors.email ? 'border-destructive' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => handleInputChange('newsletter', !!checked)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to our newsletter for exclusive offers
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className={formErrors.firstName ? 'border-destructive' : ''}
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-destructive mt-1">{formErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        className={formErrors.lastName ? 'border-destructive' : ''}
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-destructive mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      placeholder="123 Street Name"
                      className={formErrors.address ? 'border-destructive' : ''}
                    />
                    {formErrors.address && (
                      <p className="text-sm text-destructive mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                        className={formErrors.city ? 'border-destructive' : ''}
                      />
                      {formErrors.city && (
                        <p className="text-sm text-destructive mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                        className={formErrors.state ? 'border-destructive' : ''}
                      />
                      {formErrors.state && (
                        <p className="text-sm text-destructive mt-1">{formErrors.state}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        required
                        className={formErrors.zipCode ? 'border-destructive' : ''}
                      />
                      {formErrors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{formErrors.zipCode}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    Payment Information
                    <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPayment ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <p className="mt-4 text-sm text-muted-foreground">Setting up secure payment...</p>
                    </div>
                  ) : clientSecret && stripePromise ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                      <StripePaymentForm 
                        onSuccess={handlePaymentSuccess}
                        amount={Math.round(finalTotal * 100)}
                      />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Unable to load payment form. Please refresh the page.</p>
                      <Button onClick={createPaymentIntent} className="mt-4">
                        Retry
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={getImageSrc(item.product.image)}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                          </p>
                        </div>
                        <span className="font-medium text-sm">
                          {formatPrice(typeof item.product.price === 'number' ? item.product.price : parseFloat(String(item.product.price).replace('$', '')))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(state.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        SSL Secured
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Stripe Verified
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutWithStripe;
