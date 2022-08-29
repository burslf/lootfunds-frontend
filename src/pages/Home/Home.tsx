import './home.scss';
import React, { useEffect, useState } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import { lmtService, getLmtBalances, _lmtBalance, _lmtLockedBalance, _currentCurrency, getLmtNativeBalances } from '../../services/lockMyTokens';
import { Link } from 'react-router-dom';
import { chainIdToNetworkNames, fromBigNumber, fromWei, getGatewayUrl } from '../../utils/utils';
import { getContractInstance, _signer } from '../../services/ethers';
import { _address, authService, _chain } from '../../services/auth';
import { chainIdToContract, contractAddress } from '../../assets/contract/contractAddress';
import LockMyTokensABI from '../../assets/contract/LockMyTokensABI.json';
import { tokenNameToAddress } from '../../assets/content/availTokens';

const Home = () => {
    const [lmtBalance, setLmtBalance] = useState<string | null>(null);
    const [lmtLockedBalance, setLmtLockedBalance] = useState<string | null>(null);
    const [curCurrency, setCurCurrency] = useState<string | null>("null")
    const [curAddress, setCurAddress] = useState<string | null>(null)
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState<number | null>(null);

    useEffect(() => {
        _lmtBalance.subscribe(b => setLmtBalance(b));
        _lmtLockedBalance.subscribe(b => setLmtLockedBalance(b));
        _currentCurrency.subscribe(c => setCurCurrency(c))
        _signer.subscribe(s => setSigner(s));
        _address.subscribe(a => setCurAddress(a))
        _chain.subscribe(c => setChainId(c))
    }, [])

    useEffect(() => {
        if (chainId && !curCurrency) {
            lmtService.setCurrentCurrency(chainIdToNetworkNames[chainId].currency)
        }
    }, [chainId])

    useEffect(() => {
        if (signer && curAddress && chainId && curCurrency) {
            fetchLmtBalances(signer)
        }
    }, [signer, curAddress, chainId, curCurrency])

    const fetchLmtBalances = async (signer) => {
        const currentNetwork = chainIdToNetworkNames[chainId!].name
        const contractForNetwork = chainIdToContract[chainId!]
        
        // console.log(tokenNameToAddress[currentNetwork][curCurrency])
        const tokenToFetch = tokenNameToAddress[currentNetwork][curCurrency]
        const lmtContract = await getContractInstance(contractForNetwork, LockMyTokensABI, signer);
        let balances = []
        if (tokenToFetch.native) {
            balances = await getLmtNativeBalances(lmtContract, curAddress);
        }else {
            balances = await getLmtBalances(lmtContract, tokenNameToAddress[currentNetwork][curCurrency!].address, curAddress);
        }
        console.log(balances)
        lmtService.setLmtLockedBalance(fromWei(balances[0]))
        lmtService.setLmtBalance(fromWei(balances[1]))
    }


    return (
        <div className="home">
            <section className="discover">
                <div>
                    <h2 className="font-medium my-12 text-2xl">
                        Lock your funds until you need it back. As simple as that.
                    </h2>
                    <p className='mt-12 mb-4'>
                        Choose a period of time you want to lock your funds, the amount, and we will keep it safe until unlock time.
                    </p>
                    <p className="mb-12">
                        Ensuring safely locking tokens using smart contract technology.
                    </p>

                </div>
            </section>
            <section className='balances-section'>
                <div className="balances flex justify-around">
                    <BalanceCard balanceName={"Lock"} balance={lmtLockedBalance} currency={curCurrency} />
                    <BalanceCard balanceName={"Deposit"} balance={lmtBalance} currency={curCurrency} />
                </div>
            </section>




        </div >
    )
}

export default Home



// <section className="tokens-overview">
//                 <div className="head">
//                     <h1 className='font-semibold my-7 text-xl'>Events</h1>
//                     <div className="see-all">
//                         <Link to={'/events'}>
//                             <span className='cursor-pointer'>See all</span>
//                         </Link>
//                         {/* <mat-icon>keyboard_arrow_right</mat-icon> */}
//                     </div>
//                 </div>
//                 <div className="tokens">
//                     <div className="overflow-hidden">
//                         {
//                             allEvents
//                                 ?
//                                 allEvents.map((t:any, i) => {
//                                     return (
//                                         <div onClick={(e) => { }} className="token" key={i}>
//                                             <img className={''} src={t.artwork ? t.artwork : "/assets/images/no-logo.png"} alt="" srcSet="" />
//                                             {/* FOR IPFS <img className={''} src={t.artwork ? getGatewayUrl(t.artwork) : "/assets/images/no-logo.png"} alt="" srcSet="" /> */}
//                                             <span className='mt-4 text-sm'>{t.song}</span>
//                                         </div>
//                                     )
//                                 })
//                                 :
//                                 <div className="token" >
//                                 </div>
//                         }

//                     </div>
//                 </div>

//             </section >




// {/* <section className="tokens-overview">
// <div className="head">
//     <h1 className='font-semibold my-7 text-xl'>Your Tokens</h1>
//     <div className="see-all">
//         <span>See all</span>
//         {/* <mat-icon>keyboard_arrow_right</mat-icon> */}
//     </div>
// </div>
// <div className="tokens">
//     <div className="overflow-hidden">
//         {
//             userTokens
//                 ?
//                 userTokens.map((t, i) => {
//                     return (
//                         <div className="token" key={i}>
//                             <img src={t.logo ? t.logo : "/assets/images/no-logo.png"} alt="" srcSet="" />
//                             <span className='mt-4'>{t.symbol}</span>
//                         </div>
//                     )
//                 })
//                 :
//                 <div className="token" >
//                     <img src="/assets/images/no-logo.png" alt="" srcSet="" />
//                     <span className='mt-4'>You aren't logged in</span>
//                 </div>
//         }

//     </div>
// </div>

// </section > */}



// <section className="tokens-overview">
// <div className="head">
//     <h1 className='font-semibold my-7 text-xl'>Albums</h1>
//     <div className="see-all">
//         <Link to={'/'}>
//             <span className='cursor-pointer'>See all</span>
//         </Link>
//         {/* <mat-icon>keyboard_arrow_right</mat-icon> */}
//     </div>
// </div>
// <div className="tokens">
//     <div className="overflow-hidden">
//         <div className="token" >
//             <img src="/assets/images/no-entry.png" alt="" />
//             <span className='mt-4 text-sm' >Coming Soon...</span>
//         </div>
//     </div>
// </div>

// </section >