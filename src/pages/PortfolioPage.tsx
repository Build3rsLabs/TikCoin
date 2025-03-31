import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LineChart } from '../components/LineChart';
import { ArrowRight, ArrowUpRight, ArrowDownRight, ListFilter } from 'lucide-react';

// Placeholder data - Replace with actual API calls to Stellar network
const mockTokenHoldings = [
  { id: '1', name: 'Artist Token', symbol: 'ARTST', balance: 15, price: 2.34, change: 5.6, valueUSD: 35.1 },
  { id: '2', name: 'Music Token', symbol: 'MUSIC', balance: 150, price: 0.52, change: -2.3, valueUSD: 78 },
  { id: '3', name: 'Writer Token', symbol: 'WRIT', balance: 75, price: 1.05, change: 12.8, valueUSD: 78.75 },
  { id: '4', name: 'Design Token', symbol: 'DSGN', balance: 30, price: 3.18, change: 1.2, valueUSD: 95.4 },
];

const mockTransactions = [
  { id: '1', type: 'buy', token: 'ARTST', amount: 5, price: 2.2, date: '2023-08-15T10:30:00Z', total: 11 },
  { id: '2', type: 'sell', token: 'MUSIC', amount: 20, price: 0.55, date: '2023-08-14T14:45:00Z', total: 11 },
  { id: '3', type: 'list', token: 'WRIT', amount: 10, price: 1.1, date: '2023-08-13T09:15:00Z', total: 11 },
  { id: '4', type: 'buy', token: 'DSGN', amount: 15, price: 3.0, date: '2023-08-12T16:20:00Z', total: 45 },
  { id: '5', type: 'sell', token: 'ARTST', amount: 8, price: 2.1, date: '2023-08-11T11:05:00Z', total: 16.8 },
];

// Sample portfolio value history for chart
const portfolioHistory = [
  { date: '2023-07-15', value: 150 },
  { date: '2023-07-22', value: 180 },
  { date: '2023-07-29', value: 165 },
  { date: '2023-08-05', value: 210 },
  { date: '2023-08-12', value: 240 },
  { date: '2023-08-19', value: 287 },
];

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions'>('holdings');
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total portfolio value from holdings
    const totalValue = mockTokenHoldings.reduce((sum, token) => sum + token.valueUSD, 0);
    setPortfolioValue(totalValue);
  }, []);

  const handleBuyMore = (tokenId: string) => {
    // Navigate to buy page with token ID
    navigate(`/token/${tokenId}/buy`);
  };

  const handleSell = (tokenId: string) => {
    // Open sell modal or navigate to sell page
    navigate(`/token/${tokenId}/sell`);
  };

  const handleList = (tokenId: string) => {
    // Open listing modal or navigate to listing page
    navigate(`/token/${tokenId}/list`);
  };

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold">{formatCurrency(portfolioValue)}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Creator Tokens</h3>
          <p className="text-3xl font-bold">{mockTokenHoldings.length}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Transactions</h3>
          <p className="text-3xl font-bold">{mockTransactions.length}</p>
        </Card>
      </div>
      
      {/* Portfolio Performance Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Portfolio Performance</h2>
        <div className="h-64">
          <LineChart 
            data={portfolioHistory.map(item => ({ 
              x: item.date, 
              y: item.value 
            }))} 
            xLabel="Date" 
            yLabel="Value (USD)" 
          />
        </div>
      </Card>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'holdings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('holdings')}
        >
          My Holdings
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'transactions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Transaction History
        </button>
      </div>
      
      {/* Token Holdings */}
      {activeTab === 'holdings' && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockTokenHoldings.map((token) => (
                  <tr key={token.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {token.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-gray-500">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{token.balance.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(token.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center ${token.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {token.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {Math.abs(token.change)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(token.valueUSD)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" onClick={() => handleBuyMore(token.id)}>Buy</Button>
                        <Button size="sm" variant="outline" onClick={() => handleSell(token.id)}>Sell</Button>
                        <Button size="sm" variant="outline" onClick={() => handleList(token.id)}>
                          <ListFilter size={16} className="mr-1" />
                          List
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Transaction History */}
      {activeTab === 'transactions' && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'buy' ? 'bg-green-100 text-green-800' : 
                        tx.type === 'sell' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.token}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(tx.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(tx.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button size="sm" variant="ghost">
                        View <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;

