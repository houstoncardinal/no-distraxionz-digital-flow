import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag, Minus, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartSidebar() {
  const { state, updateQuantity, removeItem, closeCart } = useCart();

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const getImageSrc = (image: string | null) => image || '/placeholder.svg';

  return (
    <Sheet open={state.isOpen} onOpenChange={() => closeCart()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {state.itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {state.itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Add some items to get started
              </p>
            </div>
            <Button asChild onClick={() => closeCart()}>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 py-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <img
                      src={getImageSrc(item.product.image)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatPrice(typeof item.product.price === 'number' ? item.product.price : parseFloat(String(item.product.price).replace('$', '')))}</p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-xs text-muted-foreground">Color: {item.color}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">{formatPrice(state.total)}</span>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full" size="lg" onClick={() => closeCart()}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={() => closeCart()}>
                  <Link to="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CartTrigger() {
  const { state, toggleCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
    >
      <ShoppingBag className="h-5 w-5" />
      {state.itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {state.itemCount}
        </Badge>
      )}
    </Button>
  );
}
