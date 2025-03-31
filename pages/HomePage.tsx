import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration purposes
const trendingTokens = [
  { id: '1', creator: 'Alex Music', name: 'ALEX', price: 0.0045, change: '+12.5%', imageUrl: 'https://via.placeholder.com/50' },
  { id: '2', creator: 'Cosmic Studios', name: 'COSMIC', price: 0.0098, change: '+8.2%', imageUrl: 'https://via.placeholder.com/50' },
  { id: '3', creator: 'Digital Dreams', name: 'DREAM', price: 0.0012, change: '+15.7%', imageUrl: 'https://via.placeholder.com/50' },
  { id: '4', creator: 'Stellar Arts', name: 'STAR', price: 0.0076, change: '+5.3%', imageUrl: 'https://via.placeholder.com/50' },
];

const recentActivity = [
  { id: '1', type: 'Purchase', creator: 'Alex Music', buyer: 'user123', amount: 50, token: 'ALEX', time: '2 mins ago' },
  { id: '2', type: 'Creation', creator: 'New Creator', token: 'NEWT', time: '15 mins ago' },
  { id: '3', type: 'Sale', creator: 'Cosmic Studios', seller: 'user456', amount: 25, token: 'COSMIC', time: '32 mins ago' },
  { id: '4', type: 'Purchase', creator: 'Digital Dreams', buyer: 'user789', amount: 100, token: 'DREAM', time: '1 hour ago' },
];

const HomePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  // In a real app, this would check for wallet connection
  useEffect(() => {
    // Simulating connection check
    const checkConnection = async () => {
      // Replace with actual wallet connection check
      setIsConnected(false);
    };

    checkConnection();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Stellar Creator Marketplace</h1>
          <p className="text-xl mb-6">
            Discover, invest in, and support your favorite creators through tokenized social engagement on the Stellar blockchain.
          </p>
          {!isConnected ? (
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition duration-200">
              Connect Wallet
            </button>
          ) : (
            <Link to="/discover" className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition duration-200">
              Explore Marketplace
            </Link>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Create Your Token</h3>
            <p className="text-gray-600">
              Creators can launch their personal token on the Stellar blockchain with a custom bonding curve that determines the token price.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Invest in Creators</h3>
            <p className="text-gray-600">
              Fans can purchase creator tokens to support their favorite creators, with the potential for tokens to increase in value over time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Trade & Earn</h3>
            <p className="text-gray-600">
              Both creators and fans can trade tokens on the marketplace, with creators earning fees from each transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Tokens Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Trending Creator Tokens</h2>
          <Link to="/discover" className="text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (XLM)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trendingTokens.map((token) => (
                  <tr key={token.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={token.imageUrl} alt={token.creator} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{token.creator}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{token.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{token.price.toFixed(6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {token.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">Buy</button>
                      <Link to={`/creator/${token.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Recent Activity</h2>
          <Link to="/activity" className="text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                    ${activity.type === 'Purchase' ? 'bg-green-100 text-green-800' : 
                      activity.type === 'Sale' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {activity.type === 'Purchase' ? '🔽' : activity.type === 'Sale' ? '🔼' : '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.type === 'Purchase'
                        ? `${activity.buyer} purchased ${activity.amount} ${activity.token} tokens`
                        : activity.type === 'Sale'
                        ? `${activity.seller} sold ${activity.amount} ${activity.token} tokens`
                        : `${activity.creator} created ${activity.token} token`}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{activity.time}</p>
                  </div>
                  <div>
                    <Link to={`/creator/${activity.token.toLowerCase()}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View Token
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Join as Creator CTA */}
      <section className="bg-gray-50 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Creator?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Launch your creator token on Stellar and start building your community-backed economy today.
        </p>
        <Link
          to="/create"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Create Your Token
        </Link>
      </section>
    </div>
  );
};

export default HomePage;

