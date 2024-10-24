import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaWallet, FaBolt, FaUserCircle, FaCompass } from 'react-icons/fa';

const Activity = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Acti<br />vity</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-800 rounded-full py-2 px-4 pl-10 text-sm"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <p className="text-xl font-semibold mb-2">No transaction history</p>
        <p className="text-sm text-gray-400">
          Transactions made with your Brave Wallet<br />will appear here.
        </p>
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

export default Activity;