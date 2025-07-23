import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string; // unique: productId-color-size
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string | number;
  quantity: number;
  checked: boolean; // dùng cho chọn/xóa nhiều sản phẩm
  // shopId?: string; // nếu muốn nhóm theo shop, có thể mở comment nếu cần
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng (gộp nếu đã có cùng thuộc tính)
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id' | 'checked'>>) => {
      const newItem = action.payload;
      const cartItemId = `${newItem.productId}-${newItem.color}-${newItem.size}`;
      const existingItem = state.items.find(item => item.id === cartItemId);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          id: cartItemId,
          checked: true, // mặc định chọn khi thêm mới
        });
      }
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    // Xóa 1 sản phẩm khỏi giỏ hàng theo id
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    // Cập nhật số lượng sản phẩm (nếu quantity <= 0 thì xóa luôn)
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },

    // Chọn/bỏ chọn 1 sản phẩm
    toggleCheckItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
    },

    // Chọn/bỏ chọn tất cả sản phẩm
    toggleCheckAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(item => {
        item.checked = action.payload;
      });
    },

    // Xóa các sản phẩm đã chọn
    removeCheckedItems: (state) => {
      state.items = state.items.filter(item => !item.checked);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCheckItem, toggleCheckAll, removeCheckedItems } = cartSlice.actions;
export default cartSlice.reducer; 