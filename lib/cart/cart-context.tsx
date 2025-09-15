"use client"

import type React from "react"

import { createContext, useContext, useEffect, useReducer } from "react"
import { useToast } from "@/hooks/use-toast"

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  slug: string
  image_url?: string
  price: number
  currency: string
  quantity: number
  stock: number
  category: string
  brand?: string
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  lastUpdated: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId && item.variantId === action.payload.variantId,
      )

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...state.items]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1)
        const maxQuantity = Math.min(existingItem.stock, 10) // Max 10 per item

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: Math.min(newQuantity, maxQuantity),
        }

        return {
          ...state,
          items: updatedItems,
          lastUpdated: Date.now(),
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          quantity: Math.min(action.payload.quantity || 1, action.payload.stock, 10),
        }

        return {
          ...state,
          items: [...state.items, newItem],
          lastUpdated: Date.now(),
        }
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        lastUpdated: Date.now(),
      }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => {
          if (item.id === action.payload.id) {
            const newQuantity = Math.max(0, Math.min(action.payload.quantity, item.stock, 10))
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]

      return {
        ...state,
        items: updatedItems,
        lastUpdated: Date.now(),
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        lastUpdated: Date.now(),
      }

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        isLoading: false,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  isLoading: boolean
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItem: (productId: string, variantId?: string) => CartItem | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "shaderstore-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
    lastUpdated: Date.now(),
  })

  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart.items || [] })
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify({
            items: state.items,
            lastUpdated: state.lastUpdated,
          }),
        )
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [state.items, state.lastUpdated, state.isLoading])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({ type: "ADD_ITEM", payload: item })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const removeItem = (id: string) => {
    const item = state.items.find((item) => item.id === id)
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed from your cart.`,
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const getItem = (productId: string, variantId?: string) => {
    return state.items.find((item) => item.productId === productId && item.variantId === variantId)
  }

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)

  const value: CartContextType = {
    items: state.items,
    itemCount,
    totalAmount,
    isLoading: state.isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
