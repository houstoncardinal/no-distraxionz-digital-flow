import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MountainHeroSection from '@/components/MountainHeroSection';
import ProductCard from '@/components/ProductCard';
import ElegantBackgroundEffect from '@/components/ElegantBackgroundEffect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/data/products';
import { ChevronRight, Award, Shield, Truck, Headphones, Globe, Users, Play, ShoppingBag, Star, Filter, Search, Heart, TrendingUp, Package, CreditCard, Sparkles, Crown, Diamond } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Mountain Hero Section */}
      <MountainHeroSection />

      {/* Professional Luxury Section */}
      <section className="relative -mt-32 pt-32 pb-32 bg-gradient-to-b from-transparent via-white/95 to-white overflow-hidden">
        {/* Professional Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-gray-50/30 to-slate-100/40"></div>
          
          {/* Elegant grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Floating Professional Elements */}
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-indigo-200/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-100/20 to-violet-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-br from-gray-100/20 to-slate-200/20 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto container-padding relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Professional Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 rounded-full border border-gray-200/60 backdrop-blur-sm mb-8 shadow-lg">
                <Crown className="h-5 w-5 text-amber-600" />
                <span className="text-gray-700 font-medium tracking-wide">EXCELLENCE REDEFINED</span>
                <Diamond className="h-5 w-5 text-amber-600" />
              </div>
              
              <h2 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-light leading-tight text-gray-900 mb-8">
                Tunnel Vision,
                <span className="block bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  Beyond Limits
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
                Where uncompromising vision meets flawless execution.
                <span className="block mt-4 text-gray-500">
                  For those who demand nothing less than perfection.
                </span>
              </p>
            </div>

            {/* Professional Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Uncompromising Excellence */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-yellow-100/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-white/90 backdrop-blur-xl border border-gray-200/40 hover:border-amber-300/60 transition-all duration-500 overflow-hidden shadow-xl">
                  <CardContent className="p-10 text-center space-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100/40 to-yellow-100/40 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-500">
                        <Award className="h-10 w-10 text-amber-600" />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-medium mb-4 text-gray-900">Uncompromising</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Zero tolerance for shortcuts. Every detail executed with surgical precision and unwavering focus.
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Undistracted Vision */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-white/90 backdrop-blur-xl border border-gray-200/40 hover:border-blue-300/60 transition-all duration-500 overflow-hidden shadow-xl">
                  <CardContent className="p-10 text-center space-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-500">
                        <Globe className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Diamond className="h-5 w-5 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-medium mb-4 text-gray-900">Undistracted</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        While others chase trends, we forge legacy. Our vision cuts through the chaos with laser clarity.
                      </p>
                      <Badge className="bg-blue-100/80 text-blue-700 border border-blue-200/60 backdrop-blur-sm">
                        Global Excellence
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Unstoppable Force */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-violet-100/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-white/90 backdrop-blur-xl border border-gray-200/40 hover:border-purple-300/60 transition-all duration-500 overflow-hidden shadow-xl">
                  <CardContent className="p-10 text-center space-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100/40 to-violet-100/40 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-500">
                        <Users className="h-10 w-10 text-purple-600" />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Crown className="h-5 w-5 text-purple-500 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-medium mb-4 text-gray-900">Unstoppable</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        For those who move with purpose. Who know their destination and refuse to be deterred.
                      </p>
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-purple-600 text-lg">10K+</span> Elite Members
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Professional Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Premium Collection */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-gradient-to-br from-amber-50/90 to-yellow-50/90 backdrop-blur-xl border border-amber-200/40 text-gray-900 overflow-hidden shadow-xl">
                  <CardContent className="p-10 text-center space-y-8">
                    <div className="w-20 h-20 bg-amber-100/60 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                      <ShoppingBag className="h-10 w-10 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-3xl font-medium mb-4 text-amber-900">Premium Collection</h3>
                      <p className="text-amber-800 text-lg mb-8 leading-relaxed">
                        Discover curated pieces where artistry meets engineering. Each item a masterpiece of design and function.
                      </p>
                      <Button asChild size="lg" className="bg-amber-600 text-white hover:bg-amber-700 font-semibold px-10 py-6 text-lg rounded-full shadow-lg">
                        <Link to="/shop">
                          Explore Excellence
                          <ChevronRight className="ml-3 h-6 w-6" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Elite Access */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/20 to-slate-200/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-gradient-to-br from-gray-50/90 to-slate-50/90 backdrop-blur-xl border border-gray-200/40 text-gray-900 overflow-hidden shadow-xl">
                  <CardContent className="p-10 text-center space-y-8">
                    <div className="w-20 h-20 bg-gray-100/60 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                      <Crown className="h-10 w-10 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-3xl font-medium mb-4 text-gray-900">Elite Access</h3>
                      <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        Join the inner circle. Exclusive previews, priority access, and experiences reserved for the few.
                      </p>
                      <Button asChild size="lg" variant="outline" className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-semibold px-10 py-6 text-lg rounded-full bg-white/80 backdrop-blur-sm shadow-lg">
                        <Link to="/about">
                          Join Elite
                          <Diamond className="ml-3 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Professional Benefits Bar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-gray-50/40 to-white/60 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-gray-200/50 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex items-center justify-center space-x-6 text-center md:text-left">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100/60 to-green-100/60 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <Shield className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-playfair text-xl font-medium text-gray-900 mb-1">Fort Knox Security</h4>
                      <p className="text-sm text-gray-600">Military-grade protection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6 text-center md:text-left">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100/60 to-cyan-100/60 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <Truck className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-playfair text-xl font-medium text-gray-900 mb-1">White Glove Delivery</h4>
                      <p className="text-sm text-gray-600">Concierge service included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6 text-center md:text-left">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100/60 to-violet-100/60 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <Headphones className="h-7 w-7 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-playfair text-xl font-medium text-gray-900 mb-1">24/7 Elite Support</h4>
                      <p className="text-sm text-gray-600">Personal styling consultants</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth Transition to Products */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
        
        <div className="container mx-auto container-padding relative z-10 py-20">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm mb-8">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium tracking-wide">FEATURED COLLECTION</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground">
              Focus Made Visible
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each piece engineered for those who refuse distractions. Clean lines, purposeful design, unshakeable confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="group hover-lift">
                <div className={`${index === 1 ? 'md:scale-110 md:z-10 relative' : ''}`}>
                  <ProductCard {...product} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-12 py-6 text-lg rounded-full">
              <Link to="/shop">
                Explore Full Collection
                <ChevronRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border border-primary/20 font-medium px-4 py-2">
                  The Experience
                </Badge>
                <h2 className="font-playfair text-4xl md:text-5xl font-light leading-tight">
                  Built for the
                  <span className="block text-gradient-corporate">Relentless</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  When everyone else settles, you push forward. When others get distracted, you stay locked in.
                  Our collection is for those who understand that excellence isn't an accident—it's a choice made daily.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium mb-2">Bulletproof Quality</h3>
                    <p className="text-muted-foreground">Built to withstand everything. Because giving up isn't in your vocabulary.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium mb-2">Zero Noise Service</h3>
                    <p className="text-muted-foreground">Direct access to what you need. No fluff, no distractions, just results.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium mb-2">Precision Delivery</h3>
                    <p className="text-muted-foreground">On time, every time. Because your momentum can't wait for delays.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl overflow-hidden corporate-shadow-lg relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-6 text-white/90">
                    <Play className="h-20 w-20 mx-auto mb-6 opacity-80" />
                    <div className="text-3xl font-playfair font-light">Behind the Craft</div>
                    <div className="text-lg font-medium">Discover Our Process</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary via-primary/95 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        
        <div className="container mx-auto container-padding text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              No Distractions. Just Progress.
            </h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-light">
              Join those who've eliminated the noise. Who've chosen focus over chaos. 
              Who understand that true power comes from unwavering concentration on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-medium px-12 py-6 text-lg rounded-full bg-transparent">
                <Link to="/shop">Enter the Zone</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10 font-medium px-8 py-6 text-lg">
                <Link to="/about">Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
