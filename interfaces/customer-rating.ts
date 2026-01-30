export interface ICustomerRating {
  customerName: string;
  rating: number;
  description: string;
  links: string[];
  imageUrls: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
