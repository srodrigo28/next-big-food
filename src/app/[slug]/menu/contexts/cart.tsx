"use client";

import { AllergyType, Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface CartProductAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartRemovedIngredient {
  ingredientId: string;
  name: string;
}

export interface CartProductCustomization {
  removedIngredients: CartRemovedIngredient[];
  addons: CartProductAddon[];
  observation: string;
  hasAllergy: boolean;
  allergyTypes: AllergyType[];
  allergyNotes: string;
}

export interface CartProduct
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  cartItemId: string;
  quantity: number;
  unitPrice: number;
  customization?: CartProductCustomization;
}

export interface ICartContext {
  isOpen: boolean;
  products: CartProduct[];
  total: number;
  totalQuantity: number;
  toggleCart: () => void;
  addProduct: (product: Omit<CartProduct, "cartItemId">) => void;
  decreaseProductQuantity: (cartItemId: string) => void;
  increaseProductQuantity: (cartItemId: string) => void;
  removeProduct: (cartItemId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  total: 0,
  totalQuantity: 0,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProduct: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const total = products.reduce((acc, product) => {
    return acc + product.unitPrice * product.quantity;
  }, 0);
  const totalQuantity = products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };
  const addProduct = (product: Omit<CartProduct, "cartItemId">) => {
    const matchingProduct = products.find(
      (prevProduct) =>
        prevProduct.id === product.id &&
        JSON.stringify(prevProduct.customization) ===
          JSON.stringify(product.customization),
    );
    if (!matchingProduct) {
      return setProducts((prev) => [
        ...prev,
        { ...product, cartItemId: crypto.randomUUID() },
      ]);
    }
    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        if (prevProduct.cartItemId === matchingProduct.cartItemId) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity,
          };
        }
        return prevProduct;
      });
    });
  };
  const decreaseProductQuantity = (cartItemId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        if (prevProduct.cartItemId !== cartItemId) {
          return prevProduct;
        }
        if (prevProduct.quantity === 1) {
          return prevProduct;
        }
        return { ...prevProduct, quantity: prevProduct.quantity - 1 };
      });
    });
  };
  const increaseProductQuantity = (cartItemId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        if (prevProduct.cartItemId !== cartItemId) {
          return prevProduct;
        }
        return { ...prevProduct, quantity: prevProduct.quantity + 1 };
      });
    });
  };
  const removeProduct = (cartItemId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((prevProduct) => prevProduct.cartItemId !== cartItemId),
    );
  };
  const clearCart = () => setProducts([]);
  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProduct,
        clearCart,
        total,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
