import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, RefreshCw, AlertCircle } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-padding-modern py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-medium mb-8">Returns & Refunds</h1>
          
          <Alert className="mb-8">
            <Package className="h-4 w-4" />
            <AlertDescription>
              We want you to love your purchase! If you're not completely satisfied, we offer a hassle-free 30-day return policy.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">Return Policy</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Eligibility</h3>
              <p>Items are eligible for return if they meet the following conditions:</p>
              <ul>
                <li>Returned within 30 days of delivery</li>
                <li>In original condition with tags attached</li>
                <li>Unworn, unwashed, and undamaged</li>
                <li>In original packaging</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-3">Non-Returnable Items</h3>
              <p>The following items cannot be returned:</p>
              <ul>
                <li>Items marked as final sale</li>
                <li>Underwear and intimate apparel (for hygiene reasons)</li>
                <li>Custom or personalized items</li>
                <li>Items damaged due to misuse</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">How to Return</h2>
              
              <div className="bg-muted p-6 rounded-lg my-6">
                <h4 className="font-semibold mb-4">Step-by-Step Return Process:</h4>
                <ol className="space-y-3">
                  <li><strong>1. Contact Us</strong> - Email support@nodistraxionz.com with your order number</li>
                  <li><strong>2. Get Authorization</strong> - We'll provide a Return Authorization (RA) number</li>
                  <li><strong>3. Package Item</strong> - Securely pack the item with the RA number visible</li>
                  <li><strong>4. Ship It Back</strong> - Send to our returns address (provided via email)</li>
                  <li><strong>5. Receive Refund</strong> - We'll process your refund within 5-7 business days</li>
                </ol>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Refunds</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Processing Time</h3>
              <ul>
                <li>Refunds are processed within 5-7 business days of receiving the return</li>
                <li>Original shipping costs are non-refundable</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Bank processing may take an additional 3-5 business days</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-3">Partial Refunds</h3>
              <p>Partial refunds may be granted for:</p>
              <ul>
                <li>Items not in original condition</li>
                <li>Items with missing tags or packaging</li>
                <li>Items returned after 30 days</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Exchanges</h2>
              <p>
                We currently do not offer direct exchanges. To exchange an item:
              </p>
              <ol>
                <li>Return the original item following our return process</li>
                <li>Place a new order for the desired item</li>
                <li>Once we receive your return, we'll process the refund</li>
              </ol>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Damaged or Defective Items</h2>
              
              <Alert className="my-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  If you receive a damaged or defective item, please contact us within 7 days of delivery.
                </AlertDescription>
              </Alert>

              <p>For damaged or defective items:</p>
              <ul>
                <li>Contact us immediately with photos of the damage</li>
                <li>We'll provide a prepaid return label</li>
                <li>Full refund or replacement will be provided</li>
                <li>Shipping costs will be covered by us</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Return Shipping</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Standard Returns</h3>
              <ul>
                <li>Customer is responsible for return shipping costs</li>
                <li>We recommend using a trackable shipping method</li>
                <li>We are not responsible for items lost in transit</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-3">Our Error or Defective Items</h3>
              <ul>
                <li>We provide a prepaid return label</li>
                <li>No shipping costs charged to customer</li>
                <li>Full refund including original shipping costs</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">International Returns</h2>
              <p>
                International returns follow the same policy with these additions:
              </p>
              <ul>
                <li>Customer pays all return shipping costs and customs fees</li>
                <li>Items must be declared for the original purchase price</li>
                <li>Extended processing time of 10-14 business days</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Need Help?</h2>
              <p>
                Our customer service team is here to help:
              </p>
              <div className="bg-muted p-6 rounded-lg my-6">
                <p className="mb-2"><strong>Email:</strong> returns@nodistraxionz.com</p>
                <p className="mb-2"><strong>Phone:</strong> (555) 123-4567</p>
                <p className="mb-2"><strong>Hours:</strong> Monday-Friday, 9AM-6PM EST</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
