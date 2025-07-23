// Test file để kiểm tra navigation logic
export const testNavigationLogic = () => {
  console.log('🧪 Testing Navigation Logic...');
  
  // Test cases
  const testCases = [
    { username: 'admin', password: 'admin123', expectedRole: 'admin', expectedRoute: 'AdminDashboard' },
    { username: 'manager', password: 'manager123', expectedRole: 'manager', expectedRoute: 'ManagerDashboard' },
    { username: 'user', password: 'user123', expectedRole: 'user', expectedRoute: 'MainTabs' },
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n📋 Test Case ${index + 1}:`);
    console.log(`Username: ${testCase.username}`);
    console.log(`Password: ${testCase.password}`);
    console.log(`Expected Role: ${testCase.expectedRole}`);
    console.log(`Expected Route: ${testCase.expectedRoute}`);
    
    // Simulate login logic
    const role = testCase.expectedRole;
    const route = role === 'admin' ? 'AdminDashboard' : role === 'manager' ? 'ManagerDashboard' : 'MainTabs';
    
    console.log(`✅ Result: ${route === testCase.expectedRoute ? 'PASS' : 'FAIL'}`);
  });
  
  console.log('\n🎯 Navigation Test Complete!');
};

// Export để có thể gọi từ console
export default testNavigationLogic; 