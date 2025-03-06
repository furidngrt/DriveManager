import React from 'react';
import { CloudIcon, Loader2Icon } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoggingIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card with subtle animation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
          {/* Logo and heading section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white mb-4 transform transition-transform duration-300 hover:rotate-12">
              <CloudIcon className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Drive Manager</h1>
            <p className="text-gray-600 text-sm">
              Securely access and manage your Google Drive files
            </p>
          </div>

          {/* Sign in button */}
          <button
            onClick={onLogin}
            disabled={isLoggingIn}
            className={`
              w-full relative group flex items-center justify-center gap-3 
              bg-white hover:bg-gray-50 text-gray-700 
              px-6 py-4 rounded-xl shadow-md 
              transition-all duration-300 ease-in-out
              border border-gray-200 hover:border-gray-300
              ${isLoggingIn ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-lg'}
            `}
          >
            {isLoggingIn ? (
              <>
                <Loader2Icon className="h-5 w-5 animate-spin text-gray-600" />
                <span className="font-medium">Signing in...</span>
              </>
            ) : (
              <>
                <img 
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
                  alt="Google" 
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-medium">Continue with Google</span>
              </>
            )}
          </button>

          {/* Security notice */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure Google OAuth2 Authentication</span>
            </div>
          </div>

          {/* Features grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center text-xs">
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="font-medium text-gray-900 mb-1">File Management</div>
              <div className="text-gray-500">Upload, download, and organize files</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="font-medium text-gray-900 mb-1">Secure Access</div>
              <div className="text-gray-500">Protected by Google's security</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="font-medium text-gray-900 mb-1">Easy Sharing</div>
              <div className="text-gray-500">Share files with others</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="font-medium text-gray-900 mb-1">Cloud Storage</div>
              <div className="text-gray-500">Access files anywhere</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};