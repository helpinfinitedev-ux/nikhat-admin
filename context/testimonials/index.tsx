"use client";
import { ICustomerRating } from "@/interfaces";
import { TestimonialsService } from "@/services/testimonials.service";
import { createContext, useContext, useEffect, useState } from "react";

export const TestimonialContext = createContext<
  | {
      testimonials: ICustomerRating[];
      setTestimonials: React.Dispatch<React.SetStateAction<ICustomerRating[]>>;
      loading: boolean;
      trigger: boolean;
      setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<ICustomerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const [response, error] = await TestimonialsService.getTestimonials();
      if (error) {
        console.error("Error fetching testimonials:", error.message);
      } else {
        setTestimonials((response?.data?.data as ICustomerRating[]) || []);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, [trigger]);

  return <TestimonialContext.Provider value={{ testimonials, setTestimonials, trigger, setTrigger, loading }}>{children}</TestimonialContext.Provider>;
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error("useTestimonials must be used within a TestimonialProvider");
  }
  return context;
};
