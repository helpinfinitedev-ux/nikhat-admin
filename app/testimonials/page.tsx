"use client";

import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Link as LinkIcon } from "lucide-react";
import { ICustomerRating } from "@/interfaces";

const sampleTestimonials: ICustomerRating[] = [
  {
    customerName: "John Doe",
    rating: 5,
    description:
      "Excellent product! The quality exceeded my expectations and the customer service was outstanding.",
    date: new Date("2024-01-15"),
    links: ["https://example.com/review1"],
    imageUrls: [],
  },
  {
    customerName: "Jane Smith",
    rating: 4,
    description:
      "Very satisfied with my purchase. Fast delivery and great product quality.",
    date: new Date("2024-01-20"),
    links: [],
    imageUrls: [],
  },
  {
    customerName: "Mike Johnson",
    rating: 5,
    description:
      "Amazing experience from start to finish. Highly recommend to anyone looking for quality products.",
    date: new Date("2024-01-25"),
    links: ["https://example.com/review3"],
    imageUrls: [],
  },
];

export default function TestimonialsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 mt-1">Customer reviews and ratings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTestimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {testimonial.customerName}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {testimonial.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {testimonial.date.toLocaleDateString()}
                </div>
                {testimonial.links.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={testimonial.links[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      View Review
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
