
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import contractABI from './contract/SupplyChainData.json';

export const contractAddress = '0x83412BEefFa2e2C5AF5C9003dde68d088144d744';
export const RPC = 'http://127.0.0.1:8545';

export const getContract = () => {
  const provider = new JsonRpcProvider(RPC);
  return new Contract(contractAddress, contractABI.abi, provider); // Burada .abi ekledik
};

export const getSignerContract = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI.abi, signer); // Burada da .abi ekledik
  } else {
    throw new Error('Ethereum wallet is not installed');
  }
};


export default getContract;