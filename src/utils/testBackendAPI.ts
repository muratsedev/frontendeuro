// Test file to check backend API connection
const testBackendAPI = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
  const CATEGORIES_API_URL = `${BASE_URL}/api/Categories`;
  
  console.log('Testing backend API:', CATEGORIES_API_URL);
  
  try {
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Backend categories data:', data);
    
    return data;
  } catch (error) {
    console.error('Backend API test failed:', error);
    throw error;
  }
};

// For Node.js testing (uncomment if running in Node.js)
// testBackendAPI().catch(console.error);

export default testBackendAPI;