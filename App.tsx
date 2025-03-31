import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { isConnected, getPublicKey, setAllowHttp } from '@stellar/freighter-api';
import WalletManager from './components/WalletManager';
// Page components (to be implemented)
const Home = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Welcome to Stellar Creator Marketplace</h1></div>;
const Discover = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Discover Creators</h1></div>;
const Profile = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Your Profile</h1></div>;
const Create = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Create Content</h1></div>;
const Wallet = () => <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-6">Wallet Management</h1><WalletManager /></div>;
// NavLink component with active state
const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-indigo-600 text-white' 
          : 'text-gray-700 hover:bg-indigo-100'
      }`}
    >
      {children}
    </Link>
  );
};

// Wallet connection component
const WalletConnection = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  useEffect(() => {
    // Allow HTTP connections for development
    setAllowHttp(true);
    
    const checkWalletConnection = async () => {
      try {
        const connected = await isConnected();
        setIsWalletConnected(connected);
        
        if (connected) {
          const stellarPublicKey = await getPublicKey();
          setPublicKey(stellarPublicKey);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    
    checkWalletConnection();
  }, []);
  
  const connectWallet = async () => {
    try {
      // This will prompt the user to connect their Freighter wallet
      // The actual connection is handled by Freighter
      const connected = await isConnected();
      
      if (connected) {
        const stellarPublicKey = await getPublicKey();
        setPublicKey(stellarPublicKey);
        setIsWalletConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  return (
    <div className="flex items-center">
      {isWalletConnected ? (
        <div className="flex items-center bg-green-100 px-4 py-2 rounded-md">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm font-medium">
            {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Connected'}
          </span>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

// Layout component with navigation
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-indigo-600">Stellar Creator Marketplace</h1>
              <nav className="hidden md:flex space-x-2">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/create">Create</NavLink>
                <NavLink to="/wallet">Wallet</NavLink>
              </nav>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Stellar Creator Marketplace
          </p>
        </div>
      </footer>
    </div>
  );
};

// Main App component
function App() {
  // Initialize necessary state or context providers here

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/discover" element={<Layout><Discover /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/create" element={<Layout><Create /></Layout>} />
        <Route path="/wallet" element={<Layout><Wallet /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

// Add Freighter wallet type definition
declare global {
  interface Window {
    freighter: {
      isConnected: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      connect: () => Promise<void>;
    };
  }
}

