import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaWallet, FaBolt, FaUserCircle, FaCompass } from 'react-icons/fa';
import { SiBitcoin, SiEthereum } from 'react-icons/si';
import { FaGem, FaCoins } from 'react-icons/fa';

const Explore = () => {
  const [showBackupAlert, setShowBackupAlert] = useState(true);
  const [activeTab, setActiveTab] = useState('Market');
  const location = useLocation();

  const cryptoAssets = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$64,436.0', change: '-1.91%', icon: SiBitcoin, iconColor: 'text-orange-500' },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,626.93', change: '-1.53%', icon: SiEthereum, iconColor: 'text-blue-400' },
    { name: 'Tether', symbol: 'USDT', price: '$0.9998', change: '+0.01%', icon: FaGem, iconColor: 'text-green-400' },
    { name: 'BNB', symbol: 'BNB', price: '$576.97', change: '-3.44%', icon: FaCoins, iconColor: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <div className="flex space-x-2 mb-4">
        {['Market', 'Web3'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab ? 'bg-gray-700' : 'bg-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {showBackupAlert && (
        <div className="bg-red-900 p-4 rounded-lg mb-4">
          <p className="text-sm">Back up your wallet now to protect your assets and ensure you never lose access.</p>
          <div className="mt-2 flex justify-end space-x-2">
            <button className="text-sm text-indigo-400">Back up now</button>
            <button className="text-sm text-gray-400" onClick={() => setShowBackupAlert(false)}>Dismiss</button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="mr-2">All Assets</span>
          <FaChevronDown className="text-gray-500" />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 rounded-full py-1 px-3 pl-8 text-sm"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <span>Assets</span>
        <div className="flex space-x-4">
          <span>Price</span>
          <span>24hr</span>
        </div>
      </div>

      <div className="flex-grow">
        {cryptoAssets.map((asset, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-800">
            <div className="flex items-center">
              <asset.icon className={`text-2xl mr-3 ${asset.iconColor}`} />
              <div>
                <div className="font-semibold">{asset.name}</div>
                <div className="text-sm text-gray-500">{asset.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div>{asset.price}</div>
              <div className={`text-sm ${asset.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {asset.change}
              </div>
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

export default Explore;