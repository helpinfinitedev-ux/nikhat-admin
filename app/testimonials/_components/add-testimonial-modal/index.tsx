import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICustomerRating } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { TestimonialsService } from "@/services/testimonials.service";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";
import { useTestimonials } from "@/context/testimonials";
import { uploadImage } from "@/utils/firebase";

const AddTestimonialModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [formData, setFormData] = useState<Omit<ICustomerRating, "date">>({
    customerName: "",
    rating: 0,
    description: "",
    treatment: "",
    links: [],
    imageUrls: [],
  });
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const { setTrigger } = useTestimonials();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddLink = () => {
    setFormData({ ...formData, links: [...formData.links, ""] });
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleAddImageUrl = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  const handleRemoveImageUrl = (index: number) => {
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  const handleImageUpload = async (index: number, file?: File | null) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const url = (await uploadImage(file)) as string;
      handleImageUrlChange(index, url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = async () => {
    // Filter out empty links and imageUrls before submitting
    const payload = {
      ...formData,
      rating: Number(formData.rating),
      links: formData.links.filter((link) => link.trim() !== ""),
      imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
    };
    const [response, error] = await TestimonialsService.createRating(payload);
    if (error) {
      toast.error(error.message);
      setOpen(false);
    } else {
      setOpen(false);
      setTrigger((prev) => !prev);
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <DialogDescription>Add a new testimonial to the database</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="Name" value={formData.customerName} onChange={handleInputChange} name="customerName" />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="rating">Rating</Label>
            <Input type="number" id="rating" placeholder="Rating" min={0} max={5} value={formData.rating} onChange={handleInputChange} name="rating" />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="treatment">Treatment</Label>
            <Input type="text" id="treatment" placeholder="Treatment" value={formData.treatment} onChange={handleInputChange} name="treatment" />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Description" value={formData.description} onChange={handleInputChange} name="description" />
          </div>

          {/* Links Section */}
          <div className="grid w-full items-center gap-2">
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
                <Input type="url" placeholder="https://example.com" value={link} onChange={(e) => handleLinkChange(index, e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveLink(index)}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {/* Image URLs Section */}
          <div className="grid w-full items-center gap-2">
            <div className="flex items-center justify-between">
              <Label>Images</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                <Plus className="h-4 w-4 mr-1" />
                Add Image
              </Button>
            </div>
            {formData.imageUrls.length === 0 && <p className="text-sm text-gray-500">No images added yet</p>}
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input type="url" placeholder="https://example.com/image.jpg" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImageUrl(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="flex-1"
                    disabled={!!uploading[index]}
                    onChange={(e) => handleImageUpload(index, e.target.files?.[0])}
                  />
                  {uploading[index] && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                </div>
                {url && (
                  <img src={url} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded-md border" />
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit}>Add Testimonial</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestimonialModal;
