import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthLayout from './AuthLayout';
import FormInput from './FormInput';
import Button from './Button';
import Alert from './Alert';
import { validateForm } from '../../utils/validation';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Handle success message from signup redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateFormData = () => {
    const validation = validateForm(formData, 'login');
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email.trim(), formData.password);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
      } else {
        console.log('Login failed:', result.message);
        document.getElementById('email')?.focus();
      }
    } catch (err) {
      console.error('Login error:', err);
      document.getElementById('email')?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Or"
      linkText="create a new account"
      linkTo="/signup"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            autoComplete="email"
            required
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            autoComplete="current-password"
            required
          />
        </div>

        {successMessage && (
          <Alert type="success" message={successMessage} />
        )}

        {error && (
          <Alert type="error" message={error} />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting || loading}
          disabled={isSubmitting || loading}
          className="w-full"
        >
          {isSubmitting || loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;