import { useState } from "react";
import { ethers } from "ethers";

import betPoolAbi from "../contracts/BetPool.sol/BetPool.json";
import usdcAbi from "../contracts/USDC.sol/USDC.json";

const useWeb3 = () => {
  const [account, setAccount] = useState("");
  const [active, setActive] = useState(false);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [usdcContract, setUsdcContract] = useState();
  const [betPoolContract, setBetPoolContract] = useState();
  
  const usdcAddress = '0x9D2f30cd314084e6F607CE9E8Df174F0D4ef0942'
  const betPoolAddress = '0xaF3Fb24a348b8066eFc9905899dB1BC4E0EDA9df'

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
      const betPool = await new ethers.Contract(betPoolAddress, betPoolAbi.abi, signer, {gasLimit: 3e7} );

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
