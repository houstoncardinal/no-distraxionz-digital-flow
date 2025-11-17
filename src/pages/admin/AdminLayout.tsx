import { Fragment } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
  ShoppingBag,
  Package,
  Users,
  Settings as SettingsIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  ExternalLink,
  Search,
  BarChart3,
  Percent,
  ShoppingCart,
  Layers,
  Archive,
  FileText,
  Image as ImageIcon,
  Megaphone,
  ShieldCheck,
  Wallet,
  Truck,
  Plug,
  UserCog,
  Crown,
  Sparkles,
} from 'lucide-react';

const activeItemClass = "relative [&[data-active=true]]:bg-primary/15 [&[data-active=true]]:text-primary [&[data-active=true]]:shadow-lg [&[data-active=true]]:shadow-primary/10 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-primary before:to-blue-500";

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex h-screen w-full">
      <SidebarProvider defaultOpen>
        <Sidebar variant="floating" collapsible="icon" className="border-0 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-2xl shadow-primary/5 w-72 flex-shrink-0">
          <SidebarHeader className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/809945ef-fe18-461e-963e-17ee3add2941.png" 
                    alt="NO DISTRAXIONZ" 
                    className="h-8 w-auto" 
                  />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-base font-playfair font-semibold text-foreground">NO DISTRAXIONZ</h1>
                  <p className="text-xs text-muted-foreground font-medium">Admin Dashboard</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                <Crown className="h-2.5 w-2.5 mr-1" />
                PRO
              </Badge>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3 space-y-4">
            {/* Overview */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin')} size="lg" tooltip="Dashboard" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/analytics')} size="lg" tooltip="Analytics" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/analytics">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-border/30" />

            {/* Sales */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sales</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/orders')} size="lg" tooltip="Orders" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/orders">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Orders</span>
                      </NavLink>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-primary/10 text-primary border-primary/20 text-xs">3</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/discounts')} size="lg" tooltip="Discounts" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/discounts">
                        <Percent className="h-4 w-4" />
                        <span>Discounts</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/abandoned')} size="lg" tooltip="Abandoned carts" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/abandoned">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Abandoned</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-border/30" />

            {/* Catalog */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Catalog</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/products')} size="lg" tooltip="Products" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/products">
                        <Package className="h-4 w-4" />
                        <span>Products</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/collections')} size="lg" tooltip="Collections" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/collections">
                        <Layers className="h-4 w-4" />
                        <span>Collections</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/inventory')} size="lg" tooltip="Inventory" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/inventory">
                        <Archive className="h-4 w-4" />
                        <span>Inventory</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-border/30" />

            {/* Customers */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customers</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/customers')} size="lg" tooltip="Customers" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/customers">
                        <Users className="h-4 w-4" />
                        <span>Customers</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/segments')} size="lg" tooltip="Segments" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/segments">
                        <UserCog className="h-4 w-4" />
                        <span>Segments</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/reviews')} size="lg" tooltip="Reviews" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/reviews">
                        <FileText className="h-4 w-4" />
                        <span>Reviews</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-border/30" />

            {/* Content */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/pages')} size="lg" tooltip="Pages" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/pages">
                        <FileText className="h-4 w-4" />
                        <span>Pages</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/media')} size="lg" tooltip="Media" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/media">
                        <ImageIcon className="h-4 w-4" />
                        <span>Media</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-border/30" />

            {/* Marketing */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Marketing</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/campaigns')} size="lg" tooltip="Campaigns" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/campaigns">
                        <Megaphone className="h-4 w-4" />
                        <span>Campaigns</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/seo')} size="lg" tooltip="SEO" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/seo">
                        <Search className="h-4 w-4" />
                        <span>SEO</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-border/30" />

            {/* Configuration */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Configuration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/settings')} size="lg" tooltip="Settings" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/settings">
                        <SettingsIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/shipping')} size="lg" tooltip="Shipping" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/shipping">
                        <Truck className="h-4 w-4" />
                        <span>Shipping</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/taxes')} size="lg" tooltip="Taxes" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/taxes">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Taxes</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/payments')} size="lg" tooltip="Payments" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/payments">
                        <Wallet className="h-4 w-4" />
                        <span>Payments</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin/integrations')} size="lg" tooltip="Integrations" className={`${activeItemClass} h-10 px-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent/50`}>
                      <NavLink to="/admin/integrations">
                        <Plug className="h-4 w-4" />
                        <span>Integrations</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-3 border-t border-border/50">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/10">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-blue-500 rounded-md flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Premium Dashboard</p>
                <p className="text-[10px] text-muted-foreground">Full access</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-10 px-3 rounded-lg font-medium text-sm">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 min-w-0">
          <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur-xl px-4 shadow-sm">
            <SidebarTrigger className="h-9 w-9 rounded-lg" />
            <div className="flex-1 pl-0.5">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/admin" className="text-sm font-medium">Admin</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {segments.slice(1).map((seg, idx) => {
                    const href = '/' + segments.slice(0, idx + 2).join('/');
                    const isLast = idx === segments.slice(1).length - 1;
                    return (
                      <Fragment key={href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="capitalize text-sm font-medium">{seg.replace(/-/g, ' ')}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={href} className="capitalize text-sm font-medium hover:text-primary transition-colors">{seg.replace(/-/g, ' ')}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search…" className="pl-8 w-56 h-9 rounded-lg border-border/50 focus:border-primary/50 text-sm" />
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5 h-9 px-3 rounded-lg border-border/50 hover:border-primary/50 text-sm">
                <Link to="/">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View store
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5 h-9 px-3 rounded-lg bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg text-sm">
                <Link to="/admin/products">
                  <Plus className="h-3.5 w-3.5" />
                  Add product
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Enhanced background layers */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-primary/6 to-transparent blur-3xl" />
            <div className="absolute top-32 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/6 to-transparent blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-purple-500/6 to-transparent blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.9) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
              }}
            />
          </div>
          
          <div className="p-4 w-full pl-6 md:pl-10 lg:pl-12">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
