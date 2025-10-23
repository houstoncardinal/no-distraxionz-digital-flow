import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
}

export const StripePaymentForm = ({ onSuccess, amount }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment system not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "There was an error processing your payment.",
          variant: "destructive"
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: "Payment failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          "Processing..."
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Pay ${(amount / 100).toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};
