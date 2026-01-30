"use client";

import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Link as LinkIcon } from "lucide-react";
import { ICustomerRating } from "@/interfaces";
import { useContext, useState } from "react";
import { TestimonialContext } from "@/context/testimonials";
import { Button } from "@/components/ui/button";
import AddTestimonialModal from "./_components/add-testimonial-modal";
import DateService from "@/utils/date";

export default function TestimonialsPage() {
  const { testimonials, loading } = useContext(TestimonialContext);
  const [open, setOpen] = useState(false);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="w-full flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-500 mt-1">Customer reviews and ratings</p>
          </div>
          <Button onClick={() => setOpen(true)}>Add Testimonial</Button>
        </div>

        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial: ICustomerRating, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{testimonial.customerName}</CardTitle>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{testimonial.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {DateService.getDateInDDMonthNameYYYY(testimonial?.createdAt?.toString() || "")}
                  </div>
                  {testimonial.links.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <LinkIcon className="h-4 w-4" />
                      <a href={testimonial.links[0]} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Review
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {testimonials?.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No testimonials found</p>
          </div>
        )}
      </div>
      <AddTestimonialModal open={open} setOpen={setOpen} />
    </AdminLayout>
  );
}
