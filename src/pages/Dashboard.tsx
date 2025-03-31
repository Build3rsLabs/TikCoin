import React, { useState } from 'react';
import { LineChart, Wallet, TrendingUp, Users, Flame, Award, Coins, ArrowRight, TrendingDown, Star, Verified, Bell, Gift, Zap, DollarSign, BarChart3, PieChart } from 'lucide-react';

export const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('24h');
  const [sortBy, setSortBy] = useState('trending');
  const [showNotification, setShowNotification] = useState(true);

  const timeframes = ['24h', '7d', '30d', 'All'];
  const sortOptions = ['trending', 'volume', 'price'];

  const trendingCreators = [
    {
      id: 1,
      name: 'MrBeast',
      username: 'mrbeast',
      tokenPrice: 145.50,
      priceChange: 23.5,
      volume: '2.1M',
      verified: true,
      category: 'entertainment'
    },
    {
      id: 2,
      name: 'Charli D\'Amelio',
      username: 'charlidamelio',
      tokenPrice: 89.75,
      priceChange: 15.8,
      volume: '1.8M',
      verified: true,
      category: 'lifestyle'
    },
    {
      id: 3,
      name: 'KSI',
      username: 'ksi',
      tokenPrice: 92.30,
      priceChange: 12.6,
      volume: '1.5M',
      verified: true,
      category: 'music'
    }
  ];

  const recentActivities = [
    {
      type: 'purchase',
      title: 'Purchased BEAST Tokens',
      time: '2 hours ago',
      amount: '+150 BEAST',
      value: '$21,825',
      icon: <Wallet />,
      positive: true
    },
    {
      type: 'sale',
      title: 'Sold CHARLI Tokens',
      time: '5 hours ago',
      amount: '-75 CHARLI',
      value: '$6,731.25',
      icon: <Coins />,
      positive: false
    },
    {
      type: 'reward',
      title: 'Creator Rewards',
      time: '1 day ago',
      amount: '+25 KSI',
      value: '$2,307.50',
      icon: <Star />,
      positive: true
    }
  ];

  const portfolioStats = [
    {
      title: "24h Volume",
      value: "$5.4M",
      change: "+23.5%",
      icon: <TrendingUp className="w-5 h-5" />,
      isPositive: true
    },
    {
      title: "Active Investments",
      value: "12",
      change: "+3",
      icon: <Coins className="w-5 h-5" />,
      isPositive: true
    },
    {
      title: "Creators Backed",
      value: "8",
      change: "+2",
      icon: <Users className="w-5 h-5" />,
      isPositive: true
    },
    {
      title: "Trending Returns",
      value: "32.5%",
      change: "+12.8%",
      icon: <Flame className="w-5 h-5" />,
      isPositive: true
    }
  ];

  const marketInsights = [
    { label: 'Total Market Cap', value: '$892.5M', change: '+15.2%' },
    { label: 'Total Volume (24h)', value: '$45.2M', change: '+8.7%' },
    { label: 'Active Traders', value: '24.5K', change: '+12.3%' },
    { label: 'Creator Tokens', value: '156', change: '+5' }
  ];

  const upcomingEvents = [
    {
      creator: 'MrBeast',
      event: 'Exclusive Challenge Event',
      date: 'Mar 25, 2024',
      reward: '500 BEAST',
      type: 'challenge'
    },
    {
      creator: 'KSI',
      event: 'Live Concert Access',
      date: 'Mar 28, 2024',
      reward: 'VIP Tickets',
      type: 'event'
    },
    {
      creator: 'Pokimane',
      event: 'Gaming Tournament',
      date: 'Mar 30, 2024',
      reward: '250 POKI',
      type: 'tournament'
    }
  ];

  return (
    <div className="p-6">
      {showNotification && (
        <div className="mb-6 bg-gradient-to-r from-tik-pink to-tik-cyan p-[1px] rounded-xl">
          <div className="bg-tik-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tik-pink/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-tik-pink" />
              </div>
              <div>
                <p className="font-semibold">Welcome Bonus Available!</p>
                <p className="text-sm text-gray-400">Get 100 USDC when you make your first investment and refer a friend</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-1.5 bg-gradient-to-r from-tik-pink to-tik-cyan rounded-full text-sm font-semibold">
                Claim Now
              </button>
              <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-2">Your creator token portfolio overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-tik-card rounded-full p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  timeframe === tf ? 'bg-gradient-to-r from-tik-pink to-tik-cyan text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="w-px h-8 bg-tik-gray"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tik-card flex items-center justify-center">
              <Wallet className="w-5 h-5 text-tik-cyan" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Portfolio Value</p>
              <p className="text-xl font-bold">$89,542.75</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {portfolioStats.map((stat, i) => (
          <div key={i} className="bg-tik-card rounded-xl p-4 hover:bg-tik-gray/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.title}</span>
              <div className="w-8 h-8 rounded-full bg-tik-gray flex items-center justify-center text-tik-pink">
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              stat.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Portfolio Performance</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-tik-gray text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-tik-gray text-gray-400 hover:text-white transition-colors">
                <PieChart className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-tik-gray rounded-xl">
            <LineChart className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-400">Interactive chart coming soon</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {marketInsights.map((insight, i) => (
              <div key={i} className="bg-tik-gray/50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{insight.label}</p>
                <p className="text-lg font-bold mt-1">{insight.value}</p>
                <p className="text-xs text-green-500">{insight.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <button className="text-tik-cyan text-sm hover:text-tik-pink transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="bg-tik-gray/50 rounded-xl p-4 hover:bg-tik-gray transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{event.creator}</span>
                  <span className="text-xs text-gray-400">{event.date}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{event.event}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full bg-tik-gray text-tik-cyan">
                    {event.type}
                  </span>
                  <span className="text-sm text-tik-pink font-semibold">{event.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Top Performers</h2>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-tik-gray text-white rounded-lg px-3 py-1.5 text-sm border-none outline-none focus:ring-2 focus:ring-tik-pink"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    Sort by {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <button className="text-tik-cyan text-sm hover:text-tik-pink transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {trendingCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-4 rounded-xl bg-tik-gray/50 hover:bg-tik-gray transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-tik-pink to-tik-cyan p-[2px]">
                      <div className="w-full h-full rounded-full bg-tik-gray flex items-center justify-center">
                        <span className="text-lg font-bold">{creator.name.charAt(0)}</span>
                      </div>
                    </div>
                    {creator.verified && (
                      <div className="absolute -top-1 -right-1">
                        <Verified className="w-4 h-4 text-tik-pink" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{creator.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-tik-gray text-gray-400">
                        {creator.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">@{creator.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">${creator.tokenPrice}</p>
                    <p className={`text-sm ${creator.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {creator.priceChange >= 0 ? '+' : ''}{creator.priceChange}%
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-tik-cyan" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-tik-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-tik-cyan text-sm hover:text-tik-pink transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-tik-gray/50 hover:bg-tik-gray transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-tik-pink to-tik-cyan flex items-center justify-center">
                    {React.cloneElement(activity.icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${activity.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {activity.amount}
                  </p>
                  <p className="text-sm text-gray-400">{activity.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};