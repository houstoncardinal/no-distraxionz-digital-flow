import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, HardDrive, Shield } from 'lucide-react';
import {
  performSystemHealthCheck,
  initializeDatabase,
  syncProductImages,
  getDatabaseStats
} from '@/lib/database';
import { migratePublicImages, initializeStorage } from '@/lib/storage';

interface SystemStatusProps {
  onStatusUpdate?: (status: any) => void;
}

export const SystemStatus = ({ onStatusUpdate }: SystemStatusProps) => {
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const result = await performSystemHealthCheck();
      setHealthCheck(result);
      onStatusUpdate?.(result);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runDatabaseInit = async () => {
    setInitializing(true);
    try {
      const result = await initializeDatabase();
      if (result.success) {
        await runHealthCheck(); // Refresh status
      }
      return result;
    } catch (error) {
      console.error('Database initialization failed:', error);
      return { success: false, error };
    } finally {
      setInitializing(false);
    }
  };

  const runStorageInit = async () => {
    setInitializing(true);
    try {
      const storageResult = await initializeStorage();
      const syncResult = await syncProductImages();
      const migrateResult = await migratePublicImages();

      if (storageResult && syncResult.success && migrateResult.success) {
        await runHealthCheck(); // Refresh status
      }
      return { storageResult, syncResult, migrateResult };
    } catch (error) {
      console.error('Storage initialization failed:', error);
      return { success: false, error };
    } finally {
      setInitializing(false);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await getDatabaseStats();
      setDbStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    runHealthCheck();
    loadStats();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Healthy
      </Badge>
    ) : (
      <Badge variant="destructive">
        Issues
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Status</h2>
          <p className="text-muted-foreground">
            Monitor database, storage, and authentication integrations
          </p>
        </div>
        <Button onClick={runHealthCheck} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Health Check Results */}
      {healthCheck && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthCheck.database.success)}
                <span className="text-sm">{healthCheck.database.message}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthCheck.storage.success)}
                <span className="text-sm">{healthCheck.storage.message}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authentication</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthCheck.auth.success)}
                <span className="text-sm">{healthCheck.auth.message}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overall Status */}
      {healthCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Overall System Status
              {getStatusBadge(healthCheck.overall)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!healthCheck.overall && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Some systems are not functioning properly. Check the details above and try the initialization options below.
                </AlertDescription>
              </Alert>
            )}
            {healthCheck.overall && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All systems are operating normally. Your Supabase integration is fully connected.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Database Statistics */}
      {dbStats?.success && (
        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{dbStats.stats.products}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dbStats.stats.orders}</div>
                <div className="text-sm text-muted-foreground">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dbStats.stats.reviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dbStats.stats.users}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initialization Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Initialization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Initialize Database</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure all database tables are accessible and properly configured
                </p>
              </div>
              <Button
                onClick={runDatabaseInit}
                disabled={initializing}
                variant="outline"
              >
                {initializing ? 'Initializing...' : 'Initialize Database'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Initialize Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Set up Supabase Storage bucket and sync product images
                </p>
              </div>
              <Button
                onClick={runStorageInit}
                disabled={initializing}
                variant="outline"
              >
                {initializing ? 'Initializing...' : 'Initialize Storage'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
