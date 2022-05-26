/* // Send ETH via MetaMask
async function sendeth(amounttosend){
  const accounts = await web3.eth.getAccounts();
  let accountbalance= await (web3.eth.getBalance(accounts[0]));
  accountbalance= web3.utils.fromWei(accountbalance, "ether");
  // Check if entered amount is less than or equal to user's wallet balance 
  if (amounttosend <= balance){
        try {
            web3.eth.sendTransaction({
                to: '0x3721430091076C0be6e96CE17E7DC22A2e173b57', 
                from: accounts[0],
                value: web3.utils.toWei(val, "ether")
            });
        } 
        catch(e) {
            // Error Message if user rejects the approval or closes the pop up
            console.log(e);
        }
  } 
  else{
     // Insufficient Funds 
  }
} */