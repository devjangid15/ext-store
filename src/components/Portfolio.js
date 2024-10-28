/* global chrome */
import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { FaCopy, FaSignature, FaEthereum, FaTimes } from 'react-icons/fa';

const Portfolio = ({ setIsLocked }) => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [signRequest, setSignRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleBackgroundMessage = (message) => {
      if (message.type === 'signMessageRequest') {
        console.log('Sign message request received from background:', message.data);
        setSignRequest(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(handleBackgroundMessage);

    // Check for any pending sign requests
    chrome.runtime.sendMessage({ type: 'getSignRequest' }, (response) => {
      if (response && response.type === 'signMessageRequest') {
        console.log('Pending sign request received:', response.data);
        setSignRequest(response.data);
      }
    });

    const fetchAccounts = () => {
      console.log('Fetching accounts...');
      chrome.wootz.getAllAccounts((result) => {
        if (result.success) {
          console.log('Accounts fetched successfully:', result.accounts);
          setAccounts(result.accounts);
        } else {
          console.error('Failed to fetch accounts:', result.error);
          setError(result.error || "Failed to fetch accounts");
        }
      });
    };

    fetchAccounts();

    return () => {
      chrome.runtime.onMessage.removeListener(handleBackgroundMessage);
    };
  }, []);

  const handleLockWallet = () => {
    console.log('Locking wallet...');
    try {
      const result = chrome.wootz.lockWallet();
      if (result.success) {
        console.log('Wallet locked successfully');
        setIsLocked(true);
        navigate('/unlock');
      } else {
        console.error('Failed to lock wallet');
        setError('Failed to lock wallet');
      }
    } catch (error) {
      console.error('Error locking wallet:', error);
      setError('Failed to lock wallet: ' + error.message);
    }
  };

  const handleSignMessage = (approved) => {
    if (signRequest) {
      setIsLoading(true);
      console.log(`Signing message (Approved: ${approved}, Request ID: ${signRequest.id})...`);
      chrome.runtime.sendMessage({
        type: 'signMessage',
        requestId: signRequest.id,
        approved: approved,
        signature: null
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          setError('Failed to sign message: ' + chrome.runtime.lastError.message);
        } else if (response && response.success) {
          console.log('Message signed successfully');
        } else {
          console.error('Failed to sign message:', response ? response.error : 'Unknown error');
          setError('Failed to sign message: ' + (response ? response.error : 'Unknown error'));
        }
        // Always clear the sign request, regardless of the outcome
        setSignRequest(null);
      });
    } else {
      console.error('No sign request available');
    }
  };

  const getCoinIcon = (coinType) => {
    switch (coinType) {
      case 60: return <FaEthereum className="text-[#627EEA] h-6 w-6" />;
      case 1: return 'BTC';
      case 501: return 'SOL';
      default: return <span className="text-gray-400">?</span>;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (signRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Sign <span className="bg-gradient-to-r from-[#FF3B30] to-[#FF8C00] text-transparent bg-clip-text">Message</span>
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-1">Request</h3>
            </div>

            {/* Message */}
            <p className="text-gray-600">Your signature is being requested</p>

            {/* From */}
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">From: 
                <span className="text-gray-600 ml-2">{signRequest.origin}</span>
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Address:</p>
              <p className="text-gray-600 break-all text-sm">{signRequest.address}</p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => handleSignMessage(false)}
                className="flex-1 px-6 py-3 border-0 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#FF3B30] to-[#FF4B4B] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF3B30] flex items-center justify-center shadow-lg transition-all duration-200"
              >
                <FaTimes className="mr-2" /> Reject
              </button>
              <button
                onClick={() => handleSignMessage(true)}
                className="flex-1 px-6 py-3 border-0 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#34C759] to-[#32D74B] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#32D74B] flex items-center justify-center shadow-lg transition-all duration-200"
              >
                <FaSignature className="mr-2" /> Sign
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FF3B30] to-[#FF8C00] text-transparent bg-clip-text">Portfolio</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Accounts</h3>
        {accounts
          .filter(account => account.coin === 60)
          .map((account, index) => (
            <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg truncate pr-2 text-gray-800" title={account.name}>
                  {account.name}
                </h2>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">
                    {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                  </span>
                  <button
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(account.address);
                      console.log('Address copied:', account.address);
                    }}
                    title="Copy address"
                  >
                    <FaCopy />
                  </button>
                </div>
                <div className="text-lg font-semibold">
                  {getCoinIcon(account.coin)}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Uncomment and update if you want to include the lock wallet button
      <div className="mt-auto">
        <button
          onClick={handleLockWallet}
          className="w-full bg-[#FF8C00] hover:bg-[#FFA500] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center mb-4 transition-colors shadow-md"
        >
          <FaLock className="mr-2" /> Lock Wallet
        </button>
      </div>
      */}
    </div>
  );
};

export default Portfolio;