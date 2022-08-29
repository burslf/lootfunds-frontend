import './App.scss';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from "./components/Sidebar/Sidebar"
import Home from './pages/Home/Home';
import AddFunds from './pages/AddFunds/AddFunds';
import { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { CSSTransition } from 'react-transition-group';
import ethereum from './services/ethereum';
import { ethers, providers, Signer } from 'ethers';
import {  authService, _address, _chain, _isWeb3Enabled } from './services/auth';
import { ethersService, getContractInstance, _provider, _signer } from './services/ethers';
import React from 'react';
import ReleaseFunds from './pages/ReleaseFunds/ReleaseFunds';
import { chainIdToNetworkNames } from './utils/utils';

const eth = new ethereum();

function App() {
  const location = useLocation();
  const [isWeb3Enabled, setWeb3Enabled] = useState<boolean>(false);
  const [chainId, setChainId] = useState(null);
  const [curAddress, setAddress] = useState(null);
  const [signer, setSigner] = useState<Signer | null>(null)
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)



  useEffect(() => {
    document.documentElement.setAttribute("theme", "dark");
    _isWeb3Enabled.subscribe(w => setWeb3Enabled(w))
    _chain.subscribe(c => setChainId(c))
    _address.subscribe(a => setAddress(a))
    _signer.subscribe(s => setSigner(s))
    _provider.subscribe(p => setProvider(p))
  }, [])


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
          authService.setAddress(accounts[0])
      })

      window.ethereum.on('chainChanged', function (networkId) {
        const chainIdFromHex = parseInt(networkId, 16)
        if (chainIdToNetworkNames[chainIdFromHex]){
          console.log("DAMN")
          authService.setChain(chainIdFromHex)
        }else {
          eth.switchEthereumChain(5)
          // authService.setChain(5)
        }
        console.log('chainChanged', networkId);
      });
    }
  }, [])

  useEffect(() => {    // Set user balance if chain or address changed
    if (isWeb3Enabled && chainId && curAddress) {
      getBalance()
      // console.log(chainId)
      // fetchLmtBalances(signer)
    }
  }, [chainId, isWeb3Enabled, curAddress]);


  async function getBalance() {
    try {
      const bal = await signer!.getBalance()
      const balanceFromBigNum = Number(bal.toString())
      authService.setBalance(balanceFromBigNum)
      return bal
    } catch (e) {
      console.log(e)
    }
  }

//   const fetchLmtBalances = async (signer) => {
//     const lmtContract = await getContractInstance(contractAddress, LockMyTokensABI, signer);
//     const balances = await getLmtBalances(lmtContract, tokenNameToAddress["ETHEREUM"]["USDT"].address, curAddress);
//     lmtService.setLmtLockedBalance(balances[0])
//     lmtService.setLmtBalance(balances[1])
//     lmtService.setCurrentCurrency("USDT")
// }


  const getNetwork = async () => {
    const chainId = await signer!.getChainId()
    authService.setChain(chainId)
  }

  const connectMetamask = async () => {
    if (!window.ethereum) {
      window.open("https://metamask.app.link/dapp/lootfunds.netlify.app")
    }
    try {
      const acc = await eth.accounts()
      if (acc.length === 0) {
        await eth.connectMetamask()
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      ethersService.setProvider(provider)
      const signer = provider.getSigner()
      ethersService.setSigner(signer)
      const address = await signer.getAddress()
      setWeb3Enabled(true);
      authService.setAddress(address);
      let chainId = await signer.getChainId();
      if (!chainIdToNetworkNames[chainId]) {
        chainId = 5
        await eth.switchEthereumChain(chainId)
      }
      authService.setChain(chainId);

    } catch (e) {
      console.log(e)
    }
  }

  const login = async () => {
    connectMetamask()
  }

  const logoutUser = async () => {
    authService.logout();
  }



  return (
    <>
      <Header logout={logoutUser} login={login} />
      <Sidebar logout={logoutUser} login={login} />
      <TransitionGroup className='layout' id="layout">
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
            <Routes location={location}>
              <Route path='/' element={<Home />} />
              <Route path='/add-funds' element={<AddFunds />} />
              <Route path='/release-funds' element={<ReleaseFunds />} />
              
            </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>

  );
}

export default App;
