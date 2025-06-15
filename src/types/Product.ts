export type Product = {
  id: string;
  name: string;
  category: string;
  imageDefault: string;
  imageByColor: { [color: string]: string };
  colors: string[];
}; 