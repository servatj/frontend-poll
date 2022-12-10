import { useState } from "react";
import { ethers } from "ethers";


// import betPoolAbi from "../contracts/BetPool.sol/BetPool.json";
import usdcAbi from "../contracts/USDC.sol/USDC.json";

const useWeb3 = () => {
  const [account, setAccount] = useState("");
  const [active, setActive] = useState(false);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [usdcContract, setUsdcContract] = useState();
  const [betPoolContract, setBetPoolContract] = useState();
  
  const usdcAddress = '0x7D3B65090ca63de61a31C4047bc2a970343241fD'
  const betPoolAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  
  const betPoolAbi = [
    'function getBets() external view returns (uint256)',
    'function bet(string memory nickname, uint256 scoreA, uint256 scoreB) external',
  ]
  
  function isMetamaskInstalled() {
    if (window.ethereum) {
      return true;
    } else {
      return false;
    }
  }
  
  async function connect() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [acc] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();
      const usdc = await new ethers.Contract(usdcAddress, usdcAbi.abi, signer, {gasLimit: 3e7} );
      const betPool = await new ethers.Contract(betPoolAddress, betPoolAbi, signer, {gasLimit: 3e7} );

      setSigner(signer);
      setProvider(provider);
      setAccount(acc);
      setActive(true);
      setUsdcContract(usdc);
      setBetPoolContract(betPool);
    } catch (ex) {
      console.log(ex);
    }
  }
  
  const disconnect = async () => {
    try {
      setAccount("");
      setActive(false);
    } catch (ex) {
      console.log(ex);
    }
  };


  return {
    connect,
    disconnect,
    account,
    isMetamaskInstalled,
    active,
    provider,
    signer,
    usdcContract, 
    betPoolContract,
    betPoolAddress
  }
}

export default useWeb3;
