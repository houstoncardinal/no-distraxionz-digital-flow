import { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

const WISHLIST_STORAGE_KEY = 'no-distraxionz-wishlist';

interface WishlistState {
  items: Product[];
  isOpen: boolean;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'TOGGLE_WISHLIST'; payload: Product }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'TOGGLE_WISHLIST_SIDEBAR' }
  | { type: 'OPEN_WISHLIST' }
  | { type: 'CLOSE_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

const initialState: WishlistState = {
  items: [],
  isOpen: false,
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return state; // Already in wishlist
      }
      
      return {
        ...state,
        items: [...state.items, product],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case 'TOGGLE_WISHLIST': {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== product.id),
        };
      } else {
        return {
          ...state,
          items: [...state.items, product],
        };
      }
    }

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
      };

    case 'TOGGLE_WISHLIST_SIDEBAR':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN_WISHLIST':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_WISHLIST':
      return {
        ...state,
        isOpen: false,
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
}

interface WishlistContextType {
  state: WishlistState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;
  toggleWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user } = useAuth();

  // Load wishlist from database if user is logged in, otherwise from localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        // Load from database for logged-in users
        try {
          const { data, error } = await supabase
            .from('wishlists')
            .select(`
              product_id,
              products (
                id,
                name,
                price,
                image,
                description,
                category,
                stock,
                featured
              )
            `)
            .eq('user_id', user.id);

          if (error) throw error;

          // Transform the data to match Product interface
          const wishlistItems: Product[] = data
            ?.filter(item => item.products)
            .map(item => ({
              id: item.products.id,
              name: item.products.name,
              price: item.products.price,
              image: item.products.image,
              description: item.products.description || '',
              category: item.products.category,
              stock: item.products.stock,
              featured: item.products.featured,
            })) || [];

          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
        } catch (error) {
          console.error('Failed to load wishlist from database:', error);
          // Fallback to localStorage if database fails
          loadFromLocalStorage();
        }
      } else {
        // Load from localStorage for guests
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        try {
          const items = JSON.parse(savedWishlist);
          dispatch({ type: 'LOAD_WISHLIST', payload: items });
        } catch (error) {
          console.error('Failed to load wishlist from localStorage:', error);
        }
      }
    };

    loadWishlist();
  }, [user]);

  // Save wishlist to both localStorage and database
  useEffect(() => {
    // Always save to localStorage
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));

    // Sync to database if user is logged in
    if (user) {
      syncWishlistToDatabase();
    }
  }, [state.items, user]);

  const syncWishlistToDatabase = async () => {
    if (!user) return;

    try {
      // Get current wishlist from database
      const { data: currentWishlist } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      const currentProductIds = currentWishlist?.map(item => item.product_id) || [];
      const stateProductIds = state.items.map(item => item.id);

      // Find items to add (in state but not in database)
      const toAdd = stateProductIds.filter(id => !currentProductIds.includes(id));

      // Find items to remove (in database but not in state)
      const toRemove = currentProductIds.filter(id => !stateProductIds.includes(id));

      // Add new items
      if (toAdd.length > 0) {
        await supabase
          .from('wishlists')
          .insert(
            toAdd.map(productId => ({
              user_id: user.id,
              product_id: productId,
            }))
          );
      }

      // Remove items
      if (toRemove.length > 0) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .in('product_id', toRemove);
      }
    } catch (error) {
      console.error('Failed to sync wishlist to database:', error);
    }
  };

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const toggleItem = (product: Product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const toggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST_SIDEBAR' });
  };

  const openWishlist = () => {
    dispatch({ type: 'OPEN_WISHLIST' });
  };

  const closeWishlist = () => {
    dispatch({ type: 'CLOSE_WISHLIST' });
  };

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
        toggleWishlist,
        openWishlist,
        closeWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}


