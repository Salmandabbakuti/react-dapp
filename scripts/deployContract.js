
async function main() {
  const Greeter = await ethers.getContractFactory("greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  return greeter;
}

main()
  .then(async (contract) => {
    console.log("Greeter contract deployed to:", contract.address);
    // Write to contract
    const tx = await contract.functions.setGreeting("Hello Ethereum Devs!");
    await tx.wait();
    // Read from contract
    const greeting = await contract.functions.getGreeting();
    console.log('Greeting from contract:', greeting);
  })
  .catch((error) => {
    console.error(error);
  });
