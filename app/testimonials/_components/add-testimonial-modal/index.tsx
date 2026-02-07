import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICustomerRating } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { TestimonialsService } from "@/services/testimonials.service";
import { toast } from "sonner";
const AddTestimonialModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [formData, setFormData] = useState<Omit<ICustomerRating, "date">>({
    customerName: "",
    rating: 0,
    description: "",
    treatment: "",
    links: [],
    imageUrls: [],
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value as string | number | string[] });
  };
  const handleAddLink = () => {
    setFormData({ ...formData, links: [...formData.links, ""] });
  };
  const handleAddImageUrl = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
  };

  const handleSubmit = async () => {
    const [response, error] = await TestimonialsService.createRating(formData);
    if (error) {
      toast.error(error.message);
      setOpen(false);
    } else {
      setOpen(false);
      toast.success("Testimonial created successfully");
    }
  };
  const handleClose = () => {
    setOpen(false);
    setFormData({
      treatment: "",
      customerName: "",
      rating: 0,
      description: "",
      links: [],
      imageUrls: [],
    });
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <DialogDescription>Add a new testimonial to the database</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="Name" value={formData.customerName} onChange={handleInputChange} name="customerName" />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="rating">Rating</Label>
            <Input type="number" id="rating" placeholder="Rating" value={formData.rating} onChange={handleInputChange} name="rating" />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="treatment">Treatment</Label>
            <Input type="text" id="treatment" placeholder="Treatment" value={formData.treatment} onChange={handleInputChange} name="treatment" />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Description" value={formData.description} onChange={handleInputChange} name="description" />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="links">Links</Label>
            <Input type="text" id="links" placeholder="Links" value={formData.links} onChange={handleInputChange} name="links" />
          </div>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="imageUrls">Image URLs</Label>
            <Input type="text" id="imageUrls" placeholder="Image URLs" value={formData.imageUrls.join(",")} onChange={handleInputChange} name="imageUrls" />
            <Button variant="outline" onClick={handleAddImageUrl}>
              Add Image URL
            </Button>
          </div>
          <Button onClick={handleSubmit}>Add Testimonial</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestimonialModal;
