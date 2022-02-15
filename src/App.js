import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTcontract from "./utils/NFTcontract.json";
import "./styles/App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const CONTRACT_ADDRESS = "0x9D9D8A5b5000C7dcBA16477F991CB3A0D650dbc9";
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    
    //This will request the object to check if a wallet address is 
    //authorised for this site , if yes then it will set the currentAccount,
    //If not when we will click connect wallet this site will be authorised
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  

  const connectWallet = async () => {
    try {

      //Gets the ethereum object injected by metamask.
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      //This will get the account id from the ethereum object injected by metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  
  const askContractToMintNft = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          NFTcontract.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://ropsten.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Will get rendered if the no user is connected
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  /*
   * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
   */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <a
            href={`https://ropsten.rarible.com/collection/${CONTRACT_ADDRESS}/items`}
          >
            View collection on Rarible
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
