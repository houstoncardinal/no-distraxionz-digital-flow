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

  // Load wishlist from localStorage only (database sync disabled until tables are created)
  useEffect(() => {
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

    loadFromLocalStorage();
  }, []);

  // Save wishlist to localStorage only
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

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


