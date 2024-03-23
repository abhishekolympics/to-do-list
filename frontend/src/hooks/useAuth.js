import { useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  const authContext = useAuthContext();

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { loginUser, registerUser, logoutUser, user } = authContext;

  const login = async (formData) => {
    try {
      const userData = await loginUser(formData);
      // Update user state or perform any additional actions after successful login
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (e.g., display error message)
    }
  };

  const register = async (formData) => {
    try {
      const userData = await registerUser(formData);
      // Update user state or perform any additional actions after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (e.g., display error message)
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      // Update user state or perform any additional actions after successful logout
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error (e.g., display error message)
    }
  };

  return { user, login, register, logout };
};

export default useAuth;
