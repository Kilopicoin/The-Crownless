
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import contractABI from './contract/usdtbnb.json';

export const usdtbnbcontractAddress = '0x68f27Ea899cF53b3cDdb8ad67994Ba0e9F3e7259';
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