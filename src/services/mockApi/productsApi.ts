import categoryProducts from '../../api/categoryProducts.json';
import homeData from '../../api/homeData.json';
import api from '../../api/axiosInstance';
import { Product } from '../../types/Product';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ProductsApiService {
  // Get all products
  async getProducts(params?: any) {
    // Gọi API GET /products từ json-server
    const response = await api.get('/products');
    let products: Product[] = response.data;
    // (Có thể filter, search, paginate ở phía client nếu muốn)
    return {
      success: true,
      data: {
        products,
        total: products.length,
        page: 1,
        limit: products.length,
        totalPages: 1
      }
    };
  }

  // Get product by ID
  async getProductById(id: string) {
    await delay(200);
    const products: Product[] = []; // No longer reading from file
    const product = products.find((p: Product) => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return {
      success: true,
      data: product
    };
  }

  // Update product sử dụng json-server
  async updateProduct(id: string, productData: Partial<Product>) {
    // PATCH /products/:id
    const response = await api.patch(`/products/${id}`, productData);
    return {
      success: true,
      data: response.data,
    };
  }

  // Add new product sử dụng json-server
  async addProduct(productData: any) {
    // POST /products
    const response = await api.post('/products', productData);
    return {
      success: true,
      data: response.data,
    };
  }

  // Delete product sử dụng json-server
  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return {
      success: true,
      data: response.data,
    };
  }

  // Get categories
  async getCategories() {
    await delay(200);
    
    return {
      success: true,
      data: homeData.categories
    };
  }

  // Get brands
  async getBrands() {
    await delay(200);
    
    const brands = Array.from(new Set(categoryProducts.map(p => p.brand)));
    
    return {
      success: true,
      data: brands.map(brand => ({ id: brand, name: brand }))
    };
  }

  // Search products
  async searchProducts(query: string) {
    await delay(400);
    
    const searchTerm = query.toLowerCase();
    const products = categoryProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    );
    
    return {
      success: true,
      data: {
        products,
        total: products.length,
        query
      }
    };
  }

  // Get featured products
  async getFeaturedProducts() {
    await delay(300);
    
    const featuredProducts = homeData.featuredProducts;
    
    return {
      success: true,
      data: featuredProducts
    };
  }

  // Get products by category
  async getProductsByCategory(categoryId: string) {
    await delay(300);
    
    const products = categoryProducts.filter(p => p.category === categoryId);
    
    return {
      success: true,
      data: {
        products,
        total: products.length,
        category: categoryId
      }
    };
  }
} 