import { useState, useEffect } from 'react';
import ethLogo from './ethLogo.svg'
import './App.css';
import getBlockchain from './blockchain';


function App() {
  const [greeting, setGreeting] = useState('');
  const [greetingInput, setGreetingInput] = useState('');
  const [logMessage, setLogMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const { greeter } = await getBlockchain();
      const greeting = await greeter.getGreeting();
      console.log('greeting from contract: ', greeting);
      setGreeting(greeting);
    };
    init();
  }, []);

  const submitGreeting = async (e) => {
    e.preventDefault();
    const { greeter } = await getBlockchain();
    const tx = await greeter.setGreeting(greetingInput);
    setLogMessage(`Transaction submitted. Waiting to be mined: ${tx.hash}`);
    await tx.wait().then(async () => {
      setLogMessage('Transaction Succeded..');
      setGreeting(await greeter.getGreeting());
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
      <p className="App-title">{logMessage}</p>
    </div >
  );
}

export default App;
