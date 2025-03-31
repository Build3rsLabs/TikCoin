import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Clock, DollarSign } from 'lucide-react';

// Types for our creator tokens
interface CreatorToken {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  tokenSymbol: string;
  price: number;
  supply: number;
  popularity: number;
  listingDate: Date;
  description: string;
}

// Sorting options
type SortOption = 'price' | 'popularity' | 'recent';

const DiscoverPage = () => {
  // State for tokens and filters
  const [tokens, setTokens] = useState<CreatorToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<CreatorToken[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tokens from the Stellar blockchain
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from the Stellar blockchain
        // For now, we'll use mock data
        const mockTokens: CreatorToken[] = [
          {
            id: '1',
            creatorName: 'Alex Johnson',
            creatorAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            tokenSymbol: 'ALEX',
            price: 25.50,
            supply: 10000,
            popularity: 98,
            listingDate: new Date('2023-06-15'),
            description: 'Digital artist specializing in abstract landscapes',
          },
          {
            id: '2',
            creatorName: 'Maya Rodriguez',
            creatorAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            tokenSymbol: 'MAYA',
            price: 12.75,
            supply: 50000,
            popularity: 85,
            listingDate: new Date('2023-07-22'),
            description: 'Musician and songwriter',
          },
          {
            id: '3',
            creatorName: 'Jamal Wilson',
            creatorAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            tokenSymbol: 'JAMAL',
            price: 31.20,
            supply: 8000,
            popularity: 92,
            listingDate: new Date('2023-08-05'),
            description: 'Filmmaker and storyteller',
          },
          {
            id: '4',
            creatorName: 'Sophia Chen',
            creatorAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            tokenSymbol: 'SOPH',
            price: 18.90,
            supply: 25000,
            popularity: 78,
            listingDate: new Date('2023-09-10'),
            description: 'Fashion designer and influencer',
          },
          {
            id: '5',
            creatorName: 'David Patel',
            creatorAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            tokenSymbol: 'DAVP',
            price: 45.30,
            supply: 5000,
            popularity: 95,
            listingDate: new Date('2023-09-18'),
            description: 'Tech entrepreneur and podcast host',
          },
          {
            id: '6',
            creatorName: 'Emma Thompson',
            creatorAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
            tokenSymbol: 'EMMT',
            price: 22.10,
            supply: 15000,
            popularity: 88,
            listingDate: new Date('2023-09-28'),
            description: 'Author and creative writing instructor',
          },
        ];
        
        setTokens(mockTokens);
        setFilteredTokens(mockTokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Filter and sort tokens based on search query and sort option
  useEffect(() => {
    let result = [...tokens];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        token => 
          token.creatorName.toLowerCase().includes(query) ||
          token.tokenSymbol.toLowerCase().includes(query) ||
          token.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'recent':
          return b.listingDate.getTime() - a.listingDate.getTime();
        default:
          return 0;
      }
    });
    
    setFilteredTokens(result);
  }, [tokens, searchQuery, sortBy]);

  // Handle sort button clicks
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Creator Tokens</h1>
      
      {/* Search and filters section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search creators or tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('popularity')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                sortBy === 'popularity' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </button>
            <button
              onClick={() => handleSortChange('recent')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                sortBy === 'recent' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </button>
            <button
              onClick={() => handleSortChange('price')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                sortBy === 'price' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Price
            </button>
          </div>
        </div>
        
        {/* Filter tags / current filters */}
        <div className="flex items-center text-sm">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500 mr-2">Filters:</span>
          <div className="flex gap-2">
            {searchQuery && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Search: "{searchQuery}"
              </span>
            )}
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Sort: {sortBy === 'popularity' ? 'Popular' : sortBy === 'recent' ? 'Recent' : 'Price'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tokens grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTokens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token) => (
            <div key={token.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={token.creatorAvatar} 
                    alt={token.creatorName} 
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{token.creatorName}</h3>
                    <span className="text-sm text-gray-500">@{token.tokenSymbol}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{token.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="font-semibold">${token.price.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="text-sm text-gray-500">Supply</span>
                    <p className="font-semibold">{token.supply.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Buy Token
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No tokens found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;

