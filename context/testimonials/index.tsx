"use client";
import { ICustomerRating } from "@/interfaces";
import { TestimonialsService } from "@/services/testimonials.service";
import { createContext, useEffect, useState } from "react";

export const TestimonialContext = createContext<
  | {
      testimonials: ICustomerRating[];
      setTestimonials: (testimonials: ICustomerRating[]) => void;
      loading: boolean;
    }
  | undefined
>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<ICustomerRating[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return <TestimonialContext.Provider value={{ testimonials, setTestimonials, loading }}>{children}</TestimonialContext.Provider>;
};
