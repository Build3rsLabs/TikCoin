import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Users, Award, ArrowRight, Verified, Star, Heart } from 'lucide-react';

export const Creators = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'trending', 'gaming', 'music', 'lifestyle', 'sports', 'comedy', 'education'];
  const creators = [
    {
      id: 1,
      name: 'MrBeast',
      username: 'mrbeast',
      followers: 312000000,
      tokenPrice: 145.50,
      priceChange: 23.5,
      verified: true,
      category: 'entertainment',
      description: 'Changing the world through viral content and philanthropy. Token holders get exclusive access to challenge participation and behind-the-scenes content.',
      stats: { videos: 742, avgViews: '45.2M' },
      tokenSymbol: 'BEAST',
      marketCap: '89.2M',
      volume24h: '2.1M'
    },
    {
      id: 2,
      name: 'Charli D\'Amelio',
      username: 'charlidamelio',
      followers: 150800000,
      tokenPrice: 89.75,
      priceChange: 15.8,
      verified: true,
      category: 'lifestyle',
      description: 'Dancer and digital creator. Token holders receive dance tutorial access, merchandise drops, and virtual meet & greet opportunities.',
      stats: { posts: 2341, avgLikes: '12.3M' },
      tokenSymbol: 'CHARLI',
      marketCap: '45.6M',
      volume24h: '1.8M'
    },
    {
      id: 3,
      name: 'Markiplier',
      username: 'markiplier',
      followers: 34500000,
      tokenPrice: 67.25,
      priceChange: -2.8,
      verified: true,
      category: 'gaming',
      description: 'Gaming content creator and storyteller. Token holders get early access to videos, exclusive gaming sessions, and limited merch drops.',
      stats: { videos: 5482, avgViews: '8.9M' },
      tokenSymbol: 'MARK',
      marketCap: '28.4M',
      volume24h: '892K'
    },
    {
      id: 4,
      name: 'Addison Rae',
      username: 'addisonrae',
      followers: 88900000,
      tokenPrice: 78.90,
      priceChange: 8.4,
      verified: true,
      category: 'lifestyle',
      description: 'Actress, dancer, and entrepreneur. Token holders receive exclusive content, beauty tips, and early access to product launches.',
      stats: { posts: 1842, avgLikes: '8.7M' },
      tokenSymbol: 'RAE',
      marketCap: '34.8M',
      volume24h: '1.2M'
    },
    {
      id: 5,
      name: 'KSI',
      username: 'ksi',
      followers: 24300000,
      tokenPrice: 92.30,
      priceChange: 12.6,
      verified: true,
      category: 'music',
      description: 'Musician, boxer, and content creator. Token holders get concert tickets priority, exclusive music releases, and fight event perks.',
      stats: { subscribers: '24.3M', albums: 3 },
      tokenSymbol: 'KSI',
      marketCap: '41.2M',
      volume24h: '1.5M'
    },
    {
      id: 6,
      name: 'Pokimane',
      username: 'pokimane',
      followers: 9200000,
      tokenPrice: 45.60,
      priceChange: 5.2,
      verified: true,
      category: 'gaming',
      description: 'Twitch streamer and content creator. Token holders receive stream privileges, gaming sessions, and exclusive discord access.',
      stats: { followers: '9.2M', hours: '8.2K' },
      tokenSymbol: 'POKI',
      marketCap: '18.9M',
      volume24h: '645K'
    },
    {
      id: 7,
      name: 'Logan Paul',
      username: 'loganpaul',
      followers: 23500000,
      tokenPrice: 83.40,
      priceChange: 9.7,
      verified: true,
      category: 'sports',
      description: 'Entrepreneur, boxer, and content creator. Token holders get access to exclusive merchandise, fight events, and business insights.',
      stats: { subscribers: '23.5M', ventures: 8 },
      tokenSymbol: 'PAUL',
      marketCap: '37.5M',
      volume24h: '1.3M'
    },
    {
      id: 8,
      name: 'Bella Poarch',
      username: 'bellapoarch',
      followers: 92400000,
      tokenPrice: 56.80,
      priceChange: 7.3,
      verified: true,
      category: 'music',
      description: 'Singer and content creator. Token holders receive exclusive music content, virtual meet & greets, and merchandise presales.',
      stats: { followers: '92.4M', songs: 12 },
      tokenSymbol: 'BELLA',
      marketCap: '25.6M',
      volume24h: '890K'
    },
    {
      id: 9,
      name: 'Dream',
      username: 'dream',
      followers: 31200000,
      tokenPrice: 72.15,
      priceChange: -1.8,
      verified: true,
      category: 'gaming',
      description: 'Minecraft creator and storyteller. Token holders get exclusive server access, merchandise drops, and behind-the-scenes content.',
      stats: { subscribers: '31.2M', videos: 189 },
      tokenSymbol: 'DREAM',
      marketCap: '32.4M',
      volume24h: '980K'
    },
    {
      id: 10,
      name: 'David Dobrik',
      username: 'daviddobrik',
      followers: 18400000,
      tokenPrice: 64.90,
      priceChange: 4.2,
      verified: true,
      category: 'comedy',
      description: 'Vlogger and entrepreneur. Token holders receive exclusive video access, merchandise drops, and surprise giveaway entries.',
      stats: { subscribers: '18.4M', views: '7.2B' },
      tokenSymbol: 'DOBRIK',
      marketCap: '29.2M',
      volume24h: '875K'
    },
    {
      id: 11,
      name: 'Mark Rober',
      username: 'markrober',
      followers: 24800000,
      tokenPrice: 58.30,
      priceChange: 6.8,
      verified: true,
      category: 'education',
      description: 'Engineer and science creator. Token holders get early video access, exclusive tutorials, and engineering project insights.',
      stats: { subscribers: '24.8M', patents: 9 },
      tokenSymbol: 'ROBER',
      marketCap: '26.2M',
      volume24h: '780K'
    },
    {
      id: 12,
      name: 'Dixie D\'Amelio',
      username: 'dixiedamelio',
      followers: 57200000,
      tokenPrice: 48.75,
      priceChange: 3.9,
      verified: true,
      category: 'music',
      description: 'Singer and content creator. Token holders receive exclusive music releases, concert tickets priority, and meet & greet opportunities.',
      stats: { followers: '57.2M', songs: 15 },
      tokenSymbol: 'DIXIE',
      marketCap: '21.9M',
      volume24h: '650K'
    },
    {
      id: 13,
      name: 'Ninja',
      username: 'ninja',
      followers: 18900000,
      tokenPrice: 53.20,
      priceChange: -3.2,
      verified: true,
      category: 'gaming',
      description: 'Professional gamer and streamer. Token holders get exclusive stream features, gaming sessions, and merchandise access.',
      stats: { followers: '18.9M', hours: '12.4K' },
      tokenSymbol: 'NINJA',
      marketCap: '23.9M',
      volume24h: '720K'
    },
    {
      id: 14,
      name: 'Casey Neistat',
      username: 'caseyneistat',
      followers: 12500000,
      tokenPrice: 42.80,
      priceChange: 2.8,
      verified: true,
      category: 'lifestyle',
      description: 'Filmmaker and entrepreneur. Token holders receive filmmaking tutorials, early video access, and exclusive meetups.',
      stats: { subscribers: '12.5M', films: 328 },
      tokenSymbol: 'CASEY',
      marketCap: '19.2M',
      volume24h: '580K'
    },
    {
      id: 15,
      name: 'Liza Koshy',
      username: 'lizakoshy',
      followers: 17600000,
      tokenPrice: 39.95,
      priceChange: 4.5,
      verified: true,
      category: 'comedy',
      description: 'Actress and comedian. Token holders get exclusive content access, show tickets priority, and virtual meet & greets.',
      stats: { subscribers: '17.6M', shows: 5 },
      tokenSymbol: 'LIZA',
      marketCap: '17.9M',
      volume24h: '530K'
    }
  ];

  const filteredCreators = creators.filter(creator => {
    if (searchQuery) {
      return creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (filter !== 'all') {
      return creator.category === filter;
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Discover Creators</h1>
          <p className="text-gray-400 mt-2">Invest in the world's top content creators</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-tik-card rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tik-pink"
            />
          </div>
          
          <button className="bg-tik-card p-2 rounded-xl hover:bg-tik-gray transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-tik-pink to-tik-cyan text-white'
                : 'bg-tik-card text-gray-400 hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => (
          <div key={creator.id} className="bg-tik-card rounded-xl p-6 hover:bg-tik-gray/80 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-tik-pink to-tik-cyan p-[2px]">
                  <div className="w-full h-full rounded-full bg-tik-gray flex items-center justify-center">
                    <span className="text-2xl font-bold">{creator.name.charAt(0)}</span>
                  </div>
                </div>
                {creator.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-tik-pink rounded-full p-1.5">
                    <Verified className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {creator.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-tik-gray text-gray-400">
                        ${creator.tokenSymbol}
                      </span>
                    </h3>
                    <p className="text-gray-400">@{creator.username}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-tik-cyan" />
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(creator.followers)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">{creator.category}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{creator.description}</p>
                
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-tik-gray">
                  <div>
                    <p className="text-xs text-gray-400">Token Price</p>
                    <p className="text-sm font-bold">${creator.tokenPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Market Cap</p>
                    <p className="text-sm font-bold">${creator.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">24h Volume</p>
                    <p className="text-sm font-bold">${creator.volume24h}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className={`flex items-center gap-1 ${
                    creator.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{creator.priceChange}%</span>
                  </div>
                  <button className="px-4 py-1.5 bg-gradient-to-r from-tik-pink to-tik-cyan rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};