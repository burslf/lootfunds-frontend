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
import { chainIdToNetworkNames, fromWei } from './utils/utils';
import { chainIdToContract } from './assets/contract/contractAddress';
import { tokenNameToAddress } from './assets/content/availTokens';
import { getLmtBalances, getLmtNativeBalances, lmtService, _currentCurrency, _lmtBalance, _lmtLockedBalance } from './services/lockMyTokens';
import LootFundsABI from './assets/contract/LootFundsABI.json';

const eth = new ethereum();

function App() {
  const location = useLocation();
  const [isWeb3Enabled, setWeb3Enabled] = useState<boolean>(false);
  const [chainId, setChainId] = useState(null);
  const [curAddress, setAddress] = useState(null);
  const [signer, setSigner] = useState<Signer | null>(null)
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)
  const [curCurrency, setCurCurrency] = useState<string | null>("null")
  const [lmtBalance, setLmtBalance] = useState<string | null>(null);
  const [lmtLockedBalance, setLmtLockedBalance] = useState<string | null>(null);


  useEffect(() => {
    document.documentElement.setAttribute("theme", "dark");
    _isWeb3Enabled.subscribe(w => setWeb3Enabled(w))
    _chain.subscribe(c => setChainId(c))
    _address.subscribe(a => setAddress(a))
    _signer.subscribe(s => setSigner(s))
    _provider.subscribe(p => setProvider(p))

    _currentCurrency.subscribe(c => setCurCurrency(c))
    _lmtBalance.subscribe(b => setLmtBalance(b));
    _lmtLockedBalance.subscribe(b => setLmtLockedBalance(b));

  }, [])


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
          authService.setAddress(accounts[0])
      })

      window.ethereum.on('chainChanged', function (networkId) {
        const chainIdFromHex = parseInt(networkId, 16)
        if (chainIdToNetworkNames[chainIdFromHex]){
          authService.setChain(chainIdFromHex)
        }else {
          eth.switchEthereumChain(5)
        }
      });
    }
  }, [])

  useEffect(() => {  
    if (isWeb3Enabled && chainId && curAddress) {
      fetchNativeBalance(signer)
      fetchLmtBalances(signer)
    }
  }, [chainId]);

  useEffect(() => {  
    if (isWeb3Enabled && chainId && curAddress) {
      fetchNativeBalance(signer)
      fetchLmtBalances(signer)   
    }
  }, [curAddress]);

  const fetchNativeBalance = async (signer) => {
    const balance = await signer.getBalance()
    const balanceFromBigNum = Number(balance.toString())
    authService.setBalance(balanceFromBigNum)
  }

  const fetchLmtBalances = async (signer) => {
    const currentNetwork = chainIdToNetworkNames[chainId!].name
    const contractForNetwork = chainIdToContract[chainId!]
    
    const tokenToFetch = tokenNameToAddress[currentNetwork][curCurrency]
    const lmtContract = await getContractInstance(contractForNetwork, LootFundsABI, signer);
    let balances = []
    if (tokenToFetch.native) {
        balances = await getLmtNativeBalances(lmtContract, curAddress);
    }else {
        balances = await getLmtBalances(lmtContract, tokenNameToAddress[currentNetwork][curCurrency!].address, curAddress);
    }
    lmtService.setLmtLockedBalance(fromWei(balances[0]))
    lmtService.setLmtBalance(fromWei(balances[1]))
}


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
              <Route path='/' element={<Home fetchLmtBalances={fetchLmtBalances}/>} />
              <Route path='/add-funds' element={<AddFunds fetchNativeBalance={fetchNativeBalance}/>} />
              <Route path='/release-funds' element={<ReleaseFunds />} />
              
            </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>

  );
}

export default App;
