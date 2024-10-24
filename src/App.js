import React, { useEffect, useState, useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateWallet from './components/CreateWallet';
import UnlockWallet from './components/UnlockWallet';
import RecoveryPhrase from './components/RecoveryPhrase';
import Portfolio from './components/Portfolio';
import Activity from './components/Activity';
import Explore from './components/Explore';
import Buy from './components/Buy';
import SendWallet from './components/SendWallet';
import Accounts from './components/Accounts';

function App() {
  const [walletCreated, setWalletCreated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkWalletCreated = useCallback(() => {
    console.log('checkWalletCreated function called');
    const isCreated = localStorage.getItem('walletCreated') === 'true';
    console.log('Wallet created status from localStorage:', isCreated);
    setWalletCreated(isCreated);
    console.log('walletCreated state updated to:', isCreated);
  }, []);


  useEffect(() => {
    console.log('useEffect in App component triggered');
    checkWalletCreated();
    setIsInitialized(true);
    
  }, [checkWalletCreated ]);

  if (!isInitialized) {
    return null;
  }

  console.log('Rendering App component, walletCreated:', walletCreated);

  return (
    <Router>
      <div style={{ minWidth: '300px', minHeight: '400px' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              (() => {
                console.log('Evaluating root route, walletCreated:', walletCreated);
                return <Navigate to={walletCreated ? "/unlock" : "/create"} replace />;
              })()
            } 
          />
          <Route path="/create" element={<CreateWallet setWalletCreated={setWalletCreated} />} />
          <Route path="/unlock" element={<UnlockWallet />} />
          <Route path="/recovery-phrase" element={<RecoveryPhrase />} />
          <Route path="/portfolio" element={<Portfolio />} />
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
