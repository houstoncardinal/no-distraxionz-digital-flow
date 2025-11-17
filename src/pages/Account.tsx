import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, MapPin, Package, Trash2, Plus, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Address {
  id: string;
  address_type: string;
  is_default: boolean;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

interface LoyaltyPoints {
  id: string;
  current_points: number;
  lifetime_points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface LoyaltyTransaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    address_type: 'shipping',
    is_default: false,
    country: 'US',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to view your account.',
      });
      navigate('/auth');
      return;
    }

    setUser(user);
    await fetchProfile(user.id);
    await fetchAddresses(user.id);
    await fetchLoyaltyPoints(user.id);
    await fetchLoyaltyTransactions(user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: 'Error loading profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading addresses',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchLoyaltyPoints = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setLoyaltyPoints(data);
    } catch (error: any) {
      console.error('Error loading loyalty points:', error);
    }
  };

  const fetchLoyaltyTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLoyaltyTransactions(data || []);
    } catch (error: any) {
      console.error('Error loading loyalty transactions:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          postal_code: profile.postal_code,
          country: profile.country,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user || !newAddress.first_name || !newAddress.last_name || !newAddress.address_line1 || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('customer_addresses')
        .insert({
          user_id: user.id,
          ...newAddress,
        });

      if (error) throw error;

      toast({
        title: 'Address added',
        description: 'Your address has been saved.',
      });

      setIsAddressDialogOpen(false);
      setNewAddress({
        address_type: 'shipping',
        is_default: false,
        country: 'US',
      });
      await fetchAddresses(user.id);
    } catch (error: any) {
      toast({
        title: 'Failed to add address',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: 'Address deleted',
        description: 'The address has been removed.',
      });

      await fetchAddresses(user.id);
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      // First, unset all default addresses
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the new default
      const { error } = await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: 'Default address updated',
      });

      await fetchAddresses(user.id);
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-padding-modern py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-padding-modern py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-playfair font-medium mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="loyalty">
                <Award className="h-4 w-4 mr-2" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="orders" onClick={() => navigate('/my-orders')}>
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profile?.full_name || ''}
                          onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile?.phone || ''}
                          onChange={(e) => setProfile({ ...profile!, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Manage your shipping and billing addresses</CardDescription>
                    </div>
                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Address
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Address</DialogTitle>
                          <DialogDescription>Enter your shipping or billing address details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first_name">First Name *</Label>
                              <Input
                                id="first_name"
                                value={newAddress.first_name || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, first_name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last_name">Last Name *</Label>
                              <Input
                                id="last_name"
                                value={newAddress.last_name || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, last_name: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address_line1">Address Line 1 *</Label>
                            <Input
                              id="address_line1"
                              value={newAddress.address_line1 || ''}
                              onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address_line2">Address Line 2</Label>
                            <Input
                              id="address_line2"
                              value={newAddress.address_line2 || ''}
                              onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={newAddress.city || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State *</Label>
                              <Input
                                id="state"
                                value={newAddress.state || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="postal_code">Postal Code *</Label>
                              <Input
                                id="postal_code"
                                value={newAddress.postal_code || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={newAddress.phone || ''}
                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddAddress}>Save Address</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No saved addresses yet</p>
                      <p className="text-sm">Add an address for faster checkout</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <Card key={address.id} className={address.is_default ? 'border-black' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">
                                    {address.first_name} {address.last_name}
                                  </h4>
                                  {address.is_default && (
                                    <Badge variant="default">Default</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {address.address_line1}
                                  {address.address_line2 && `, ${address.address_line2}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.state} {address.postal_code}
                                </p>
                                {address.phone && (
                                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {!address.is_default && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                  >
                                    Set Default
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Points Tab */}
            <TabsContent value="loyalty">
              <div className="space-y-4">
                {/* Points Overview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Loyalty Rewards
                    </CardTitle>
                    <CardDescription>Earn points with every purchase and unlock exclusive benefits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loyaltyPoints ? (
                      <div className="space-y-6">
                        {/* Current Points & Tier */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-gradient-to-br from-black to-gray-800 text-white">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-sm opacity-80 mb-1">Current Points</p>
                                <p className="text-4xl font-bold">{loyaltyPoints.current_points.toLocaleString()}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-gradient-to-br from-gray-100 to-gray-200">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Lifetime Points</p>
                                <p className="text-4xl font-bold text-gray-900">{loyaltyPoints.lifetime_points.toLocaleString()}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className={`bg-gradient-to-br ${
                            loyaltyPoints.tier === 'platinum' ? 'from-purple-500 to-purple-700 text-white' :
                            loyaltyPoints.tier === 'gold' ? 'from-yellow-400 to-yellow-600 text-white' :
                            loyaltyPoints.tier === 'silver' ? 'from-gray-300 to-gray-500 text-white' :
                            'from-orange-400 to-orange-600 text-white'
                          }`}>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-sm opacity-80 mb-1">Current Tier</p>
                                <p className="text-4xl font-bold capitalize">{loyaltyPoints.tier}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Tier Benefits */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Tier Benefits
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-orange-500">Bronze</Badge>
                                <span className="text-sm text-muted-foreground">0-1,999 points</span>
                              </div>
                              <p className="text-sm">Earn 1 point per $1 spent</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-gray-400">Silver</Badge>
                                <span className="text-sm text-muted-foreground">2,000-4,999 points</span>
                              </div>
                              <p className="text-sm">1.2x points + Early sale access</p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-yellow-500">Gold</Badge>
                                <span className="text-sm text-muted-foreground">5,000-9,999 points</span>
                              </div>
                              <p className="text-sm">1.5x points + Exclusive discounts</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-300">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-purple-500">Platinum</Badge>
                                <span className="text-sm text-muted-foreground">10,000+ points</span>
                              </div>
                              <p className="text-sm">2x points + VIP perks + Free shipping</p>
                            </div>
                          </div>
                        </div>

                        {/* Progress to Next Tier */}
                        {loyaltyPoints.tier !== 'platinum' && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold mb-2">Progress to Next Tier</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{
                                    width: `${
                                      loyaltyPoints.tier === 'bronze' ? (loyaltyPoints.lifetime_points / 2000) * 100 :
                                      loyaltyPoints.tier === 'silver' ? ((loyaltyPoints.lifetime_points - 2000) / 3000) * 100 :
                                      ((loyaltyPoints.lifetime_points - 5000) / 5000) * 100
                                    }%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {loyaltyPoints.tier === 'bronze' ? 2000 - loyaltyPoints.lifetime_points :
                                 loyaltyPoints.tier === 'silver' ? 5000 - loyaltyPoints.lifetime_points :
                                 10000 - loyaltyPoints.lifetime_points} points to go
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start shopping to earn loyalty points!</p>
                        <p className="text-sm mt-2">Earn 1 point for every $1 spent</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Transaction History */}
                {loyaltyTransactions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Points History</CardTitle>
                      <CardDescription>Your recent points transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {loyaltyTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                            <div className="flex-1">
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className={`text-right ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <p className="font-bold">
                                {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.transaction_type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
