import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || 'An error occurred';
    toast.error(message);
    return message;
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
    return 'Network error';
  } else {
    toast.error('Something went wrong');
    return 'Unknown error';
  }
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};