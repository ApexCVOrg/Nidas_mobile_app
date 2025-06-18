export type Product = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  description: string;
  imageDefault?: string;
  imageByColor?: { [color: string]: string | undefined };
  colors: string[];
  collections?: string[];
  gender?: string;
  type?: string;
  image?: string;
  sizes?: (number | string)[];
  tags?: string[];
}; 