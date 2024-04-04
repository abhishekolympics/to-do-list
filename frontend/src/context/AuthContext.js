// import React, { createContext, useState, useContext } from 'react';
// import useAuth from '../hooks/useAuth';

// const AuthContext = createContext();

// export const useAuthContext = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const { loginUser, registerUser } = useAuth();

//   const login = async (formData) => {
//     try {
//       const userData = await loginUser(formData);
//       setUser(userData);
//     } catch (error) {
//       console.error('Login error:', error);
//       // Handle login error (e.g., display error message)
//     }
//   };

//   const register = async (formData) => {
//     try {
//       const userData = await registerUser(formData);
//       setUser(userData);
//     } catch (error) {
//       console.error('Registration error:', error);
//       // Handle registration error (e.g., display error message)
//     }
//   };

//   const logout = () => {
//     // Implement logout functionality
//     setUser(null);
//   };

//   console.log('AuthProvider rendering with user:', user);

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
