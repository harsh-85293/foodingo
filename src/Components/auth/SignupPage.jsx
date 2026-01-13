import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthLayout from './AuthLayout';
import FormInput from './FormInput';
import Button from './Button';
import Alert from './Alert';
import { validateForm, calculatePasswordStrength } from '../../utils/validation';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  const { signup, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

  // Password strength validation
  const validatePasswordStrength = (password) => {
    return calculatePasswordStrength(password);
  };

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

    // Real-time validation
    if (name === 'email' && value.trim()) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(value)) {
        setFormErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }));
      }
    }

    if (name === 'password') {
      const strength = validatePasswordStrength(value);
      setPasswordStrength(strength);
      
      if (value && value.length < 6) {
        setFormErrors(prev => ({
          ...prev,
          password: 'Password must be at least 6 characters long'
        }));
      }

      // Check confirm password match if it exists
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }

    if (name === 'confirmPassword') {
      if (value && value !== formData.password) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      }
    }
  };

  // Validate form data
  const validateFormData = () => {
    const validation = validateForm(formData, 'signup');
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
      const result = await signup(formData.email.trim(), formData.password);
      
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: result.message || 'Account created successfully! Please login to continue.' 
          }
        });
      } else {
        console.log('Signup failed:', result.message);
        document.getElementById('email')?.focus();
      }
    } catch (err) {
      console.error('Signup error:', err);
      document.getElementById('email')?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Or"
      linkText="sign in to your existing account"
      linkTo="/login"
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

          <div>
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              autoComplete="new-password"
              required
            />
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 min-w-0 flex-shrink-0">
                    {passwordStrength.feedback}
                  </span>
                </div>
              </div>
            )}
          </div>

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={formErrors.confirmPassword}
            autoComplete="new-password"
            required
          />
        </div>

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
          {isSubmitting || loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;