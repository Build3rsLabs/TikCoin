import React from 'react';
import { type Creator } from '../types';
import { Users, Coins, TrendingUp } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  onInvest: (creatorId: string) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onInvest }) => {
  return (
    <div className="bg-tik-card rounded-xl p-4 hover:bg-tik-gray/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-tik-pink to-tik-cyan p-[2px]">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-tik-pink rounded-full p-1.5">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{creator.name}</h3>
            <button
              onClick={() => onInvest(creator.id)}
              className="px-4 py-1.5 bg-gradient-to-r from-tik-pink to-tik-cyan rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Invest Now
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{creator.followers.toLocaleString()} followers</span>
          </div>
          
          <p className="text-gray-400 text-sm mt-3 line-clamp-2">{creator.description}</p>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-tik-gray rounded-lg p-3">
              <p className="text-xs text-gray-400">Token</p>
              <p className="text-sm font-semibold flex items-center gap-1 mt-1">
                <Coins className="w-3 h-3 text-tik-cyan" />
                {creator.tokenSymbol}
              </p>
            </div>
            <div className="bg-tik-gray rounded-lg p-3">
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-sm font-semibold mt-1">${creator.tokenPrice}</p>
            </div>
            <div className="bg-tik-gray rounded-lg p-3">
              <p className="text-xs text-gray-400">Supply</p>
              <p className="text-sm font-semibold mt-1">
                {creator.totalSupply.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};