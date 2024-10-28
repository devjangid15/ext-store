/* global chrome */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import TransitionScreen from './TransitionScreen';
import wootzIcon from '../icons/wootz.png'

const CreateWallet = ({ setWalletCreated }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      console.log('Attempting to create wallet...');
      const createResult = await new Promise((resolve, reject) => {
        chrome.wootz.createWallet(password, (response) => {
          console.log('Create wallet response received');
          if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log('Wallet created successfully');
            resolve(response);
          }
        });
      });

      console.log('Wallet creation result:', {
        success: createResult.success,
      });

      if (!createResult.success) {
        throw new Error(createResult.error || "Failed to create wallet");
      }

      localStorage.setItem('walletCreated', 'true');
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      setWalletCreated(true);
      console.log('Wallet created status set in localStorage');

      // Show transition screen before navigating to recovery phrase
      setIsTransitioning(true);
      setTimeout(() => {
       navigate('/recovery-phrase', { state: { recoveryPhrase: createResult.recoveryPhrase } });
      }, 3000);

    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  if (isTransitioning) {
    return <TransitionScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <img
            src={wootzIcon}
            alt="Wootz Logo"
            className="mx-auto h-20 w-20"
          />
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Create Your <span className="bg-gradient-to-r from-[#FF3B30] to-[#FF8C00] text-transparent bg-clip-text">Wallet</span>
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Set a strong password to secure your wallet
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Enter password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FF3B30] focus:border-[#FF3B30] focus:z-10 sm:text-sm"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 z-20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm your password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FF3B30] focus:border-[#FF3B30] focus:z-10 sm:text-sm"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border-0 text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#FF3B30] to-[#FF8C00] hover:from-[#FF5E3A] hover:to-[#FFA726] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8C00] transition-all duration-200 shadow-md"
            >
              Create Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWallet;