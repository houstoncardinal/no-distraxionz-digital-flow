import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modern Hero Section */}
      <section className="section-padding-modern bg-gradient-modern">
        <div className="w-full container-padding-modern text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-4 py-2">
            Get In Touch
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-gradient tracking-tight">
            Let's Connect
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Ready to elevate your style? Have questions about our collection? 
            We're here to help you find exactly what you need.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding-modern">
        <div className="w-full container-padding-modern">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium text-sm">Send Message</span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-medium">
                  Drop Us a Line
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We value your time as much as ours. Expect a response within 24 hours.
                </p>
              </div>

              <Card className="card-modern p-8 shadow-modern">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        className="input-modern"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        className="input-modern"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="input-modern"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      className="input-modern"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="input-modern resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="btn-primary w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium text-sm">Contact Info</span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-medium">
                  Reach Out Directly
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Based in New Orleans, Louisiana. Available to help you make the perfect choice.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="card-hover p-6 shadow-modern">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl font-medium mb-2">Email</h3>
                      <p className="text-muted-foreground mb-3">Send us an email anytime</p>
                      <a 
                        href="mailto:nodistraxionz@gmail.com" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        nodistraxionz@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="card-hover p-6 shadow-modern">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-warm rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl font-medium mb-2">Phone</h3>
                      <p className="text-muted-foreground mb-3">Call us during business hours</p>
                      <a 
                        href="tel:+15043168944" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        (504) 316-8944
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="card-hover p-6 shadow-modern">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl font-medium mb-2">Location</h3>
                      <p className="text-muted-foreground mb-3">Born and based in</p>
                      <p className="text-primary font-medium">New Orleans, Louisiana</p>
                    </div>
                  </div>
                </Card>

                <Card className="card-hover p-6 shadow-modern">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 border">
                      <Clock className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl font-medium mb-2">Business Hours</h3>
                      <p className="text-muted-foreground mb-3">We're here when you need us</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-foreground">Monday - Friday: 9:00 AM - 8:00 PM</p>
                        <p className="text-foreground">Saturday: 10:00 AM - 6:00 PM</p>
                        <p className="text-foreground">Sunday: 12:00 PM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Modern Map Placeholder */}
              <Card className="card-modern p-6 shadow-modern">
                <h3 className="font-playfair text-xl font-medium mb-4">Find Us</h3>
                <div className="aspect-video bg-gradient-modern rounded-xl flex items-center justify-center border">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">New Orleans, Louisiana</p>
                      <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
