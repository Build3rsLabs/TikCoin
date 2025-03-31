import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, LineChart, PieChart, History, Filter, Users, Star, Verified, TrendingUp, TrendingDown, Gift, Bell, Share2, Zap, DollarSign, BarChart3, ChevronRight } from 'lucide-react';

export const Portfolio = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [showReferralNotification, setShowReferralNotification] = useState(true);

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  
  const holdings = [
    {
      id: 1,
      name: 'MrBeast',
      username: 'mrbeast',
      tokenSymbol: 'BEAST',
      amount: 250,
      value: 36375.00,
      price: 145.50,
      change: 23.5,
      verified: true,
      allocation: 40.6,
      rewards: {
        pending: 125,
        claimed: 750
      }
    },
    {
      id: 2,
      name: 'Charli D\'Amelio',
      username: 'charlidamelio',
      tokenSymbol: 'CHARLI',
      amount: 180,
      value: 16155.00,
      price: 89.75,
      change: 15.8,
      verified: true,
      allocation: 18.0,
      rewards: {
        pending: 45,
        claimed: 280
      }
    },
    {
      id: 3,
      name: 'KSI',
      username: 'ksi',
      tokenSymbol: 'KSI',
      amount: 120,
      value: 11076.00,
      price: 92.30,
      change: 12.6,
      verified: true,
      allocation: 12.4,
      rewards: {
        pending: 60,
        claimed: 420
      }
    },
    {
      id: 4,
      name: 'Pokimane',
      username: 'pokimane',
      tokenSymbol: 'POKI',
      amount: 350,
      value: 15960.00,
      price: 45.60,
      change: 5.2,
      verified: true,
      allocation: 17.8,
      rewards: {
        pending: 85,
        claimed: 320
      }
    }
  ];

  const transactions = [
    {
      id: 1,
      type: 'buy',
      token: 'BEAST',
      tokenName: 'MrBeast',
      amount: 100,
      price: 145.50,
      total: 14550,
      date: '2024-03-15 14:23',
      status: 'completed'
    },
    {
      id: 2,
      type: 'sell',
      token: 'CHARLI',
      tokenName: 'Charli D\'Amelio',
      amount: 50,
      price: 89.75,
      total: 4487.50,
      date: '2024-03-14 09:45',
      status: 'completed'
    },
    {
      id: 3,
      type: 'buy',
      token: 'KSI',
      tokenName: 'KSI',
      amount: 75,
      price: 92.30,
      total: 6922.50,
      date: '2024-03-13 16:30',
      status: 'completed'
    },
    {
      id: 4,
      type: 'buy',
      token: 'POKI',
      tokenName: 'Pokimane',
      amount: 150,
      price: 45.60,
      total: 6840,
      date: '2024-03-12 11:15',
      status: 'completed'
    }
  ];

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalChange = holdings.reduce((sum, holding) => sum + (holding.value * (holding.change / 100)), 0);
  const changePercentage = (totalChange / (totalValue - totalChange)) * 100;

  const portfolioMetrics = [
    {
      label: 'Total Rewards',
      value: '$2,450',
      change: '+12.5%',
      icon: <Gift className="w-5 h-5" />
    },
    {
      label: 'Avg. ROI',
      value: '32.8%',
      change: '+8.2%',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      label: 'Active Stakes',
      value: '8',
      change: '+2',
      icon: <Zap className="w-5 h-5" />
    },
    {
      label: 'Total Volume',
      value: '$45.2K',
      change: '+15.3%',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  const rewardPrograms = [
    {
      creator: 'MrBeast',
      program: 'Challenge Participation',
      reward: '500 BEAST',
      endDate: '2024-03-25'
    },
    {
      creator: 'Charli D\'Amelio',
      program: 'Early Access Pass',
      reward: '200 CHARLI',
      endDate: '2024-03-28'
    },
    {
      creator: 'KSI',
      program: 'Concert VIP Package',
      reward: '150 KSI',
      endDate: '2024-03-30'
    }
  ];

  return (
    <div className="p-6">
      {showReferralNotification && (
        <div className="mb-6 bg-gradient-to-r from-tik-pink to-tik-cyan p-[1px] rounded-xl">
          <div className="bg-tik-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tik-pink/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-tik-pink" />
              </div>
              <div>
                <p className="font-semibold">Earn More with Friends!</p>
                <p className="text-sm text-gray-400">Get 50 USDC for each friend who joins and invests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-1.5 bg-gradient-to-r from-tik-pink to-tik-cyan rounded-full text-sm font-semibold">
                Share Now
              </button>
              <button onClick={() => setShowReferralNotification(false)} className="text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Portfolio</h1>
          <p className="text-gray-400 mt-2">Track your creator token investments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-tik-card flex items-center justify-center">
            <Wallet className="w-5 h-5 text-tik-cyan" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Value</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              <span className={`text-sm flex items-center ${changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercentage >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {changePercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {portfolioMetrics.map((metric, i) => (
          <div key={i} className="bg-tik-card rounded-xl p-4 hover:bg-tik-gray/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <div className="w-8 h-8 rounded-full bg-tik-gray flex items-center justify-center text-tik-pink">
                {metric.icon}
              </div>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-green-500 mt-2">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Portfolio Performance</h2>
            <div className="flex items-center gap-2 bg-tik-gray rounded-full p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                    timeframe === tf ? 'bg-gradient-to-r from-tik-pink to-tik-cyan text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-tik-gray rounded-xl">
            <LineChart className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-400">Interactive chart coming soon</span>
          </div>
        </div>

        <div className="bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Rewards</h2>
            <button className="text-tik-cyan text-sm hover:text-tik-pink transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {rewardPrograms.map((program, i) => (
              <div key={i} className="bg-tik-gray/50 rounded-xl p-4 hover:bg-tik-gray transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{program.creator}</span>
                  <span className="text-xs text-gray-400">Ends {program.endDate}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{program.program}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-tik-cyan">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm">{program.reward}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Holdings</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-tik-gray text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <select className="bg-tik-gray text-white rounded-lg px-3 py-2 border-none outline-none focus:ring-2 focus:ring-tik-pink">
                <option>Sort by Value</option>
                <option>Sort by Change</option>
                <option>Sort by Name</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div key={holding.id} className="flex items-center justify-between p-4 rounded-xl bg-tik-gray/50 hover:bg-tik-gray transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-tik-pink to-tik-cyan p-[2px]">
                      <div className="w-full h-full rounded-full bg-tik-gray flex items-center justify-center">
                        <span className="text-lg font-bold">{holding.name.charAt(0)}</span>
                      </div>
                    </div>
                    {holding.verified && (
                      <div className="absolute -top-1 -right-1">
                        <Verified className="w-4 h-4 text-tik-pink" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{holding.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-tik-gray text-gray-400">
                        ${holding.tokenSymbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{holding.amount} tokens</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        +{holding.rewards.pending} pending
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${holding.value.toLocaleString()}</p>
                  <p className={`text-sm flex items-center justify-end gap-1 ${
                    holding.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {holding.change >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(holding.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" />
              <button className="text-tik-cyan text-sm hover:text-tik-pink transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-tik-gray/50">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {tx.type === 'buy' ? (
                      <ArrowUpRight className={`w-5 h-5 text-green-500`} />
                    ) : (
                      <ArrowDownRight className={`w-5 h-5 text-red-500`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.token}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-tik-gray text-gray-400">
                        {tx.tokenName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{tx.amount} {tx.token}</p>
                  <p className="text-sm text-gray-400">${tx.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};