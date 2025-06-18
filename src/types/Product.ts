export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  imageDefault: string;
  imageByColor: { [color: string]: string | undefined };
  colors: string[];
  collections: string[];
}; 