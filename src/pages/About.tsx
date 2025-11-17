import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Globe, TrendingUp, Heart, Shield, Sparkles, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modern Hero Section */}
      <section className="section-padding-modern bg-gradient-modern">
        <div className="w-full container-padding-modern text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Our Heritage
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-gradient tracking-tight">
            Crafting Excellence Since Day One
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            No Distraxionz represents more than fashion—we embody a commitment to exceptional quality, 
            innovative design, and sustainable practices that define contemporary luxury.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding-modern">
        <div className="w-full container-padding-modern">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium text-sm">Our Vision</span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl font-medium">
                  Redefining Contemporary Fashion
                </h2>
              </div>
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
              <Button className="btn-primary" size="lg">
                Explore Our Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding-modern bg-gradient-modern">
        <div className="w-full container-padding-modern">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-6">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">Core Values</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-medium mb-6">What Drives Us Forward</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide every decision and define our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover shadow-modern">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Uncompromising Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain the highest standards in materials, craftsmanship, and design, 
                  ensuring every product meets our exacting quality requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-modern">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Innovation & Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Continuously pushing creative boundaries while respecting timeless design principles 
                  that ensure lasting appeal and relevance.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-modern">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Customer Excellence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Delivering exceptional service and building lasting relationships with customers 
                  who share our appreciation for quality and sophistication.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-modern">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto border">
                  <Shield className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Sustainable Practices</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Committed to responsible manufacturing and sustainable business practices 
                  that respect our environment and communities.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-modern">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Global Accessibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Making exceptional fashion accessible to discerning customers worldwide 
                  through innovative distribution and service networks.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-modern">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-white" />
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
      <section className="section-padding-modern">
        <div className="w-full container-padding-modern">
          <div className="w-full text-center space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium text-sm">Our Story</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-medium">Our Heritage & Future</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <Card className="card-modern p-8 shadow-modern">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-playfair text-2xl font-medium">Rooted in Excellence</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      No Distraxionz was born from the rich cultural heritage of New Orleans, Louisiana. 
                      Our founders recognized the need for sophisticated fashion that reflects both 
                      contemporary trends and timeless elegance.
                    </p>
                    <p>
                      Through years of dedication and continuous innovation, we've established ourselves 
                      as a trusted name in contemporary fashion, serving discerning customers across 
                      the globe with unwavering commitment to quality.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="card-modern p-8 shadow-modern">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-playfair text-2xl font-medium">Vision for Tomorrow</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      As we look to the future, our commitment remains unchanged: to create exceptional 
                      fashion that empowers individuals to express their unique style while maintaining 
                      the highest standards of quality and service.
                    </p>
                    <p>
                      We continue to invest in sustainable practices, innovative technologies, and 
                      global expansion while staying true to the values that have defined our success 
                      from the very beginning.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button className="btn-primary" size="lg">
                Explore Our Collection
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-xl">
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
