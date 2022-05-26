const provider = window.solana;
const btn8 = document.getElementById("btn8");
const btn9 = document.getElementById("btn9");
const btn10 = document.getElementById("btn10");
const btn11 = document.getElementById("btn11");
const btn12 = document.getElementById("btn12");
const btn13 = document.getElementById("btn13");
const btn14 = document.getElementById("btn14");
const btn15 = document.getElementById("btn15");

const phantomnetworknumber = document.getElementById("phantomnetwork");
const phantomnetworknumber1 = document.getElementById("phantomnetwork1");
const phantomreceiver = document.getElementById("phantomreceiver");
const phantomamount = document.getElementById("quantity"); 

detectingTheProvider()
checkPhantomStatus()

try {
  provider.on("accountChanged",() => accountchanged());
} catch (error) {
  console.log(error);
}

async function accountchanged(){
    await provider.connect();
    document.getElementById("useraccountaddress").hidden = false;
    document.getElementById("useraccountaddress").innerText = "Current Account Address: " + provider.publicKey.toString();
    document.getElementById("phantombalance").hidden = true;
    document.getElementById("signature").hidden = true;
    document.getElementById("transaction").hidden = true;
}

function checkPhantomStatus(){
  try {
    provider.publicKey.toString();
  } catch (error) {
    document.getElementById("disconnected").hidden=false;
    document.getElementById("connected").hidden=true ;
    btn8.disabled=true;
    btn9.disabled=true;
    btn11.disabled=false;
    btn12.hidden=true;
    btn13.disabled=true;
    document.getElementById("balancediv").hidden = true;
    document.getElementById("sendsoldiv").hidden = true;
    phantomnetworknumber.disabled=true;
    phantomnetworknumber1.disabled=true;
    phantomreceiver.disabled=true;
    phantomamount.disabled=true;
    document.getElementById("signature").hidden = true;
    document.getElementById("transaction").hidden = true;
  }
}

function detectingTheProvider(){ 
  try {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        btn10.hidden=false;
        btn10.disabled=true;
        btn15.hidden=true;
      }
      else{
        document.getElementById("connectivitydiv").hidden=true;
        document.getElementById("warning").hidden=true;
        btn10.hidden=true;
        btn15.hidden=false;
      }
    } else {
      document.getElementById("connectivitydiv").hidden=true;
      document.getElementById("warning").hidden=true;
      btn10.hidden=true;
      btn15.hidden=false;
    }
  } catch (error) {
    document.getElementById("connectivitydiv").hidden=true;
    document.getElementById("warning").hidden=true;
    btn10.hidden=true;
    btn15.hidden=false;
  }
}

  function openPhantom(){
    window.open("https://phantom.app/", "_blank");
  }

  async function establishingAConnection(){
    try {
        await provider.connect();
        btn10.disabled=true
        document.getElementById("balancediv").hidden = false;
        document.getElementById("sendsoldiv").hidden = false;
        btn11.hidden = true;
        document.getElementById("disconnected").hidden=true;
        document.getElementById("connected").hidden=false;
       
        document.getElementById("useraccountaddress").hidden = false;
        document.getElementById("useraccountaddress").innerText = "Current Account Address: " + provider.publicKey.toString();
        btn13.disabled=false;
        btn8.disabled=false;
        btn9.disabled=false;
        btn12.innerText = "Disconnect";
        btn12.hidden=false;
        phantomnetworknumber.disabled=false;
        phantomnetworknumber1.disabled=false;
        phantomreceiver.disabled=false;
        phantomamount.disabled=false;
        document.getElementById("signature").hidden = true;
        document.getElementById("transaction").hidden = true;
    } catch (err) {
        btn12.hidden = true;
        btn11.hidden = false;
        btn8.disabled=true;
        btn9.disabled=true;
        btn11.disabled=false;
        btn13.disabled=true;
        phantomnetworknumber.disabled=true;
        phantomnetworknumber1.disabled=true;
        phantomreceiver.disabled=true;
        phantomamount.disabled=true;
    }
  }

  function disconnecting(){ 
    provider.disconnect();
    btn12.hidden = true;
    document.getElementById("balancediv").hidden = true;
    document.getElementById("sendsoldiv").hidden = true;
    btn11.hidden = false;
    document.getElementById("disconnected").hidden=false;
    document.getElementById("connected").hidden=true;
    btn13.disabled=true;
    btn8.disabled=true;
    btn9.disabled=true;
    btn11.disabled=false;
    btn11.innerText="Connect";
    phantomnetworknumber.disabled=true;
    phantomnetworknumber1.disabled=true;
    phantomreceiver.disabled=true;
    phantomamount.disabled=true;
    document.getElementById("phantombalance").hidden = true;
    
    document.getElementById("useraccountaddress").hidden = true;
    document.getElementById("signature").hidden = true;
    document.getElementById("transaction").hidden = true;
  }

async function getBalancePhantom(number){
    document.getElementById("phantombalance").hidden = false;
    try {
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(number), 'confirmed');
        console.log(connection);
        connection.getBalance(provider.publicKey).then(function (value) {
        document.getElementById("phantombalance").innerText = "Your Balance on " + number + ": " + (value/1000000000) + " SOL";
    }); 
    } catch (error) {
      document.getElementById("phantombalance").innerText = error.message;
    }
  }

  async function transferSOL(number,receiver,val) {
    try {
      const recieverWallet = new solanaWeb3.PublicKey(receiver);
      document.getElementById("phantombalance").hidden = true;
      // Detecting and storing the phantom wallet of the user (creator in this case)

      // Establishing connection
      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(number),'confirmed');
      connection.getBalance(provider.publicKey).then(async function (value) {
        if (val<(value/1000000000)){
          
          // Receiver Address Input
        
        console.log(provider.publicKey.toString());
        console.log(recieverWallet.toString());
        if (provider.publicKey.toString() !== recieverWallet.toString()){

          document.getElementById("signature").hidden = true;
          document.getElementById("transaction").hidden = true;

          const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: recieverWallet,
                lamports: val*1000000000 // 1 Lamport = 10^-9 SOL.
            }),
          );
    
            // Setting the variables for the transaction
            transaction.feePayer = await provider.publicKey;
            const blockhashObj = await connection.getRecentBlockhash();
            transaction.recentBlockhash = await blockhashObj.blockhash;
            
            // Request creator to sign the transaction (allow the transaction)
            const signed = await provider.signTransaction(transaction);
            // Signature's generated
            const signature = await connection.sendRawTransaction(signed.serialize());
            // Confirm whether the transaction went through or not
            await connection.confirmTransaction(signature);
    
            // Transaction constructor initialized successfully
            if(transaction) {
              document.getElementById("transaction").hidden = false;
              document.getElementById("transaction").innerText = "Transaction of hash: "+ transaction.recentBlockhash + " created successfully!";
            }
    
            //Signature 
            btn9.disabled = true;
            phantomreceiver.readOnly = true;
            phantomamount.readOnly = true;
            document.getElementById("signature").hidden = false;
            document.getElementById("signature").innerText = "Signature: " + signature;
        }
        else{
          document.getElementById("transaction").hidden = false;
          document.getElementById("transaction").innerText = "Sorry, You aren't allowed to transfer to your own account!";
        }        
        }
        else{
          document.getElementById("transaction").hidden = true;
          document.getElementById("insufficient").hidden = false;
        }
      });
        
      
    } catch (error) {
      document.getElementById("signature").hidden = false;
      document.getElementById("signature").innerText = error.message + ". Please try again!";
    }
  }

function showAlert(){
  const value  = phantomnetworknumber1.value;
  console.log(value);
  document.getElementById("transactingon").hidden = false
  if(value === "mainnet-beta"){
    document.getElementById("transactingon").innerText = "You're transacting on " + value+"!";
  }
  else if(value === "testnet"){
    document.getElementById("transactingon").innerText = "You're transacting on " + value+"!";
  }
  else if(value === "devnet"){
    document.getElementById("transactingon").innerText = "You're transacting on " + value+"!";
  }
}

btn8.onclick = () => {
    const number3 = phantomnetworknumber.value;
    getBalancePhantom(number3);
}


btn9.onclick = () => {
  const number4 = phantomnetworknumber1.value;
  const receiver = phantomreceiver.value;
  const solamount = phantomamount.value;
    if (!number4 || !receiver || !solamount) {
      document.getElementById("nullvalues").hidden = false;
    }
    else {
      document.getElementById("nullvalues").hidden = true;
      transferSOL(number4,receiver,solamount);
    }
}

btn15.onclick = () => {
  openPhantom();
}

btn11.onclick = () => {
    establishingAConnection();
}

btn12.onclick = () => {
    disconnecting();
}

btn13.onclick = () => {
  phantomreceiver.value ="";
  phantomamount.value ="";
  btn9.disabled = false;
  phantomreceiver.readOnly = false;
  phantomamount.readOnly = false;
  document.getElementById("transaction").hidden = true;
  document.getElementById("signature").hidden = true;
  document.getElementById("transactingon").hidden = true
  document.getElementById("nullvalues").hidden = true;
}

btn14.onclick = () => {
  document.getElementById("insufficient").hidden = true;
}



