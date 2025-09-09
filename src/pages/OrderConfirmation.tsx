import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  // Mock order data
  const orderNumber = "NDX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full container-padding-modern py-16">
        <div className="w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-playfair font-medium text-green-600">
              Order Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Order #{orderNumber}
            </Badge>
          </div>

          {/* Order Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Order confirmation sent to your email address
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order is being prepared for shipment
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: {estimatedDelivery}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What's Next */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-center">What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">1</span>
                    Order Processing
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    We'll prepare your items with care and attention to detail.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">2</span>
                    Quality Check
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Every item is inspected to ensure it meets our standards.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">3</span>
                    Shipping Update
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">4</span>
                    Delivery
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Your NO DISTRAXIONZ gear arrives at your doorstep.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg">
              <Link to="/shop">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/account">View Order Status</Link>
            </Button>
          </div>

          {/* Contact Support */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Questions about your order?{' '}
              <Link to="/contact" className="text-primary hover:underline font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
