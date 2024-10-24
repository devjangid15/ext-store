/* global chrome */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCopy, FaEllipsisV, FaSignature } from 'react-icons/fa';

const Portfolio = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [signRequest, setSignRequest] = useState(null);

  useEffect(() => {


    const handleBackgroundMessage = (message) => {
      if (message.type === 'signMessageRequest') {
        console.log('Sign message request received from background:', message.data);
        setSignRequest(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(handleBackgroundMessage);

    // Request any pending sign requests when the popup opens
    chrome.runtime.sendMessage({ type: 'popupReady' }, (response) => {
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

    const handleSignMessageRequest = (request) => {
      console.log('Sign message request received:', request);
      setSignRequest(request);
    };

    chrome.wootz.onSignMessageRequested.addListener(handleSignMessageRequest);

    return () => {

      chrome.runtime.onMessage.removeListener(handleBackgroundMessage);

      chrome.wootz.onSignMessageRequested.removeListener(handleSignMessageRequest);
    };
  }, []);

  const handleLockWallet = () => {
    console.log('Locking wallet...');
    navigate('/unlock');
  };

  const handleSignMessage = (approved) => {
    if (signRequest) {
      console.log(`Signing message (Approved: ${approved}, Request ID: ${signRequest.id})...`);
      chrome.runtime.sendMessage({
        type: 'signMessage',
        requestId: signRequest.id,
        approved: approved,
        signature: null  // Add this line
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
        setSignRequest(null);
      });
    } else {
      console.error('No sign request available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Portfolio</h1>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4">Accounts</h3>
        {accounts
          .filter(account => account.coin === 60)
          .map((account, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{account.name}</h2>
                <button className="text-gray-400"><FaEllipsisV /></button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-2">
                    {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                  </span>
                  <button
                    className="text-indigo-400"
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
                  {getCoinSymbol(account.coin)}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLockWallet}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center mb-4"
        >
          <FaLock className="mr-2" /> Lock Wallet
        </button>

        {signRequest && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Sign Message Request</h3>
            <p>From: {signRequest.origin}</p>
            <p>Address: {signRequest.address}</p>
            <p>Chain ID: {signRequest.chainId}</p>
            <p>Is EIP712: {signRequest.isEip712 ? 'Yes' : 'No'}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleSignMessage(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => handleSignMessage(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <FaSignature className="mr-2" /> Sign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getCoinSymbol = (coinType) => {
  switch (coinType) {
    case 60: return 'ETH';
    case 1: return 'BTC';
    case 501: return 'SOL';
    default: return 'Unknown';
  }
};

export default Portfolio;