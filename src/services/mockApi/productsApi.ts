import categoryProducts from '../../api/categoryProducts.json';
import homeData from '../../api/homeData.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ProductsApiService {
  // Get all products
  async getProducts(params?: any) {
    await delay(300);
    
    let products = [...categoryProducts];
    
    if (params?.category) {
      products = products.filter(p => p.category === params.category);
    }
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params?.brand) {
      products = products.filter(p => p.brand === params.brand);
    }
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        products: paginatedProducts,
        total: products.length,
        page,
        limit,
        totalPages: Math.ceil(products.length / limit)
      }
    };
  }

  // Get product by ID
  async getProductById(id: string) {
    await delay(200);
    
    const product = categoryProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return {
      success: true,
      data: product
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