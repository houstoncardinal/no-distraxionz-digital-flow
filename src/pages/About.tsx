
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Zap, Map } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            Our Story
          </Badge>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold mb-6 text-gradient">
            More Than A Brand
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No Distraxionz isn't just clothing—it's a movement, a culture, a vision for those who refuse to settle for mediocrity.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-oswald text-4xl font-bold">
                The Culture. The Movement. The Vision.
              </h2>
              <p className="text-lg text-muted-foreground">
                Born in the vibrant streets of New Orleans, No Distraxionz represents a mindset—a way of life for those who hustle, create, and dominate without losing focus. We understand that time is money, and every second counts in the pursuit of greatness.
              </p>
              <p className="text-lg text-muted-foreground">
                Our brand embodies the spirit of those who ask "Why be average when you can be legendary?" We create clothing for dreamers who execute, for visionaries who grind, and for anyone who believes that tunnel vision isn't a limitation—it's a superpower.
              </p>
              <Button className="gradient-brand text-black font-bold" size="lg">
                Join the Movement
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="font-oswald text-4xl font-bold text-gradient">NOLA</div>
                  <div className="text-muted-foreground">Born & Raised</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-oswald text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-xl text-muted-foreground">
              Our core values drive everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background border-border hover-lift">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-oswald text-xl font-bold">Tunnel Vision</h3>
                <p className="text-muted-foreground">
                  Stay focused on your goals. Eliminate distractions and maintain laser focus.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover-lift">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-oswald text-xl font-bold">Time Is Money</h3>
                <p className="text-muted-foreground">
                  Every moment counts. Maximize your potential and make every second valuable.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover-lift">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-oswald text-xl font-bold">No Fake Friends</h3>
                <p className="text-muted-foreground">
                  Surround yourself with real people who support your vision and growth.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover-lift">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-oswald text-xl font-bold">New Orleans Pride</h3>
                <p className="text-muted-foreground">
                  Rooted in NOLA culture, we bring the spirit of resilience to everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team/Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-oswald text-4xl font-bold">From The Streets of New Orleans</h2>
            <p className="text-lg text-muted-foreground">
              No Distraxionz was born from the understanding that greatness isn't given—it's earned. Founded in New Orleans, Louisiana, our brand represents the hustle mentality that defines our city. We create for those who understand that being average is a choice, and they choose to be legendary.
            </p>
            <p className="text-lg text-muted-foreground">
              Every design, every message, every piece tells the story of someone who refused to be distracted from their vision. This is streetwear with purpose, clothing with a message, and fashion with a mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-brand text-black font-bold" size="lg">
                Shop Our Story
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Contact Us
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
