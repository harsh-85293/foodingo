import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  linkText, 
  linkTo, 
  linkLabel 
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18V8l5 3.5V17h-2v-3a1 1 0 00-1-1H8a1 1 0 00-1 1v3H5V11.5L10 8v10z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">
                {subtitle}{' '}
                {linkText && linkTo && (
                  <Link
                    to={linkTo}
                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    {linkText}
                  </Link>
                )}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div>
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding (hidden on mobile) */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
            <div className="text-center max-w-md">
              {/* Food Icon */}
              <div className="mb-8">
                <svg className="w-24 h-24 mx-auto text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              
              <h3 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
                Welcome to Foodingo
              </h3>
              <p className="text-xl mb-8 leading-relaxed text-white drop-shadow-md">
                Your favorite restaurants, delivered fast and fresh to your doorstep
              </p>
              
              {/* Features List */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white drop-shadow-md">Lightning fast delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white drop-shadow-md">Thousands of restaurants</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white drop-shadow-md">Secure payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white drop-shadow-md">24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;