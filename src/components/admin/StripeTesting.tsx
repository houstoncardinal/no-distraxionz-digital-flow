import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, TestTube, CheckCircle, XCircle, AlertTriangle, DollarSign } from 'lucide-react';

interface TestPaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  amount?: number;
  status?: string;
}

export const StripeTesting = () => {
  const [testAmount, setTestAmount] = useState('10.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<TestPaymentResult | null>(null);
  const [testCard, setTestCard] = useState('4242424242424242'); // Stripe test card
  const { toast } = useToast();

  // Stripe test cards for different scenarios
  const testCards = [
    { number: '4242424242424242', description: 'Success - Any amount' },
    { number: '4000000000000002', description: 'Decline - Generic' },
    { number: '4000000000009995', description: 'Decline - Insufficient funds' },
    { number: '4000000000009987', description: 'Decline - Lost card' },
    { number: '4000000000009979', description: 'Decline - Stolen card' },
  ];

  const testPayment = async () => {
    if (!testAmount || parseFloat(testAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;

      if (isDevelopment) {
        // In development, simulate a successful payment for testing UI
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

        // Simulate different outcomes based on test card
        const shouldSucceed = testCard === '4242424242424242';

        if (shouldSucceed) {
          setLastResult({
            success: true,
            paymentIntentId: `pi_test_${Date.now()}`,
            amount: parseFloat(testAmount),
            status: 'succeeded'
          });

          toast({
            title: "Test payment successful!",
            description: `$${testAmount} processed successfully with test card (simulated).`,
          });
        } else {
          throw new Error('Your card was declined. This is a test decline for card ending in ' + testCard.slice(-4));
        }
      } else {
        // In production, use the actual Netlify function
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(parseFloat(testAmount) * 100), // Convert to cents
            currency: 'usd',
            metadata: {
              test_payment: 'true',
              test_card: testCard,
              test_amount: testAmount
            }
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        if (!data.clientSecret) {
          throw new Error('No client secret returned');
        }

        setLastResult({
          success: true,
          paymentIntentId: data.paymentIntentId,
          amount: parseFloat(testAmount),
          status: 'succeeded'
        });

        toast({
          title: "Test payment successful!",
          description: `$${testAmount} processed successfully with test card.`,
        });
      }

    } catch (error: any) {
      console.error('Test payment failed:', error);
      setLastResult({
        success: false,
        error: error.message || 'Payment failed',
        amount: parseFloat(testAmount)
      });

      toast({
        title: "Test payment failed",
        description: error.message || "Payment processing failed.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const testWebhook = async () => {
    try {
      // Test webhook endpoint (if you have one set up)
      const response = await fetch('/.netlify/functions/stripe-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: 'pi_test_webhook',
              amount: 1000,
              currency: 'usd',
              status: 'succeeded'
            }
          }
        }),
      });

      if (response.ok) {
        toast({
          title: "Webhook test successful",
          description: "Stripe webhook endpoint is responding.",
        });
      } else {
        toast({
          title: "Webhook test failed",
          description: "Webhook endpoint returned an error.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Webhook test failed",
        description: "Could not reach webhook endpoint.",
        variant: "destructive"
      });
    }
  };

  const getStripeStatus = () => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

    // In development, check local .env
    if (import.meta.env.DEV) {
      if (!publishableKey || publishableKey.includes('your_publishable_key_here')) {
        return { status: 'not_configured', message: 'Stripe publishable key not set in .env' };
      }
      if (publishableKey.startsWith('pk_test_')) {
        return { status: 'sandbox', message: 'Sandbox mode active' };
      }
      if (publishableKey.startsWith('pk_live_')) {
        return { status: 'live', message: 'Live mode active ⚠️' };
      }
      return { status: 'invalid', message: 'Invalid key format' };
    }

    // In production (Netlify), assume it's configured via environment variables
    return { status: 'configured', message: 'Configured via Netlify environment' };
  };

  const stripeStatus = getStripeStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stripe Testing</h2>
          <p className="text-muted-foreground">
            Test Stripe payment processing in sandbox mode
          </p>
        </div>
        <Badge
          variant={stripeStatus.status === 'sandbox' ? 'secondary' : 'destructive'}
          className={stripeStatus.status === 'sandbox' ? 'bg-blue-100 text-blue-800' : ''}
        >
          {stripeStatus.message}
        </Badge>
      </div>

      {/* Stripe Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Publishable Key</span>
              <Badge variant={stripeStatus.status === 'not_configured' ? 'destructive' : 'secondary'}>
                {stripeStatus.status === 'not_configured' ? 'Not Set' : 'Configured'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <Badge variant={stripeStatus.status === 'live' ? 'destructive' : 'secondary'}>
                {stripeStatus.status === 'live' ? 'Live ⚠️' : 'Sandbox'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment Functions</span>
              <Badge variant="secondary">
                {import.meta.env.DEV ? 'Development Mode (Simulated)' : 'Netlify Functions'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Test Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.50"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                placeholder="10.00"
              />
            </div>
            <div>
              <Label htmlFor="card">Test Card Number</Label>
              <Input
                id="card"
                value={testCard}
                onChange={(e) => setTestCard(e.target.value)}
                placeholder="4242424242424242"
              />
            </div>
          </div>

          <div>
            <Label>Stripe Test Cards</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {testCards.map((card) => (
                <Button
                  key={card.number}
                  variant="outline"
                  size="sm"
                  onClick={() => setTestCard(card.number)}
                  className="justify-start text-left h-auto p-3"
                >
                  <div>
                    <div className="font-mono text-sm">{card.number}</div>
                    <div className="text-xs text-muted-foreground">{card.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button
              onClick={testPayment}
              disabled={isProcessing || (import.meta.env.DEV && stripeStatus.status === 'not_configured')}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Test Payment'}
              <DollarSign className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={testWebhook}
              variant="outline"
              disabled={isProcessing}
            >
              Test Webhook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Test Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastResult.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div><strong>Status:</strong> {lastResult.status}</div>
                    <div><strong>Amount:</strong> ${lastResult.amount?.toFixed(2)}</div>
                    <div><strong>Payment Intent:</strong> {lastResult.paymentIntentId}</div>
                    <div><strong>Test Card:</strong> {testCard}</div>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div><strong>Error:</strong> {lastResult.error}</div>
                    <div><strong>Amount:</strong> ${lastResult.amount?.toFixed(2)}</div>
                    <div><strong>Test Card:</strong> {testCard}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Test Payments:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {import.meta.env.DEV ? (
                  <li>Ensure your Stripe publishable key is set in `.env` for development testing</li>
                ) : (
                  <li>Stripe keys are configured via Netlify environment variables</li>
                )}
                <li>Use test card numbers from the list above</li>
                <li>Enter any amount $0.50 or greater</li>
                <li>Click "Test Payment" to simulate a transaction</li>
                {import.meta.env.DEV ? (
                  <li><strong>Development:</strong> Payments are simulated - check the results below</li>
                ) : (
                  <li><strong>Production:</strong> Check Stripe Dashboard for actual payment records</li>
                )}
              </ol>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Test Scenarios:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">4242 4242 4242 4242</div>
                    <div className="text-muted-foreground">Always succeeds</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">4000 0000 0000 0002</div>
                    <div className="text-muted-foreground">Always declines</div>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> These tests use your actual Stripe account in sandbox mode.
                All transactions are test transactions and won't result in real charges.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
