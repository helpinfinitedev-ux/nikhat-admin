export interface ICustomerRating {
  _id?: string;
  customerName: string;
  rating: number;
  description: string;
  links: string[];
  imageUrls: string[];
  treatment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
