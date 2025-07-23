import axios from 'axios';

const API_URL = 'http://192.168.100.246:3000'; // Thay <YOUR_IP> bằng IP máy tính của bạn

// USERS
export const getUsers = () => axios.get(`${API_URL}/users`);
export const createUser = (user: any) => axios.post(`${API_URL}/users`, user);
export const updateUser = (id: string, user: any) => axios.put(`${API_URL}/users/${id}`, user);
export const deleteUser = (id: string) => axios.delete(`${API_URL}/users/${id}`);

// Đăng nhập bằng username hoặc email, kiểm tra password và xác thực email
export const loginUser = async ({ usernameOrEmail, password }: { usernameOrEmail: string, password: string }) => {
  // Lấy toàn bộ users
  const res = await getUsers();
  const users = res.data;
  // Tìm user theo username hoặc email
  const user = users.find((u: any) =>
    u.username === usernameOrEmail || u.email === usernameOrEmail
  );
  if (!user) {
    throw new Error('Tài khoản không tồn tại');
  }
  if (!user.isEmailVerified) {
    throw new Error('Tài khoản chưa xác thực email. Vui lòng kiểm tra email để xác thực.');
  }
  if (user.password !== password) {
    throw new Error('Mật khẩu không đúng');
  }
  // Tạo token mock
  const token = `mock_token_${user.id}_${Date.now()}`;
  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        username: user.username
      }
    }
  };
};

// Lấy thông tin user và address theo userId
export const getUserWithAddresses = async (userId: string) => {
  const [usersRes, addressesRes] = await Promise.all([
    getUsers(),
    axios.get(`${API_URL}/addresses`)
  ]);
  const user = usersRes.data.find((u: any) => u.id === userId);
  const addresses = addressesRes.data.filter((a: any) => a.userId === userId);
  return { user, addresses };
};

// PRODUCTS
export const getProducts = () => axios.get(`${API_URL}/products`);
export const createProduct = (product: any) => axios.post(`${API_URL}/products`, product);
export const updateProduct = (id: string, product: any) => axios.put(`${API_URL}/products/${id}`, product);
export const deleteProduct = (id: string) => axios.delete(`${API_URL}/products/${id}`);

// Lấy toàn bộ products từ mock API
export const getAllProducts = async () => {
  const res = await getProducts();
  return res.data;
};

// ORDERS
export const getOrders = () => axios.get(`${API_URL}/orders`);
export const createOrder = (order: any) => axios.post(`${API_URL}/orders`, order);
export const updateOrder = (id: string, order: any) => axios.put(`${API_URL}/orders/${id}`, order);
export const deleteOrder = (id: string) => axios.delete(`${API_URL}/orders/${id}`); 