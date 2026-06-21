export type AssetType = 'fiat' | 'crypto';

export interface Asset {
  id: string;          // coingecko id (crypto) or currency code (fiat)
  code: string;        // ticker (BTC, USD ...)
  symbol: string;      // $, €, ₿ ...
  name: string;
  color: string;       // hex accent
  type: AssetType;
  icon: string;        // image url
  cgId?: string;       // coingecko ohlc id
}

const flag = (cc: string) => `https://flagcdn.com/w160/${cc}.png`;
const cg = (id: string) =>
  `https://assets.coingecko.com/coins/images/${id}/small.png`;

// 30+ crypto
export const CRYPTO: Asset[] = [
  { id: 'bitcoin', code: 'BTC', symbol: '₿', name: 'Bitcoin', color: '#f7931a', type: 'crypto', icon: cg('1'), cgId: 'bitcoin' },
  { id: 'ethereum', code: 'ETH', symbol: 'Ξ', name: 'Ethereum', color: '#627eea', type: 'crypto', icon: cg('279'), cgId: 'ethereum' },
  { id: 'binancecoin', code: 'BNB', symbol: 'BNB', name: 'BNB', color: '#f3ba2f', type: 'crypto', icon: cg('825'), cgId: 'binancecoin' },
  { id: 'the-open-network', code: 'TON', symbol: 'TON', name: 'Toncoin', color: '#0098ea', type: 'crypto', icon: cg('17980'), cgId: 'the-open-network' },
  { id: 'tether', code: 'USDT', symbol: '₮', name: 'Tether', color: '#26a17b', type: 'crypto', icon: cg('325'), cgId: 'tether' },
  { id: 'solana', code: 'SOL', symbol: 'SOL', name: 'Solana', color: '#14f195', type: 'crypto', icon: cg('4128'), cgId: 'solana' },
  { id: 'ripple', code: 'XRP', symbol: 'XRP', name: 'XRP', color: '#23292f', type: 'crypto', icon: cg('44'), cgId: 'ripple' },
  { id: 'usd-coin', code: 'USDC', symbol: 'USDC', name: 'USD Coin', color: '#2775ca', type: 'crypto', icon: cg('6319'), cgId: 'usd-coin' },
  { id: 'cardano', code: 'ADA', symbol: 'ADA', name: 'Cardano', color: '#0033ad', type: 'crypto', icon: cg('975'), cgId: 'cardano' },
  { id: 'dogecoin', code: 'DOGE', symbol: 'Ð', name: 'Dogecoin', color: '#c2a633', type: 'crypto', icon: cg('5'), cgId: 'dogecoin' },
  { id: 'avalanche-2', code: 'AVAX', symbol: 'AVAX', name: 'Avalanche', color: '#e84142', type: 'crypto', icon: cg('12559'), cgId: 'avalanche-2' },
  { id: 'tron', code: 'TRX', symbol: 'TRX', name: 'TRON', color: '#ff060a', type: 'crypto', icon: cg('1094'), cgId: 'tron' },
  { id: 'chainlink', code: 'LINK', symbol: 'LINK', name: 'Chainlink', color: '#2a5ada', type: 'crypto', icon: cg('877'), cgId: 'chainlink' },
  { id: 'polkadot', code: 'DOT', symbol: 'DOT', name: 'Polkadot', color: '#e6007a', type: 'crypto', icon: cg('12171'), cgId: 'polkadot' },
  { id: 'matic-network', code: 'MATIC', symbol: 'MATIC', name: 'Polygon', color: '#8247e5', type: 'crypto', icon: cg('4713'), cgId: 'matic-network' },
  { id: 'litecoin', code: 'LTC', symbol: 'Ł', name: 'Litecoin', color: '#345d9d', type: 'crypto', icon: cg('2'), cgId: 'litecoin' },
  { id: 'shiba-inu', code: 'SHIB', symbol: 'SHIB', name: 'Shiba Inu', color: '#ffa409', type: 'crypto', icon: cg('11939'), cgId: 'shiba-inu' },
  { id: 'uniswap', code: 'UNI', symbol: 'UNI', name: 'Uniswap', color: '#ff007a', type: 'crypto', icon: cg('12504'), cgId: 'uniswap' },
  { id: 'bitcoin-cash', code: 'BCH', symbol: 'BCH', name: 'Bitcoin Cash', color: '#8dc351', type: 'crypto', icon: cg('780'), cgId: 'bitcoin-cash' },
  { id: 'stellar', code: 'XLM', symbol: 'XLM', name: 'Stellar', color: '#7d00ff', type: 'crypto', icon: cg('100'), cgId: 'stellar' },
  { id: 'cosmos', code: 'ATOM', symbol: 'ATOM', name: 'Cosmos', color: '#2e3148', type: 'crypto', icon: cg('1481'), cgId: 'cosmos' },
  { id: 'monero', code: 'XMR', symbol: 'ɱ', name: 'Monero', color: '#ff6600', type: 'crypto', icon: cg('69'), cgId: 'monero' },
  { id: 'ethereum-classic', code: 'ETC', symbol: 'ETC', name: 'Ethereum Classic', color: '#328332', type: 'crypto', icon: cg('453'), cgId: 'ethereum-classic' },
  { id: 'aptos', code: 'APT', symbol: 'APT', name: 'Aptos', color: '#000000', type: 'crypto', icon: cg('26455'), cgId: 'aptos' },
  { id: 'near', code: 'NEAR', symbol: 'NEAR', name: 'NEAR Protocol', color: '#00ec97', type: 'crypto', icon: cg('10365'), cgId: 'near' },
  { id: 'filecoin', code: 'FIL', symbol: 'FIL', name: 'Filecoin', color: '#0090ff', type: 'crypto', icon: cg('12817'), cgId: 'filecoin' },
  { id: 'arbitrum', code: 'ARB', symbol: 'ARB', name: 'Arbitrum', color: '#28a0f0', type: 'crypto', icon: cg('16547'), cgId: 'arbitrum' },
  { id: 'optimism', code: 'OP', symbol: 'OP', name: 'Optimism', color: '#ff0420', type: 'crypto', icon: cg('25244'), cgId: 'optimism' },
  { id: 'aave', code: 'AAVE', symbol: 'AAVE', name: 'Aave', color: '#b6509e', type: 'crypto', icon: cg('12645'), cgId: 'aave' },
  { id: 'vechain', code: 'VET', symbol: 'VET', name: 'VeChain', color: '#15bdff', type: 'crypto', icon: cg('1077'), cgId: 'vechain' },
  { id: 'maker', code: 'MKR', symbol: 'MKR', name: 'Maker', color: '#1aab9b', type: 'crypto', icon: cg('1364'), cgId: 'maker' },
  { id: 'algorand', code: 'ALGO', symbol: 'ALGO', name: 'Algorand', color: '#000000', type: 'crypto', icon: cg('4380'), cgId: 'algorand' },
];

// 25 fiat
export const FIAT: Asset[] = [
  { id: 'USD', code: 'USD', symbol: '$', name: 'US Dollar', color: '#85bb65', type: 'fiat', icon: flag('us') },
  { id: 'EUR', code: 'EUR', symbol: '€', name: 'Euro', color: '#0052b4', type: 'fiat', icon: flag('eu') },
  { id: 'JPY', code: 'JPY', symbol: '¥', name: 'Japanese Yen', color: '#bc002d', type: 'fiat', icon: flag('jp') },
  { id: 'RUB', code: 'RUB', symbol: '₽', name: 'Russian Ruble', color: '#0039a6', type: 'fiat', icon: flag('ru') },
  { id: 'IDR', code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', color: '#ce1126', type: 'fiat', icon: flag('id') },
  { id: 'GBP', code: 'GBP', symbol: '£', name: 'British Pound', color: '#012169', type: 'fiat', icon: flag('gb') },
  { id: 'CHF', code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', color: '#d52b1e', type: 'fiat', icon: flag('ch') },
  { id: 'CNY', code: 'CNY', symbol: '¥', name: 'Chinese Yuan', color: '#de2910', type: 'fiat', icon: flag('cn') },
  { id: 'AUD', code: 'AUD', symbol: 'A$', name: 'Australian Dollar', color: '#00843d', type: 'fiat', icon: flag('au') },
  { id: 'CAD', code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', color: '#ff0000', type: 'fiat', icon: flag('ca') },
  { id: 'INR', code: 'INR', symbol: '₹', name: 'Indian Rupee', color: '#ff9933', type: 'fiat', icon: flag('in') },
  { id: 'BRL', code: 'BRL', symbol: 'R$', name: 'Brazilian Real', color: '#009b3a', type: 'fiat', icon: flag('br') },
  { id: 'KRW', code: 'KRW', symbol: '₩', name: 'South Korean Won', color: '#003478', type: 'fiat', icon: flag('kr') },
  { id: 'SGD', code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', color: '#ed2939', type: 'fiat', icon: flag('sg') },
  { id: 'HKD', code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', color: '#de2910', type: 'fiat', icon: flag('hk') },
  { id: 'MXN', code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', color: '#006847', type: 'fiat', icon: flag('mx') },
  { id: 'TRY', code: 'TRY', symbol: '₺', name: 'Turkish Lira', color: '#e30a17', type: 'fiat', icon: flag('tr') },
  { id: 'SEK', code: 'SEK', symbol: 'kr', name: 'Swedish Krona', color: '#006aa7', type: 'fiat', icon: flag('se') },
  { id: 'NOK', code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', color: '#ba0c2f', type: 'fiat', icon: flag('no') },
  { id: 'PLN', code: 'PLN', symbol: 'zł', name: 'Polish Zloty', color: '#dc143c', type: 'fiat', icon: flag('pl') },
  { id: 'THB', code: 'THB', symbol: '฿', name: 'Thai Baht', color: '#a51931', type: 'fiat', icon: flag('th') },
  { id: 'AED', code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', color: '#00732f', type: 'fiat', icon: flag('ae') },
  { id: 'ZAR', code: 'ZAR', symbol: 'R', name: 'South African Rand', color: '#007a4d', type: 'fiat', icon: flag('za') },
  { id: 'NZD', code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', color: '#00247d', type: 'fiat', icon: flag('nz') },
  { id: 'MYR', code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', color: '#cc0001', type: 'fiat', icon: flag('my') },
];

export const ALL_ASSETS: Asset[] = [...CRYPTO, ...FIAT];

export const fmt = (n: number, max = 6): string => {
  if (n == null || isNaN(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (abs >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  return n.toLocaleString('en-US', { maximumFractionDigits: max });
};