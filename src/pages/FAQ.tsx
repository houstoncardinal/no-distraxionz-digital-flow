import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Mail, Phone } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is No Distraxionz about?",
      answer: "No Distraxionz represents a mindset of unwavering focus and excellence. We create premium contemporary fashion for individuals who refuse to compromise on quality and style. Our brand embodies the philosophy that true success comes from eliminating distractions and maintaining laser focus on what matters most."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer a comprehensive size range to ensure the perfect fit for everyone. Our men's and women's collections include XS through XXL, with detailed size charts available on each product page. Our kids' collection covers various age groups with age-appropriate sizing. For specific measurements and fit guidance, please refer to our size guide or contact our styling team."
    },
    {
      question: "What is your return policy?",
      answer: "We stand behind the quality of our products. You can return unworn, unwashed items with original tags within 30 days of purchase for a full refund. Items must be in original condition with all packaging. Custom or personalized items are final sale. We also offer exchanges for different sizes or colors, subject to availability."
    },
    {
      question: "How long does shipping take?",
      answer: "We understand that anticipation is part of the excitement. Standard shipping typically takes 3-7 business days within the United States. Express shipping (1-3 business days) and overnight options are available at checkout. All orders are processed and shipped within 24-48 hours on business days. You'll receive tracking information once your order ships."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within the United States to ensure the best possible service and delivery experience. We're actively working on expanding our shipping to international destinations to bring the No Distraxionz experience to fashion enthusiasts worldwide. Stay connected with us for updates on international shipping availability."
    },
    {
      question: "What materials do you use?",
      answer: "We use only premium materials selected for their quality, comfort, and durability. Our collection features 100% cotton, premium cotton blends, and carefully chosen fabrics that maintain their integrity through regular wear and washing. Each product page includes detailed material information to help you make informed choices about care and longevity."
    },
    {
      question: "Do you offer wholesale or bulk orders?",
      answer: "Yes, we welcome wholesale inquiries and bulk orders for retailers, events, corporate gifts, or team purchases. We offer competitive wholesale pricing and can accommodate custom requirements. Please contact us at nodistraxionz@gmail.com with details about your needs, including quantity, preferred items, and timeline for a personalized quote."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with a tracking number and direct links to track your package. You can monitor your shipment's progress in real-time through our shipping partner's website. If you experience any issues with tracking or have questions about your order status, our customer service team is ready to help."
    },
    {
      question: "Do you offer custom designs or personalization?",
      answer: "We occasionally offer limited custom options for special orders and collaborations. If you have ideas that align with our brand vision and the No Distraxionz philosophy, we'd love to hear from you. Contact us with your concept, and we'll explore possibilities for bringing your vision to life while maintaining our standards of excellence."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and other secure digital payment methods. All transactions are processed through encrypted, secure payment systems to protect your financial information. We never store your payment details on our servers."
    },
    {
      question: "How do I care for my No Distraxionz apparel?",
      answer: "To maintain the quality and appearance of your pieces, we recommend washing in cold water with like colors, tumble drying on low heat, and avoiding bleach or harsh detergents. Turn garments inside out before washing to preserve graphics and details. For specific care instructions, always check the care label on each item, as different materials may have unique requirements."
    },
    {
      question: "Are you hiring?",
      answer: "We're always interested in connecting with individuals who embody the No Distraxionz mindset—those with unwavering focus, exceptional work ethic, and a passion for excellence. If you're driven to make a meaningful impact and align with our values of quality and innovation, we'd love to hear from you. Send your resume and a note about your vision to nodistraxionz@gmail.com."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modern Hero Section */}
      <section className="section-padding-modern bg-gradient-modern">
        <div className="w-full container-padding-modern text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-4 py-2">
            <HelpCircle className="h-4 w-4 mr-2" />
            Got Questions?
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-gradient tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about No Distraxionz, our products, 
            and joining the movement toward focused excellence.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding-modern">
        <div className="w-full container-padding-modern">
          <div className="w-full">
            <Card className="card-modern shadow-modern-lg">
              <CardContent className="p-8">
                <Accordion type="single" collapsible className="space-y-6">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="border border-border/50 rounded-xl px-6 py-2 hover:border-primary/30 transition-colors"
                    >
                      <AccordionTrigger className="text-left font-playfair font-medium text-lg hover:text-primary hover:no-underline py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Modern Contact CTA */}
            <Card className="mt-12 card-modern shadow-modern bg-gradient-brand text-white">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                    <HelpCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl md:text-3xl font-medium mb-4">
                      Still Have Questions?
                    </h3>
                    <p className="text-white/90 text-lg mb-8">
                      Can't find what you're looking for? Our team is here to help you 
                      make the perfect choice and join the movement.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      asChild 
                      variant="secondary" 
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-medium"
                    >
                      <a href="mailto:nodistraxionz@gmail.com" className="inline-flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Us
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white hover:text-primary font-medium"
                    >
                      <a href="tel:+15043168944" className="inline-flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Us
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
