export interface IBlog {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
