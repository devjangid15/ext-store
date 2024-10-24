import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaWallet, FaBolt, FaUserCircle, FaCompass } from 'react-icons/fa';

const Buy = () => {
  const location = useLocation();
  const cryptoAssets = [
    { name: 'Aurora', symbol: 'AURORA', network: 'Aurora Mainnet', price: '$0.0001287', icon: '🍃' },
    { name: 'Avalanche', symbol: 'AVAX', network: 'Avalanche C-Chain', price: '$28.39', icon: '🔺' },
    { name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin Mainnet', price: '$64,445.00', icon: '₿' },
    { name: 'BNB', symbol: 'BNB', network: 'BNB Smart Chain', price: '$577.28', icon: '🟡' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Buy</h1>

      <div className="bg-gray-800 rounded-lg p-3 mb-4 flex items-center">
        <span className="mr-2">$</span>
        <input
          type="number"
          placeholder="0"
          className="bg-transparent flex-grow outline-none"
        />
        <FaChevronDown className="text-gray-500" />
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-800 rounded-lg py-2 px-4 pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <button className="bg-gray-800 rounded-lg px-4 py-2 flex items-center">
          All networks <FaChevronDown className="ml-2 text-gray-500" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {cryptoAssets.map((asset, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{asset.icon}</span>
              <div>
                <div className="font-semibold">{asset.name}</div>
                <div className="text-sm text-gray-500">{asset.symbol} on {asset.network}</div>
              </div>
            </div>
            <div className="text-right">
              <div>{asset.price}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex justify-around border-t border-gray-800 pt-4">
          {[
            { icon: <FaWallet />, label: 'Portfolio', path: '/portfolio' },
            { icon: <FaBolt />, label: 'Activity', path: '/activity' },
            { icon: <FaUserCircle />, label: 'Accounts', path: '/accounts' },
            { icon: <FaCompass />, label: 'Explore', path: '/explore' },
          ].map((item, index) => (
            <Link key={index} to={item.path} className={`flex flex-col items-center ${
              location.pathname === item.path ? 'text-white' : 'text-gray-500'
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

export default Buy;