import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || "NDX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
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
        <div className="w-full text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Order confirmation sent to your email
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
                    Your order is being prepared
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
                    Est. {estimatedDelivery}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg">
              <Link to="/shop">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
