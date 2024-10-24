/* global chrome */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaWallet, FaBolt, FaUserCircle, FaCompass, FaCopy, FaEllipsisV } from 'react-icons/fa';

const Accounts = () => {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = () => {
      chrome.wootz.getAllAccounts((result) => {
        if (result.success) {
          setAccounts(result.accounts);
        } else {
          setError(result.error || "Failed to fetch accounts");
        }
      });
    };

    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button className="text-indigo-400"><FaPlus /></button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="flex-grow">
        {accounts.map((account, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{account.name}</h2>
              <button className="text-gray-400"><FaEllipsisV /></button>
            </div>
            <div className="flex items-start text-sm text-gray-400 mb-2">
              <span className="mr-2 break-all">{account.address}</span>
              <button
                className="text-indigo-400 flex-shrink-0 mt-1"
                onClick={() => navigator.clipboard.writeText(account.address)}
                title="Copy address"
              >
                <FaCopy />
              </button>
            </div>
            <div className="text-lg font-semibold">
              {getCoinSymbol(account.coin)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
          Add Account
        </button>
      </div>

      <div className="mt-auto">
        <div className="flex justify-around border-t border-gray-800 pt-4">
          {[
            { icon: <FaWallet />, label: 'Portfolio', path: '/portfolio' },
            { icon: <FaBolt />, label: 'Activity', path: '/activity' },
            { icon: <FaUserCircle />, label: 'Accounts', path: '/accounts' },
            { icon: <FaCompass />, label: 'Explore', path: '/explore' },
          ].map((item, index) => (
            <Link key={index} to={item.path} className={`flex flex-col items-center ${location.pathname === item.path ? 'text-white' : 'text-gray-500'
              }`}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
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

export default Accounts;