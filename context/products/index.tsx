"use client";
import { IProduct } from "@/interfaces";
import { ProductsService } from "@/services/products.service";
import { createContext, useContext, useEffect, useState } from "react";

export const ProductContext = createContext<
  | {
      products: IProduct[];
      setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
      loading: boolean;
      trigger: boolean;
      setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
      fetchProducts: () => Promise<void>;
    }
  | undefined
>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const [response, error] = await ProductsService.getProducts();
    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      setProducts(response?.data?.data || []);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchProducts();
  }, [trigger]);
  const value = {
    products,
    setProducts,
    loading,
    trigger,
    setTrigger,
    fetchProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
