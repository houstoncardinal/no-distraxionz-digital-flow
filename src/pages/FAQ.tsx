
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "What is No Distraxionz about?",
      answer: "No Distraxionz is more than a clothing brand—it's a movement for those who hustle, create, and dominate without losing focus. We represent the culture of excellence, the vision of success, and the mindset that time is money."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer a full range of sizes to fit everyone in our community. Men's and Women's collections typically include XS, S, M, L, XL, and XXL. Kids' items include various age-appropriate sizes. Check individual product pages for specific size availability."
    },
    {
      question: "What is your return policy?",
      answer: "We want you to be completely satisfied with your purchase. You can return unworn, unwashed items within 30 days of purchase for a full refund. Items must be in original condition with tags attached. Custom or personalized items are final sale."
    },
    {
      question: "How long does shipping take?",
      answer: "We understand that time is money! Standard shipping typically takes 3-7 business days. Express shipping (1-3 business days) and overnight options are available at checkout. All orders are processed within 24-48 hours on business days."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within the United States. We're working on expanding internationally to spread the No Distraxionz movement worldwide. Stay tuned for updates!"
    },
    {
      question: "What materials do you use?",
      answer: "We use premium quality materials including 100% cotton, cotton blends, and heavyweight fabrics depending on the specific item. All our products are designed for comfort, durability, and to maintain their quality through regular wear and washing."
    },
    {
      question: "Do you offer wholesale or bulk orders?",
      answer: "Yes! We offer wholesale pricing for bulk orders, perfect for retailers, events, or teams wanting to represent the movement. Contact us at nodistraxionz@gmail.com with your requirements for a custom quote."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our shipping carrier's website. If you have any issues with tracking, contact our customer service team."
    },
    {
      question: "Do you offer custom designs or personalization?",
      answer: "We occasionally offer limited custom options for special orders. Contact us with your ideas—if it aligns with our brand vision and the No Distraxionz movement, we might be able to make it happen!"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and other secure payment methods. All transactions are processed through secure, encrypted payment systems."
    },
    {
      question: "How do I care for my No Distraxionz apparel?",
      answer: "To keep your gear looking fresh, wash in cold water with like colors, tumble dry on low heat, and avoid bleach. Turn items inside out before washing to preserve the graphics and messaging that represent your mindset."
    },
    {
      question: "Are you hiring?",
      answer: "We're always looking for people who embody the No Distraxionz mindset—those with tunnel vision, hustle mentality, and a drive to be legendary. Send your resume and a note about why you want to join the movement to nodistraxionz@gmail.com."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            Got Questions?
          </Badge>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold mb-6 text-gradient">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about No Distraxionz, our products, and joining the movement.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-oswald font-semibold text-lg hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-card border border-border rounded-lg p-8">
              <h3 className="font-oswald text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our team is here to help you join the movement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:nodistraxionz@gmail.com" className="inline-block">
                  <button className="gradient-brand text-black font-bold px-8 py-3 rounded-md hover-lift">
                    Email Us
                  </button>
                </a>
                <a href="tel:+15043168944" className="inline-block">
                  <button className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-3 rounded-md hover-lift transition-colors">
                    Call Us
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
