import { useState, useEffect } from 'react';
import Web3Modal from "web3modal"
import { ethers, Contract } from 'ethers';
import ethLogo from './ethLogo.svg'
import './App.css';
import { abi } from './artifacts/contracts/greeter.sol/greeter.json';


function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [logMessage, setLogMessage] = useState('');
  const [greetingInput, setGreetingInput] = useState('');

  const initWeb3 = async () => {
    return new Promise(async (resolve, reject) => {
      const web3Modal = new Web3Modal({
        network: "ropsten",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const { chainId } = await provider.getNetwork();
      console.log('chainId:', chainId);
      if (chainId !== 3) reject('Wrong network. Please switch to Ropsten Test network');
      const signer = provider.getSigner();
      const contract = new Contract('0x7D18927e96099Ca0C68B9c445744D64A11964D9C', abi, signer);
      resolve({ contract, provider });
    });
  }

  window.ethereum.on("accountsChanged", async () => {
    console.log("account change detected");
  });
  window.ethereum.on("chainChanged", (chainId) => {
    console.log('chain changed', chainId);
    window.location.reload();
  });

  // // Subscribe to provider connection
  window.ethereum.on("connect", (info) => {
    console.log('connected to the network');
    setLogMessage('Connected to the network');
  });

  // // Subscribe to provider disconnection
  window.ethereum.on("disconnect", (error) => {
    console.log(error);
    setLogMessage('Disconnected from the network');
  });

  useEffect(() => {
    const init = async () => {
      initWeb3().then(async ({ contract, provider }) => {
        setContract(contract);
        provider.getSigner().getAddress().then(setAccount);
        console.log('connected account: ', account);
        const greeting = await contract.getGreeting();
        console.log('greeting from contract: ', greeting);
        setGreeting(greeting);
      }).catch(err => {
        console.log('err:', err);
        setLogMessage(err);
      });
    };
    init();
  }, []);

  const submitGreeting = async (e) => {
    e.preventDefault();
    const tx = await contract.setGreeting(greetingInput);
    setLogMessage(`Transaction submitted. Waiting to be mined: ${tx.hash}`);
    await tx.wait().then(async () => {
      setLogMessage('Transaction Succeded..');
      setGreeting(await contract.getGreeting());
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={ethLogo} className="App-logo" alt="logo" />
        <h1 className="App-title">{greeting || 'Loading..'}</h1>
        <form onSubmit={(e) => submitGreeting(e)}>
          <label>
            <h4>Greeting</h4>
            <input type="text" name="name" placeholder="Write your greeting here.." onChange={(e) => setGreetingInput(e.target.value)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </header>
      <p className="App-log">{logMessage}</p>
    </div >
  );
}

export default App;
