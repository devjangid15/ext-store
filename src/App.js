/* global chrome */
import React, { useEffect, useState, useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateWallet from './components/CreateWallet';
import UnlockWallet from './components/UnlockWallet';
import RecoveryPhrase from './components/RecoveryPhrase';
import Portfolio from './components/Portfolio';
import Loading from './components/Loading';
import Activity from './components/Activity';
import Explore from './components/Explore';
import Buy from './components/Buy';
import SendWallet from './components/SendWallet';
import Accounts from './components/Accounts';

function App() {
  const [walletCreated, setWalletCreated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  const checkWalletStatus = useCallback(() => {
    const isCreated = localStorage.getItem('walletCreated') === 'true';
    setWalletCreated(isCreated);

    if (isCreated) {
      chrome.wootz.isLocked((result) => {
        if (chrome.runtime.lastError) {
          console.error('Error checking lock status:', chrome.runtime.lastError);
          setIsLocked(true);
        } else {
          setIsLocked(result.isLocked);
        }
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    checkWalletStatus();
    // If loading is shown, keep it for 1 second
    if (!isInitialized) {
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    }
  }, [checkWalletStatus]);

  if (!isInitialized || showLoading) {
    return (
      <div style={{ minWidth: '300px', minHeight: '400px' }}>
        <Loading />
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minWidth: '300px', minHeight: '400px' }}>
        <Routes>
        <Route 
            path="/" 
            element={(() => {
              console.log("WalletCreated: " + walletCreated);
              console.log("isLocked: " + isLocked);
              return (
                <Navigate 
                  to={walletCreated 
                    ? (isLocked ? "/unlock" : "/portfolio") 
                    : "/create"
                  } 
                  replace 
                />
              );
            })()}
          />
          <Route path="/create" element={<CreateWallet setWalletCreated={setWalletCreated} />} />
          <Route path="/unlock" element={<UnlockWallet setIsLocked={setIsLocked} />} />
          <Route path="/recovery-phrase" element={<RecoveryPhrase />} />
          <Route path="/portfolio" element={<Portfolio setIsLocked={setIsLocked} />} />
          {/* <Route path="/activity" element={<Activity />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/send" element={<SendWallet />} />
          <Route path="/accounts" element={<Accounts />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
