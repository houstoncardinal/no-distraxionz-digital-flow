
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HorizonHeroSection from '@/components/HorizonHeroSection';
import ProductCard from '@/components/ProductCard';
import ElegantBackgroundEffect from '@/components/ElegantBackgroundEffect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/data/products';
import { ChevronRight, Award, Shield, Truck, Headphones, Globe, Users, Play, ShoppingBag, Star, Filter, Search, Heart, TrendingUp, Package, CreditCard } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* 3D Hero Section */}
      <HorizonHeroSection />

      {/* Transition Section - removed the white line */}
      <section className="relative h-32 bg-gradient-to-b from-transparent to-background/80">
        {/* White line element removed */}
      </section>

      {/* Brand Philosophy Section with Professional Shopping Experience */}
      <section className="section-padding bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-slate-100/30"></div>
        
        {/* Professional Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Elegant Background Effect */}
        <ElegantBackgroundEffect />
        
        <div className="container mx-auto container-padding relative z-10">
          {/* Main Content */}
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Header Section */}
            <div className="text-center space-y-8">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-blue-600 text-white border-0 font-medium px-8 py-3 text-sm">
                Premium Shopping Experience
              </Badge>
              
              <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
                Beyond Fashion,
                <span className="block text-gradient-corporate">Beyond Limits</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                Designed for those who refuse to be distracted. 
                <span className="block mt-4">
                  In a world full of noise, we create clarity. In a culture of compromise, we demand excellence.
                </span>
              </p>
            </div>

            {/* Shopping Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Search Widget */}
              <Card className="group hover-lift bg-white/80 backdrop-blur-sm border-slate-200/60 corporate-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-medium mb-2">Smart Search</h3>
                    <p className="text-sm text-muted-foreground">Find exactly what you need</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Search Now
                  </Button>
                </CardContent>
              </Card>

              {/* Filter Widget */}
              <Card className="group hover-lift bg-white/80 backdrop-blur-sm border-slate-200/60 corporate-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Filter className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-medium mb-2">Smart Filters</h3>
                    <p className="text-sm text-muted-foreground">Refine your perfect match</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Filter Products
                  </Button>
                </CardContent>
              </Card>

              {/* Wishlist Widget */}
              <Card className="group hover-lift bg-white/80 backdrop-blur-sm border-slate-200/60 corporate-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-medium mb-2">Wishlist</h3>
                    <p className="text-sm text-muted-foreground">Save your favorites</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Wishlist
                  </Button>
                </CardContent>
              </Card>

              {/* Trending Widget */}
              <Card className="group hover-lift bg-white/80 backdrop-blur-sm border-slate-200/60 corporate-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-medium mb-2">Trending</h3>
                    <p className="text-sm text-muted-foreground">What's popular now</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Trends
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group hover-lift bg-white/90 backdrop-blur-sm border-slate-200/60 corporate-shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl font-medium mb-4">Uncompromising</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Zero tolerance for shortcuts. Every detail executed with laser focus and precision.
                    </p>
                    <div className="flex items-center justify-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover-lift bg-white/90 backdrop-blur-sm border-slate-200/60 corporate-shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl font-medium mb-4">Undistracted</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      While others chase trends, we build legacy. Our vision cuts through the chaos.
                    </p>
                    <Badge className="bg-primary/10 text-primary border border-primary/20">
                      Global Reach
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover-lift bg-white/90 backdrop-blur-sm border-slate-200/60 corporate-shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl font-medium mb-4">Unstoppable</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      For those who move with purpose. Who know their destination and won't be deterred.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">10K+</span> Satisfied Customers
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shopping Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="group hover-lift bg-gradient-to-br from-primary to-primary/80 text-white border-0 corporate-shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl font-medium mb-4">Shop Collection</h3>
                    <p className="text-white/90 mb-6">
                      Discover our curated selection of premium pieces designed for excellence.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-medium px-8">
                      <Link to="/shop">
                        Explore Now
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover-lift bg-gradient-to-br from-slate-800 to-slate-700 text-white border-0 corporate-shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl font-medium mb-4">VIP Access</h3>
                    <p className="text-white/90 mb-6">
                      Join our exclusive program for early access and premium benefits.
                    </p>
                    <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800 font-medium px-8">
                      <Link to="/about">
                        Learn More
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shopping Benefits */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 corporate-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg font-medium">Secure Shopping</h4>
                    <p className="text-sm text-muted-foreground">SSL encrypted & protected</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg font-medium">Fast Delivery</h4>
                    <p className="text-sm text-muted-foreground">Free shipping over $100</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg font-medium">24/7 Support</h4>
                    <p className="text-sm text-muted-foreground">Always here to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"></div>
        
        <div className="container mx-auto container-padding relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-6 py-2">
              Featured Collection
            </Badge>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light mb-8">
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
