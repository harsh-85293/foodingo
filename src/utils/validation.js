// Email validation regex
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// Validation functions
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return null;
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Password strength calculation
export const calculatePasswordStrength = (password) => {
  let score = 0;
  let feedback = '';

  if (password.length === 0) {
    return { score: 0, feedback: '' };
  }

  if (password.length < 6) {
    return { score: 1, feedback: 'Too short - minimum 6 characters' };
  }

  // Scoring criteria
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Feedback based on score
  switch (score) {
    case 1:
    case 2:
      feedback = 'Weak password';
      break;
    case 3:
    case 4:
      feedback = 'Medium strength';
      break;
    case 5:
    case 6:
      feedback = 'Strong password';
      break;
    default:
      feedback = 'Very weak';
  }

  return { score, feedback };
};

// Form validation helper
export const validateForm = (formData, type = 'login') => {
  const errors = {};

  // Email validation
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Password validation
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Confirm password validation (for signup)
  if (type === 'signup') {
    const confirmPasswordError = validatePasswordConfirmation(
      formData.password, 
      formData.confirmPassword
    );
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};