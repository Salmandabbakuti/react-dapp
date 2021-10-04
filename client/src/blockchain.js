import { ethers, Contract } from 'ethers';
import Web3Modal from "web3modal"
import { abi } from './artifacts/contracts/greeter.sol/greeter.json';

const getBlockchain = async () => {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection);
  const { chainId } = await provider.getNetwork();
  console.log('chainId:', chainId);
  const signer = provider.getSigner();
  const greeter = new Contract('0x7D18927e96099Ca0C68B9c445744D64A11964D9C', abi, signer);
  return { greeter };
};

export default getBlockchain;