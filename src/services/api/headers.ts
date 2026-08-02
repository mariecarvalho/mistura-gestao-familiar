// Helper que injeta o Authorization header em todas as requests
export const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
});
