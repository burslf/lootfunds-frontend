import './header.scss';
import React from 'react';
import Modal from 'react-modal/lib/components/Modal';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Signer } from 'ethers';
import { chainIdToNetworkNames, concatenatedAdd } from '../../utils/utils';
import { menuList } from '../../assets/content/menu';
import { _signer } from '../../services/ethers';
import { logoPath } from '../../services/theme';
import ethereum from '../../services/ethereum';
import { sidenavService } from '../../services/sidenav';
import { authService, _address, _chain } from '../../services/auth';
import { networkMenu } from '../../assets/content/selectNetwork';
import { mockAvailTokens } from '../../assets/content/availTokens';
import { tokenNameToAddress } from '../../assets/content/availTokens';
import { getLmtBalances, getLmtNativeBalances, lmtService } from '../../services/lockMyTokens';
import { getContractInstance } from '../../services/ethers';
import { chainIdToContract, contractAddress } from '../../assets/contract/contractAddress';
import LockMyTokensABI from '../../assets/contract/LockMyTokensABI.json';
import { fromWei } from '../../utils/utils';
import { contractsService } from '../../services/contracts';

const Header = (props) => {
    const [logo, setLogo] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [modal2IsOpen, setModal2IsOpen] = useState<boolean>(false);
    const [userAddress, setAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null)
    const [chainId, setChainId] = useState<number | null>(null);
    
    const navigate = useNavigate();

    Modal.defaultStyles.overlay.backgroundColor = 'rgb(0,0,0, 0.8)'

    useEffect(() => {
        logoPath.subscribe(r => { setLogo(r) })
        _address.subscribe(r => { setAddress(r) })
        _signer.subscribe(s => setSigner(s))
        _chain.subscribe(c => {setChainId(c)})
    }, []);

    const openSidenav = () => {
        sidenavService.open()
    }
    const openModal = () => {
        if (modal2IsOpen) {
            setModal2IsOpen(false)
        }
        if (!modalIsOpen) {
            setModalIsOpen(true)
        }
    }

    const openCurrencyModal = () => {
        if (modalIsOpen) {
            setModalIsOpen(false)
        }
        if (!modal2IsOpen) {
            setModal2IsOpen(true)
        }
    }

    const closeCurrencyModal = () => {
        if (modal2IsOpen) {
            setModal2IsOpen(false)
        }
    }

    const closeModal = () => {
        if (modalIsOpen) {
            setModalIsOpen(false)
        }
    }

    const selectNetwork = async (network) => {
        const eth = new ethereum()
        await eth.switchEthereumChain(network)
        authService.setChain(network)
        contractsService.setLmtContract(chainIdToContract[network])
        const balance = await signer!.getBalance()
        const balanceFromBigNum = Number(balance.toString())
        authService.setBalance(balanceFromBigNum)
        lmtService.setCurrentCurrency(chainIdToNetworkNames[network].currency)
        closeModal()
    }

    const handleSelectToken = async (name, image, address, native) => {
        try {
            const lmtContract = await getContractInstance(chainIdToContract[chainId!], LockMyTokensABI, signer);
            let balances = [];
            if (native){
                balances = await getLmtNativeBalances(lmtContract, userAddress)
            }else{
                balances = await getLmtBalances(lmtContract, address, userAddress)
            }
            lmtService.setCurrentCurrency(name)
            lmtService.setLmtLockedBalance(fromWei(balances[0]))        
            lmtService.setLmtBalance(fromWei(balances[1]))
            // navigate("/")
        }catch(e){
            console.log(e)
        }
        closeCurrencyModal()
        
    }

    return (
        <>
            <div className="header relative">
                <div className="left">
                    <Link to={'/'}>
                        <img src={`${logo}`} alt="" srcSet="" />
                    </Link>
                </div>
                <div className="center">
                    <ul>
                        {
                            menuList.map((m, i) => {
                                return (
                                    <div key={i} className='group inline-block relative z-100'>
                                        <Link to={m.route}>
                                            <button className='li py-2 hover:rounded'>{m.name}</button>
                                        </Link>

                                        <div className='absolute w-full hidden text-gray-700 pt-1 group-hover:block z-100'>
                                            {
                                                m.sub && m.sub.map((s, i) => {
                                                    return (
                                                        <Link to={s.route} key={i}>
                                                            <button className={`${s.isFirst && `rounded-t`} ${s.isLast && `rounded-b`} gradient sub-li py-2 gradient-hover whitespace-no-wrap z-100 hover:z-100`}>
                                                                {s.name}
                                                            </button>
                                                        </Link>


                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </ul>


                </div>
                <div className="right">
                    {!userAddress
                        ?
                        <button onClick={async () => await props.login()} className="gradient py-2 rounded-md">Login</button>
                        :
                        <div className="group inline-block relative z-100">
                            <button className="gradient py-2 rounded-md">{concatenatedAdd(userAddress)}</button>
                            <div className="absolute hidden text-gray-700 pt-1 group-hover:block z-100">
                                <button onClick={() => openModal()} 
                                        className='gradient rounded-t p-2 gradient-hover whitespace-no-wrap z-100 hover:z-100'
                                >
                                    Switch Network
                                </button>
                                <button onClick={() => openCurrencyModal()} 
                                        className='gradient p-2 gradient-hover whitespace-no-wrap z-100 hover:z-100'
                                >
                                    Switch Currency
                                </button>
                                <button onClick={() => { props.logout(); closeModal() }} 
                                        className='gradient rounded-b p-2 gradient-hover block whitespace-no-wrap z-100 hover:z-100'
                                >
                                    Logout
                                </button>

                            </div>
                        </div>
                    }
                    <ThemeToggle />
                    <span onClick={() => openSidenav()} className="material-icons">menu</span>
                </div>
            </div>


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Network Modal"
                className="network-modal"
                ariaHideApp={false}
            >
                <div className="network-list">
                    {networkMenu.map((n, index) => {
                        return (
                            <button key={index} className="input network-field p-2 mt-4 rounded-2xl bg-slate-400" onClick={n.clickable ? async () => await selectNetwork(n.chainId): () => {}} >
                                <img loading='lazy' src={n.path} alt="" />
                                <span className=''>{n.name}</span>
                            </button>
                        )
                    })
                    }
                </div>
            </Modal>

            <Modal
                isOpen={modal2IsOpen}
                onRequestClose={closeCurrencyModal}
                contentLabel="Currency Modal"
                className="network-modal"
                ariaHideApp={false}
            >
                <div className="network-list">
                    {chainId && mockAvailTokens[chainIdToNetworkNames[chainId].name].map((t: any, index) => {
                        return (
                            <button key={index} className="input network-field select-token-button p-2 mt-4 rounded-2xl bg-slate-400" onClick={async () => handleSelectToken(t.name, t.image, t.address, t.native)}>
                                <img loading='lazy' src={t.image} alt="" />
                                <span className=''>{t.name}</span>
                            </button>
                        )
                    })
                    }
                </div>
            </Modal>

            
        </>
    )
}

export default Header;