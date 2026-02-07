"use client";

import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Link as LinkIcon, Plus, X } from "lucide-react";
import { ICustomerRating } from "@/interfaces";
import { useState } from "react";
import { useTestimonials } from "@/context/testimonials";
import { Button } from "@/components/ui/button";
import AddTestimonialModal from "./_components/add-testimonial-modal";
import DateService from "@/utils/date";
import { TestimonialsService } from "@/services/testimonials.service";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TestimonialsPage() {
  const { testimonials, loading, setTestimonials } = useTestimonials();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ICustomerRating, "_id" | "createdAt" | "updatedAt">>({
    customerName: "",
    rating: 0,
    description: "",
    links: [],
    imageUrls: [],
    treatment: "",
  });

  const openEditModal = (testimonial: ICustomerRating) => {
    setEditingId(testimonial._id || null);
    setFormData({
      customerName: testimonial.customerName || "",
      rating: testimonial.rating || 0,
      description: testimonial.description || "",
      links: testimonial.links || [],
      imageUrls: testimonial.imageUrls || [],
      treatment: testimonial.treatment || "",
    });
    setEditOpen(true);
  };

  const handleAddLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }));
  };

  const handleLinkChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newLinks = [...prev.links];
      newLinks[index] = value;
      return { ...prev, links: newLinks };
    });
  };

  const handleRemoveLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleAddImageUrl = () => {
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newImageUrls = [...prev.imageUrls];
      newImageUrls[index] = value;
      return { ...prev, imageUrls: newImageUrls };
    });
  };

  const handleRemoveImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const payload = {
      ...formData,
      rating: Number(formData.rating),
      links: formData.links.filter((link) => link.trim() !== ""),
      imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
    };
    const [response, error] = await TestimonialsService.updateRating(editingId, payload);
    if (error) {
      toast.error(error.message || "Failed to update testimonial");
      return;
    }
    const updated = response?.data?.data as ICustomerRating;
    setTestimonials((prev) => prev.map((item) => (item._id === editingId ? updated : item)));
    toast.success("Testimonial updated successfully");
    setEditOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (testimonial: ICustomerRating) => {
    if (!testimonial._id) return;
    const confirmed = window.confirm("Delete this testimonial?");
    if (!confirmed) return;
    const [, error] = await TestimonialsService.deleteRating(testimonial._id);
    if (error) {
      toast.error(error.message || "Failed to delete testimonial");
      return;
    }
    setTestimonials((prev) => prev.filter((item) => item._id !== testimonial._id));
    toast.success("Testimonial deleted successfully");
  };

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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(testimonial)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial)}>
                        Delete
                      </Button>
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
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>Update testimonial details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Name</Label>
              <Input id="customerName" value={formData.customerName} onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min={0}
                max={5}
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Input id="treatment" value={formData.treatment} onChange={(e) => setFormData((prev) => ({ ...prev, treatment: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
            {/* Links Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Links</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddLink}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </div>
              {formData.links.length === 0 && <p className="text-sm text-gray-500">No links added yet</p>}
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveLink(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Image URLs Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Image URLs</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image URL
                </Button>
              </div>
              {formData.imageUrls.length === 0 && <p className="text-sm text-gray-500">No image URLs added yet</p>}
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImageUrl(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
