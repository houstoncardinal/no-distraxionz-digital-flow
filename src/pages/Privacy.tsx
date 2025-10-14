import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-padding-modern py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-medium mb-8">Privacy Policy</h1>
          
          <Card>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-8">
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
              <p>
                No Distraxionz ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
              <p>
                When you place an order, we collect:
              </p>
              <ul>
                <li>Name and contact information (email, phone number)</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through our payment processor)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-xl font-medium mt-6 mb-3">Automatically Collected Information</h3>
              <ul>
                <li>Browser type and version</li>
                <li>IP address and location data</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and shopping experience</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Prevent fraudulent transactions</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul>
                <li><strong>Service Providers:</strong> Payment processors, shipping companies, and email service providers who assist in operating our business</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing</li>
                <li>Regular security audits</li>
                <li>Restricted access to personal information</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your information</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
              <p>
                Our website is not intended for children under 13 years of age. We do not knowingly collect information from children.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@nodistraxionz.com<br />
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
