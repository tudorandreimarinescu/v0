"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer } from "react"
import { useToast } from "@/hooks/use-toast"
import { saveCart, loadCart, clearCartStorage, generateGuestId, type CartStorage } from "./cart-storage"
import { handleCartMergeOnLoginAction, saveUserCartAction, loadUserCartAction } from "./cart-actions"

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
  guestId: string | null
  userId: string | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { userId: string | null; guestId: string | null } }
  | { type: "MERGE_CART"; payload: CartItem[] }

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

    case "SET_USER":
      return {
        ...state,
        userId: action.payload.userId,
        guestId: action.payload.guestId,
      }

    case "MERGE_CART":
      return {
        ...state,
        items: action.payload,
        lastUpdated: Date.now(),
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

let supabaseClient: any = null

const getSupabaseClient = async () => {
  if (!supabaseClient) {
    try {
      const { createBrowserClient } = await import("@/lib/supabase/client")
      supabaseClient = createBrowserClient()
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      // Return a mock client for development
      supabaseClient = {
        auth: {
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
      }
    }
  }
  return supabaseClient
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
    lastUpdated: Date.now(),
    guestId: null,
    userId: null,
  })

  const { toast } = useToast()

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const supabase = await getSupabaseClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const savedCart = loadCart()
          const guestItems = savedCart?.items || []

          if (guestItems.length > 0) {
            const mergedItems = await handleCartMergeOnLoginAction(guestItems)
            dispatch({ type: "MERGE_CART", payload: mergedItems })
            clearCartStorage()
          } else {
            const userCartData = await loadUserCartAction()
            dispatch({ type: "LOAD_CART", payload: userCartData?.items || [] })
          }

          dispatch({ type: "SET_USER", payload: { userId: user.id, guestId: null } })
        } else {
          const savedCart = loadCart()
          if (savedCart) {
            dispatch({ type: "LOAD_CART", payload: savedCart.items })
            dispatch({ type: "SET_USER", payload: { userId: null, guestId: savedCart.guestId || generateGuestId() } })
          } else {
            const guestId = generateGuestId()
            dispatch({ type: "SET_USER", payload: { userId: null, guestId } })
            dispatch({ type: "SET_LOADING", payload: false })
          }
        }
      } catch (error) {
        console.error("Error initializing cart:", error)
        // Fallback to guest mode
        const savedCart = loadCart()
        if (savedCart) {
          dispatch({ type: "LOAD_CART", payload: savedCart.items })
          dispatch({ type: "SET_USER", payload: { userId: null, guestId: savedCart.guestId || generateGuestId() } })
        } else {
          const guestId = generateGuestId()
          dispatch({ type: "SET_USER", payload: { userId: null, guestId } })
          dispatch({ type: "SET_LOADING", payload: false })
        }
      }
    }

    initializeCart()
  }, [])

  useEffect(() => {
    if (!state.isLoading && state.items.length >= 0) {
      const cartData: CartStorage = {
        items: state.items,
        lastUpdated: state.lastUpdated,
        guestId: state.guestId || undefined,
      }

      if (state.userId) {
        const timeoutId = setTimeout(async () => {
          try {
            await saveUserCartAction({
              items: state.items,
              lastUpdated: state.lastUpdated,
            })
          } catch (error) {
            console.error("Error saving user cart:", error)
            saveCart(cartData)
          }
        }, 500) // Debounce by 500ms

        return () => clearTimeout(timeoutId)
      } else {
        saveCart(cartData)
      }
    }
  }, [state.items, state.lastUpdated, state.isLoading, state.userId, state.guestId])

  useEffect(() => {
    const setupAuthListener = async () => {
      try {
        const supabase = await getSupabaseClient()
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            setTimeout(async () => {
              try {
                const currentItems = state.items
                if (currentItems.length > 0) {
                  const mergedItems = await handleCartMergeOnLoginAction(currentItems)
                  dispatch({ type: "MERGE_CART", payload: mergedItems })
                }
                dispatch({ type: "SET_USER", payload: { userId: session.user.id, guestId: null } })
                clearCartStorage()
              } catch (error) {
                console.error("Error during cart merge on login:", error)
                dispatch({ type: "SET_USER", payload: { userId: session.user.id, guestId: null } })
              }
            }, 1000) // Wait 1 second for session to be fully established
          } else if (event === "SIGNED_OUT") {
            const guestId = generateGuestId()
            dispatch({ type: "SET_USER", payload: { userId: null, guestId } })
          }
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error setting up auth listener:", error)
        return () => {}
      }
    }

    setupAuthListener()
  }, [state.items])

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
