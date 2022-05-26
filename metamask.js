const web3 = new Web3(window.ethereum);
const { ethereum } = window;
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const btn6 = document.getElementById("btn6");
const btn7 = document.getElementById("btn7");
const btn8 = document.getElementById("btn8");
const btn9 = document.getElementById("btn9");
const networkNumber = document.getElementById("network");
const Receiveraddress = document.getElementById("receiveraddress");
const amount = document.getElementById("amount");

window.onload = async () => {
  web3BrowserDetection();
  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());

      (async () => {
        await uponConnection();
      })();

      document.getElementById("ethSignResult").hidden = true;
      document.getElementById("getAccountsResult").hidden = true;
    } else {
      document.getElementById("disconnected").hidden = false;
      document.getElementById("connectivitydiv").hidden = false;
      btn4.disabled = false;
      btn6.disabled = true;
      btn1.disabled = true;
      btn7.disabled = true;
      btn2.disabled = true;
      btn9.disabled = true;
      networkNumber.disabled = true;
      document.getElementById("ethSignResult").hidden = true;
      document.getElementById("getAccountsResult").hidden = true;
      document.getElementById("useraccountaddress").hidden = true;
      document.getElementById("networkname").hidden = true;
      document.getElementById("chainId").hidden = true;
      document.getElementById("balancediv").hidden = true;
      document.getElementById("transactiondiv").hidden = true;
      btn6.hidden = true;
      document.getElementById("switchnetworksdiv").hidden = true;
      document.getElementById("sendethform").hidden = true;
      btn4.innerText = "Connect";
      document.getElementById("connected").hidden = true;
      document.getElementById("disconnected").hidden = false;
      receiveraddress.disabled = true;
      amount.disabled = true;
    }
  } catch (error) {
    console.log(error);
  }
};

async function uponConnection() {
  document.getElementById("useraccountaddress").hidden = false;
  document.getElementById("networkname").hidden = false;
  document.getElementById("chainId").hidden = false;
  document.getElementById("balancediv").hidden = false;
  document.getElementById("transactiondiv").hidden = false;
  btn6.hidden = false;
  document.getElementById("switchnetworksdiv").hidden = false;
  document.getElementById("connected").hidden = false;
  document.getElementById("disconnected").hidden = true;
  document.getElementById("connectivitydiv").hidden = true;
  btn4.hidden = true;
  document.getElementById("sendethform").hidden = false;

  const networkId = await web3.eth.net.getId();
  document.getElementById("networkname").innerText =
    "Current Network: " + getNetworkName(networkId);
  document.getElementById("chainId").innerText =
    "Current Network's ChainId: " + networkId;
  document.getElementById("network").value = networkId;

  const account = await web3.eth.getAccounts();
  document.getElementById("useraccountaddress").innerText =
    "Active Account Address: " + account;

  btn9.disabled = false;
  btn6.disabled = false;
  btn1.disabled = false;
  btn7.disabled = false;
  btn2.disabled = false;
  networkNumber.disabled = false;
  receiveraddress.disabled = false;
  amount.disabled = false;
}

function web3BrowserDetection() {
  if (ethereum && ethereum.isMetaMask) {
    btn3.hidden = false;
    btn3.disabled = true;
    document.getElementById("btn10").hidden = true;
  } else {
    document.getElementById("connectivitydiv1").hidden = true;
    document.getElementById("sendethform").hidden = true;
    btn6.hidden = true;
    document.getElementById("balancediv").hidden = true;
    document.getElementById("transactiondiv").hidden = true;
    document.getElementById("switchnetworksdiv").hidden = true;
    document.getElementById("useraccountaddress").hidden = true;
    document.getElementById("networkname").hidden = true;
    document.getElementById("chainId").hidden = true;
    document.getElementById("connectivitydiv").hidden = true;
    btn3.hidden = true;
    document.getElementById("btn10").hidden = false;
    btn6.disabled = true;
    btn1.disabled = true;
    btn7.disabled = true;
    btn2.disabled = true;
    btn9.disabled = true;
    networkNumber.disabled = true;
    receiveraddress.disabled = true;
    amount.disabled = true;
  }
}

function openMetaMask() {
  window.open("https://metamask.io/", "_blank");
}

async function getWalletAddress() {
  try {
    const accounts = await web3.eth.getAccounts();
    const accountstxn = await web3.eth.getTransactionCount(accounts[0]);
    document.getElementById("getAccountsResult").hidden = false;
    const networkId = await web3.eth.net.getId();
    document.getElementById("getAccountsResult").innerText =
      "Amt of Transactions on " +
      getNetworkName(networkId) +
      " for this Address: " +
      accountstxn;
  } catch (error) {
    document.getElementById("getAccountsResult").hidden = false;
    document.getElementById("getAccountsResult").innerText =
      error.message + " Please try again!";
  }
}

async function getBalance() {
  try {
    const accounts = await web3.eth.getAccounts();
    let accountbalance = await web3.eth.getBalance(accounts[0]);
    accountbalance = web3.utils.fromWei(accountbalance, "ether");
    const networkId = await web3.eth.net.getId();
    document.getElementById("ethSignResult").hidden = false;
    document.getElementById("ethSignResult").innerText =
      "Balance on " +
      getNetworkName(networkId) +
      ": " +
      accountbalance +
      " ETH";
  } catch (error) {
    document.getElementById("ethSignResult").hidden = false;
    document.getElementById("ethSignResult").innerText =
      error.message + " Please try again!";
  }
}

async function currentNetwork() {
  const networkId = await web3.eth.net.getId();
  return networkId;
}

function getNetworkName(chainID) {
  const networks = {
    1: "Ethereum Mainnet",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
    97: "Binance Smart Chain Testnet",
  };
  return networks[chainID];
}

async function walletConnection() {
  let accounts = await ethereum.request({
    method: "eth_accounts",
  });
  try {
    if (accounts && accounts.length > 0) {
      document.getElementById("status").innerText = "Status: Connected!";
    } else {
      accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log(accounts);
      document.getElementById("connectivity").hidden = true;
      (async () => {
        await uponConnection();
      })();
    }
  } catch (error) {
    document.getElementById("connectivity").hidden = false;
    document.getElementById("connectivity").innerText =
      error.message + " Please connect!";
  }
}

async function switchNetworks(chainId) {
  try {
    const networkId = await web3.eth.net.getId();
    console.log(chainId);
    if (networkId === chainId) {
      document.getElementById("samenetwork").hidden = false;
      document.getElementById("samenetwork").innerText =
        "You're on the same network!";
    } else {
      document.getElementById("samenetwork").hidden = true;
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(chainId) }],
      });
      document.getElementById("networkname").innerText =
        "Current Network: " + getNetworkName(chainId);
      document.getElementById("getAccountsResult").hidden = true;
      document.getElementById("ethSignResult").hidden = true;
      document.getElementById("chainId").innerText =
        "Current Network's ChainId: " + chainId;
    }
  } catch (e) {
    document.getElementById("samenetwork").hidden = false;
    document.getElementById("samenetwork").innerText = e.message;
  }
}

async function sendeth(receiveraddress, val) {
  document.getElementById("nullvalues").hidden = true;
  document.getElementById("getAccountsResult").hidden = true;
  const accounts = await web3.eth.getAccounts();
  let accountbalance = await web3.eth.getBalance(accounts[0]);
  accountbalance = web3.utils.fromWei(accountbalance, "ether");
  const senderaddress = accounts[0];
  if (val <= accountbalance) {
    if (senderaddress !== receiveraddress) {
      try {
        web3.eth.sendTransaction(
          {
            to: receiveraddress,
            from: senderaddress,
            value: web3.utils.toWei(val, "ether"),
          },
          async function (err, res) {
            if (err) {
              document.getElementById("txnhash").hidden = false;
              document.getElementById("txnhash").innerText =
                err.message + " Please try again!";
            } else {
              btn2.disabled = true;
              receiveraddress.readOnly = true;
              amount.readOnly = true;
              document.getElementById("txnhash").hidden = false;
              blocknumber = await web3.eth.getBlockNumber();
              document.getElementById("txnhash").innerText =
                "Transaction of Hash: " +
                res +
                " is created successfully on block number: " +
                blocknumber;
            }
          }
        );
      } catch (e) {
        document.getElementById("txnhash").innerText = e.message;
      }
    } else {
      document.getElementById("txnhash").hidden = false;
      document.getElementById("txnhash").innerText =
        "Sorry, You aren't allowed to transfer to your own account!";
    }
  } else {
    document.getElementById("insufficient").hidden = false;
  }
}

btn1.onclick = () => {
  const number = parseInt(networkNumber.value);
  switchNetworks(number);
};

btn2.onclick = () => {
  const receiveraddress = Receiveraddress.value;
  const number2 = amount.value;
  if (!receiveraddress || !number2) {
    document.getElementById("nullvalues").hidden = false;
  } else {
    if (web3.utils.isAddress(receiveraddress)) {
      sendeth(receiveraddress, number2);
    } else {
      document.getElementById("nullvalues").hidden = false;
      document.getElementById("nullvalues").innerText =
        "Receiver Address Incorrect, Please try again!!";
    }
  }
};

btn10.onclick = () => {
  openMetaMask();
};

btn4.onclick = () => {
  walletConnection();
};

btn6.onclick = () => {
  getWalletAddress();
};

btn7.onclick = () => {
  getBalance();
};

btn8.onclick = () => {
  document.getElementById("insufficient").hidden = true;
};

btn9.onclick = () => {
  receiveraddress.value = "";
  amount.value = "";
  btn2.disabled = false;
  receiveraddress.readOnly = false;
  amount.readOnly = false;
  document.getElementById("txnhash").hidden = true;
};
