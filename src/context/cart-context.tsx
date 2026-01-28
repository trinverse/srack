'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { MenuItem, OrderDay } from '@/types/database';

export interface CartItemWithDetails {
  id: string;
  menuItem: MenuItem;
  size: '8oz' | '16oz' | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CartState {
  items: CartItemWithDetails[];
  orderDay: OrderDay | null;
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; size: '8oz' | '16oz' | null; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_ORDER_DAY'; payload: OrderDay }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'SET_LOADING'; payload: boolean };

const CART_STORAGE_KEY = 'spice-rack-cart';

function getItemPrice(menuItem: MenuItem, size: '8oz' | '16oz' | null): number {
  if (menuItem.has_size_options && size) {
    return size === '8oz' ? (menuItem.price_8oz || 0) : (menuItem.price_16oz || 0);
  }
  return menuItem.single_price || 0;
}

function generateCartItemId(menuItemId: string, size: '8oz' | '16oz' | null): string {
  return `${menuItemId}-${size || 'single'}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, size, quantity } = action.payload;
      const itemId = generateCartItemId(menuItem.id, size);
      const unitPrice = getItemPrice(menuItem, size);

      const existingItemIndex = state.items.findIndex(item => item.id === itemId);

      let newItems: CartItemWithDetails[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: unitPrice * newQuantity,
            };
          }
          return item;
        });
      } else {
        // Add new item
        const newItem: CartItemWithDetails = {
          id: itemId,
          menuItem,
          size,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        newItems = [...state.items, newItem];
      }

      const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        subtotal,
        itemCount,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        subtotal,
        itemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }

      const newItems = state.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      });

      const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: newItems,
        subtotal,
        itemCount,
      };
    }

    case 'SET_ORDER_DAY': {
      return {
        ...state,
        orderDay: action.payload,
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        orderDay: null,
        subtotal: 0,
        itemCount: 0,
        isLoading: false,
      };
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  orderDay: null,
  subtotal: 0,
  itemCount: 0,
  isLoading: true,
};

interface CartContextType {
  state: CartState;
  addItem: (menuItem: MenuItem, size: '8oz' | '16oz' | null, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setOrderDay: (day: OrderDay) => void;
  clearCart: () => void;
  meetsMinimum: boolean;
  minimumOrderAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MINIMUM_ORDER_AMOUNT = 30;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { ...parsed, isLoading: false } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addItem = useCallback((menuItem: MenuItem, size: '8oz' | '16oz' | null, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, size, quantity } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const setOrderDay = useCallback((day: OrderDay) => {
    dispatch({ type: 'SET_ORDER_DAY', payload: day });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const meetsMinimum = state.subtotal >= MINIMUM_ORDER_AMOUNT;

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        setOrderDay,
        clearCart,
        meetsMinimum,
        minimumOrderAmount: MINIMUM_ORDER_AMOUNT,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
