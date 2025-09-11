// contractbnb.js
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import contractABI from './contract/SupplyChainData.json';

export const contractAddress = '0x6F54E06f39f97892D7c58a3eA70179B0e73537Ac';
/*
// =================== CHAIN CONFIG (edit here for live) ===================
// LOCAL / TEST (example: Hardhat or Anvil)
export const RPC = 'http://127.0.0.1:8545';
export const CHAIN = {
  // Hardhat default: 31337 / 0x7A69
  idDec: 31337,
  idHex: '0x7A69',
  name: 'Local Test',
  rpcUrls: [RPC],
  blockExplorerUrls: [], // none for local
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
};

------------------------------------------------------------------------- */
 

export const RPC = 'https://bsc-dataseed.binance.org';
export const CHAIN = {
  idDec: 56,
  idHex: '0x38',
  name: 'BNB Smart Chain',
  rpcUrls: [RPC],
  blockExplorerUrls: ['https://bscscan.com'],
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
};


// =======================================================================

export const getContract = () => {
  const provider = new JsonRpcProvider(RPC);
  return new Contract(contractAddress, contractABI.abi, provider);
};

// Ask wallet to switch/add the expected chain
export const ensureCorrectNetwork = async () => {
  if (typeof window === 'undefined' || !window.ethereum) return;

  const current = await window.ethereum.request({ method: 'eth_chainId' });
  if (current && current.toLowerCase() === CHAIN.idHex.toLowerCase()) return;

  try {
    // try switch
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN.idHex }],
    });
  } catch (e) {
    // 4902 = chain not added to MetaMask yet → add it, then switch
    if (e && (e.code === 4902 || e.data?.originalError?.code === 4902)) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CHAIN.idHex,
          chainName: CHAIN.name,
          rpcUrls: CHAIN.rpcUrls,
          nativeCurrency: CHAIN.nativeCurrency,
          blockExplorerUrls: CHAIN.blockExplorerUrls,
        }],
      });
      // after add, ensure we are on it
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN.idHex }],
      });
    } else {
      throw e;
    }
  }
};

export const getSignerContract = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // request accounts first
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // ensure correct chain (switch/add if needed)
    await ensureCorrectNetwork();
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI.abi, signer);
  } else {
    throw new Error('Ethereum wallet is not installed');
  }
};

export default getContract;
