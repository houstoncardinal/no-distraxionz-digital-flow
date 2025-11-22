import { supabase } from '@/integrations/supabase/client';

// Database connection and integration utilities

// Test database connection
export const testDatabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Test basic connection by fetching a simple query
    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return {
        success: false,
        message: 'Database connection failed',
        details: error,
      };
    }

    return {
      success: true,
      message: 'Database connection successful',
      details: { recordCount: data },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Database connection error',
      details: error,
    };
  }
};

// Test storage connection
export const testStorageConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      return {
        success: false,
        message: 'Storage connection failed',
        details: error,
      };
    }

    return {
      success: true,
      message: 'Storage connection successful',
      details: { buckets: data?.length || 0 },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Storage connection error',
      details: error,
    };
  }
};

// Test authentication
export const testAuthentication = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        message: 'Authentication check failed',
        details: error,
      };
    }

    return {
      success: true,
      message: 'Authentication system working',
      details: { hasSession: !!data.session },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Authentication error',
      details: error,
    };
  }
};

// Comprehensive system health check
export const performSystemHealthCheck = async (): Promise<{
  database: { success: boolean; message: string; details?: any };
  storage: { success: boolean; message: string; details?: any };
  auth: { success: boolean; message: string; details?: any };
  overall: boolean;
}> => {
  const [dbResult, storageResult, authResult] = await Promise.all([
    testDatabaseConnection(),
    testStorageConnection(),
    testAuthentication(),
  ]);

  const overall = dbResult.success && storageResult.success && authResult.success;

  return {
    database: dbResult,
    storage: storageResult,
    auth: authResult,
    overall,
  };
};

// Initialize database tables and relationships
export const initializeDatabase = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Check if essential tables exist by trying to query them
    const checks = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('order_items').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
    ]);

    const failedCheck = checks.find(check => check.error);
    if (failedCheck) {
      return {
        success: false,
        message: 'Database table check failed',
        details: failedCheck.error,
      };
    }

    return {
      success: true,
      message: 'All database tables are accessible',
      details: { tablesChecked: checks.length },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Database initialization check failed',
      details: error,
    };
  }
};

// Sync product images from storage to database
export const syncProductImages = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // This would sync images from storage to the product_images table
    // For now, just check if the table is accessible
    const { error } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        success: false,
        message: 'Product images table check failed',
        details: error,
      };
    }

    return {
      success: true,
      message: 'Product images integration ready',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Product images sync check failed',
      details: error,
    };
  }
};

// Get database statistics
export const getDatabaseStats = async (): Promise<{
  success: boolean;
  stats?: {
    products: number;
    orders: number;
    reviews: number;
    users: number;
  };
  error?: string;
}> => {
  try {
    const [products, orders, reviews, users] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    return {
      success: true,
      stats: {
        products: products.count || 0,
        orders: orders.count || 0,
        reviews: reviews.count || 0,
        users: users.count || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch database statistics',
    };
  }
};
