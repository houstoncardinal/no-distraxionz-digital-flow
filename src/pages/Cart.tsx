import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';

const Cart = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const shipping = state.total > 75 ? 0 : 9.99;
  const tax = state.total * 0.08; // 8% tax
  const finalTotal = state.total + shipping + tax;
  
  const getImageSrc = (image: string | null) => image || '/placeholder.svg';

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-full container-padding-modern py-16">
          <div className="w-full text-center space-y-8">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/50" />
            <div>
              <h1 className="text-3xl font-playfair font-medium mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground text-lg">
                Discover our latest streetwear collection and find your perfect fit.
              </p>
            </div>
            <Button asChild size="lg" className="px-8">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full container-padding-modern py-8">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-playfair font-medium mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Button variant="outline" onClick={clearCart} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={getImageSrc(item.product.image)}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <Link 
                            to={`/product/${item.product.id}`}
                            className="text-lg font-medium hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.category}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            {item.size && (
                              <Badge variant="secondary">Size: {item.size}</Badge>
                            )}
                            {item.color && (
                              <Badge variant="secondary">Color: {item.color}</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold">
                              {formatPrice(typeof item.product.price === 'number' ? item.product.price : parseFloat(String(item.product.price).replace('$', '')))}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {shipping > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        Add {formatPrice(75 - state.total)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button asChild size="lg" className="w-full">
                      <Link to="/checkout">Proceed to Checkout</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link to="/shop">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">On orders over $75</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-muted-foreground">30-day return policy</p>
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

export default Cart;
