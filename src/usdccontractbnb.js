
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import contractABI from './contract/usdcbnb.json';

export const usdcbnbcontractAddress = '0x0f19417da2c051d881F7A44B325B22EDaB57A654';
const RPC = 'http://127.0.0.1:8545';

export const getusdcbnbContract = () => {
  const provider = new JsonRpcProvider(RPC);
  return new Contract(usdcbnbcontractAddress, contractABI.abi, provider); // Burada .abi ekledik
};

export const getusdcbnbSignerContract = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(usdcbnbcontractAddress, contractABI.abi, signer); // Burada da .abi ekledik
  } else {
    throw new Error('Ethereum wallet is not installed');
  }
};


export default getusdcbnbContract;