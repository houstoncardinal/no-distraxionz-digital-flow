import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-padding-modern py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-medium mb-8">Terms of Service</h1>
          
          <Card>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-8">
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
              <p>
                By accessing and using No Distraxionz website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our website.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Website</h2>
              <h3 className="text-xl font-medium mt-6 mb-3">Permitted Use</h3>
              <p>You may use our website for:</p>
              <ul>
                <li>Browsing and purchasing products</li>
                <li>Creating and managing your account</li>
                <li>Accessing customer support</li>
                <li>Viewing order history</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-3">Prohibited Use</h3>
              <p>You may not:</p>
              <ul>
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Use automated systems to access the website</li>
                <li>Impersonate any person or entity</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Product Information</h2>
              <p>
                We strive to provide accurate product descriptions and pricing. However:
              </p>
              <ul>
                <li>Product colors may vary slightly from images</li>
                <li>Prices are subject to change without notice</li>
                <li>Product availability is not guaranteed</li>
                <li>We reserve the right to limit quantities</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Orders and Payment</h2>
              <h3 className="text-xl font-medium mt-6 mb-3">Order Acceptance</h3>
              <p>
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
              </p>

              <h3 className="text-xl font-medium mt-6 mb-3">Payment</h3>
              <ul>
                <li>Payment must be received before orders are processed</li>
                <li>We accept major credit cards and other specified payment methods</li>
                <li>Prices are in USD unless otherwise stated</li>
                <li>You are responsible for all charges incurred</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping and Delivery</h2>
              <ul>
                <li>Shipping costs are calculated at checkout</li>
                <li>Delivery times are estimates only</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>We are not responsible for shipping delays beyond our control</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Returns and Refunds</h2>
              <p>
                Please see our Returns & Refunds page for detailed information about:
              </p>
              <ul>
                <li>Return eligibility and timeframes</li>
                <li>Refund processing</li>
                <li>Exchange procedures</li>
                <li>Damaged or defective items</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of No Distraxionz and protected by copyright and trademark laws.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law:
              </p>
              <ul>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount paid for the product</li>
                <li>We do not warrant that the website will be error-free or uninterrupted</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless No Distraxionz from any claims arising from your use of the website or violation of these terms.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which No Distraxionz operates.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, contact us at:
              </p>
              <p>
                Email: legal@nodistraxionz.com<br />
                Phone: (555) 123-4567<br />
                Address: 123 Fashion Street, Style City, SC 12345
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
