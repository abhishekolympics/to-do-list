export const validateEmail = (email) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const validatePassword = (password) => {
    // Check if the password meets certain criteria, such as minimum length
    return password.length >= 8; // Example: Minimum 6 characters
  };
  