export interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  tokenSymbol: string;
  tokenPrice: number;
  totalSupply: number;
  description: string;
}

export interface Token {
  id: string;
  creatorId: string;
  symbol: string;
  price: number;
  supply: number;
  holders: number;
}

export interface User {
  id: string;
  address: string;
  balance: number;
  tokens: { [key: string]: number };
}