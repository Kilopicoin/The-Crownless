
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import contractABI from './contract/usdtbnb.json';

export const usdtbnbcontractAddress = '0x7AD63a293c225f1366102DE5c12f20763BB5B5f0';
const RPC = 'http://127.0.0.1:8545';

export const getusdtbnbContract = () => {
  const provider = new JsonRpcProvider(RPC);
  return new Contract(usdtbnbcontractAddress, contractABI.abi, provider); // Burada .abi ekledik
};

export const getusdtbnbSignerContract = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(usdtbnbcontractAddress, contractABI.abi, signer); // Burada da .abi ekledik
  } else {
    throw new Error('Ethereum wallet is not installed');
  }
};


export default getusdtbnbContract;