export type Product = {
  id: string;
  name: string;
  category: string;
  gender: string;
  type: string;
  price: number;
  description: string;
  image: string;
  colors: string[];
  sizes: (number | string)[];
  tags: string[];
  // Legacy fields for backward compatibility
  imageDefault?: string;
  imageByColor?: { [color: string]: string };
}; 