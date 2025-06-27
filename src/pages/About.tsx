
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Globe, TrendingUp, Heart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto container-padding text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium">
            Our Heritage
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Crafting Excellence Since Day One
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            No Distraxionz represents more than fashion—we embody a commitment to exceptional quality, 
            innovative design, and sustainable practices that define contemporary luxury.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-playfair text-3xl md:text-4xl font-light">
                Our Vision for Contemporary Fashion
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded with a vision to redefine contemporary fashion, No Distraxionz has evolved into 
                  a global leader in sophisticated apparel. Our journey began with a simple belief: that 
                  exceptional quality and timeless design should be accessible to discerning individuals worldwide.
                </p>
                <p>
                  From our headquarters in New Orleans, we've built a reputation for excellence that extends 
                  across continents. Every piece in our collection reflects our commitment to craftsmanship, 
                  innovation, and the pursuit of perfection.
                </p>
                <p>
                  Today, we continue to push boundaries, exploring new materials, techniques, and designs 
                  while staying true to our core values of quality, integrity, and customer satisfaction.
                </p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium" size="lg">
                Explore Our Collection
              </Button>
            </div>
            <div className="relative">
              <Card className="aspect-[4/5] border-0 corporate-shadow overflow-hidden">
                <div className="h-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Globe className="h-16 w-16 text-primary mx-auto" />
                    <div className="font-playfair text-3xl font-light">Global Excellence</div>
                    <div className="text-muted-foreground">Serving customers worldwide</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-light mb-6">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision and define our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Uncompromising Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain the highest standards in materials, craftsmanship, and design, 
                  ensuring every product meets our exacting quality requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Innovation & Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Continuously pushing creative boundaries while respecting timeless design principles 
                  that ensure lasting appeal and relevance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Customer Excellence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Delivering exceptional service and building lasting relationships with customers 
                  who share our appreciation for quality and sophistication.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Sustainable Practices</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Committed to responsible manufacturing and sustainable business practices 
                  that respect our environment and communities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Global Accessibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Making exceptional fashion accessible to discerning customers worldwide 
                  through innovative distribution and service networks.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Passionate Craftsmanship</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every team member shares our passion for excellence, bringing dedication 
                  and expertise to every aspect of our business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-light">Our Heritage & Future</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-medium">Rooted in Excellence</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No Distraxionz was born from the rich cultural heritage of New Orleans, Louisiana. 
                  Our founders recognized the need for sophisticated fashion that reflects both 
                  contemporary trends and timeless elegance.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Through years of dedication and continuous innovation, we've established ourselves 
                  as a trusted name in contemporary fashion, serving discerning customers across 
                  the globe with unwavering commitment to quality.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-medium">Vision for Tomorrow</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  As we look to the future, our commitment remains unchanged: to create exceptional 
                  fashion that empowers individuals to express their unique style while maintaining 
                  the highest standards of quality and service.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We continue to invest in sustainable practices, innovative technologies, and 
                  global expansion while staying true to the values that have defined our success 
                  from the very beginning.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium" size="lg">
                Explore Our Collection
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
