import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Globe, Bell, Shield } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="store">Store Details</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="NO DISTRAXIONZ" />
              </div>
              <div>
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input id="storeEmail" type="email" defaultValue="contact@nodistraxionz.com" />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea 
                  id="storeDescription" 
                  placeholder="Describe your store..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="address">Store Address</Label>
                <Input id="address" placeholder="123 Main St, City, State, ZIP" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Orders</p>
                    <p className="text-sm text-muted-foreground">Get notified when a new order is placed</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">Alert when products are running low</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Customer Reviews</p>
                    <p className="text-sm text-muted-foreground">Notify when new reviews are submitted</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
              <Button>Save Preferences</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Security Settings</h3>
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
