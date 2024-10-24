/* global chrome */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaKey, FaCopy } from 'react-icons/fa';

const RecoveryPhrase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recoveryPhrase = location.state?.recoveryPhrase || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryPhrase);
    alert("Recovery phrase copied to clipboard!");
  };

  const handleContinue = () => {
    navigate('/portfolio');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <FaKey className="mx-auto h-12 w-12 text-indigo-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Recovery Phrase</h2>
          <p className="mt-2 text-sm text-gray-400">Write down or copy these words in the correct order and keep them safe.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-md">
          <p className="text-white break-words">{recoveryPhrase}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaCopy className="mr-2" /> Copy
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPhrase;