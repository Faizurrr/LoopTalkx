import { useAuth } from '../context/AuthContext';

// Custom hook for easy auth access
export const useAuthUser = () => {
  return useAuth();
};
