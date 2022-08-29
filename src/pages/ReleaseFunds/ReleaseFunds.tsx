import { useEffect, useState } from "react";
import './releaseFunds.scss';
import Modal from 'react-modal/lib/components/Modal';
import React from "react";
import { mockAvailTokens } from '../../assets/content/availTokens';
import { _address, _chain } from "../../services/auth";
import { releaseFunds, releaseLockedFunds, releaseNativeFunds, releaseNativeLockedFunds, _lmtBalance, _lmtLockedBalance } from "../../services/lockMyTokens";
import { getContractInstance, _signer } from "../../services/ethers";
import {chainIdToContract } from "../../assets/contract/contractAddress";
import LockMyTokensABI from '../../assets/contract/LockMyTokensABI.json';
import { BigNumber, ethers } from "ethers";
import { Alert, Snackbar, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import { chainIdToNetworkNames } from "../../utils/utils";

const ReleaseFunds = (props) => {
    // Modal states
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [modalTypeIsOpen, setModalTypeIsOpen] = useState<boolean>(false);

    const [availableTokens, setAvailableTokens] = useState<any[]|null>(null);
    
    // Web3 states
    const [curAddress, setAddress] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState<number | null>(null);

    // Form states 
    const [amountField, setAmount] = useState<string>("");
    const [selectedToken, setSelectedToken] = useState<any>({ image: "", name: "", address: "" });
    const [fundType, setFundType] = useState<string | null>(null);
    const [destAddress, setDestAddress] = useState<string>("");

    // Error state
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [errorOpen, setErrorOpen] = useState<boolean>(false);

    // Contract state
    const [lmtBalance, setLmtBalance] = useState<string | null>(null);
    const [lmtLockedBalance, setLmtLockedBalance] = useState<string | null>(null);

    const location: any = useLocation()

    useEffect(() => {
        _address.subscribe(a => setAddress(a));
        _signer.subscribe(s => setSigner(s));
        _chain.subscribe(c => {setChainId(c)});
        _lmtBalance.subscribe(b => setLmtBalance(b));
        _lmtLockedBalance.subscribe(b => setLmtLockedBalance(b));

    }, [])

    useEffect(() => {
        if (chainId){
            setAvailableTokens(mockAvailTokens[chainIdToNetworkNames[chainId].name])
        }
    }, [chainId])
    
    useEffect(() => {
        if (location.state.token && location.state.fundType) {
            setSelectedToken(location.state.token);
            setFundType(location.state.fundType);
        }
    }, [])

    const openModal = () => {
        if (!modalIsOpen) {
            setModalIsOpen(true)
        }
    }

    const closeModal = () => {
        if (modalIsOpen) {
            setModalIsOpen(false)
        }
    }

    const handleAmount = (e) => {
        setAmount(e.target.value);
    }

    const handleSelectToken = (name, image, address, native) => {
        setSelectedToken({ name, image, address, native })
        console.log({ address })
        closeModal()
    }

    const setMaxAmount = () => {
        console.log(lmtBalance, lmtLockedBalance)
        if (fundType == "Lock") {
            setAmount(lmtLockedBalance!)
        }
        if (fundType == "Deposit") {
            setAmount(lmtBalance!)
        }
        
        // setAmount()
    }

    const releaseFundsContracts = async () => {
        console.log(fundType)
        if (Number(amountField) == 0) {
            setErrorMsg("Amount cannot be 0");
            setErrorOpen(true);
            return
        }
        try {
            const lmtContract = await getContractInstance(chainIdToContract[chainId!], LockMyTokensABI, signer);
            const tokenAddress = selectedToken.address
            const decimals = 18
            const amountString = (Number(amountField) * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false })
        //     console.log(amountString)
            const amountInWei = BigNumber.from(amountString)
            if (selectedToken.native){
                if (fundType == "Deposit") {
                    await releaseNativeFunds(lmtContract, amountInWei, destAddress)
                } 
                if (fundType == "Lock") {
                    await releaseNativeLockedFunds(lmtContract, amountInWei, destAddress)
                }
            }else{
                if (fundType == "Deposit") {
                    await releaseFunds(lmtContract, tokenAddress, amountInWei, destAddress)
                } 
                if (fundType == "Lock") {
                    await releaseLockedFunds(lmtContract, tokenAddress, amountInWei, destAddress)
                }
            }
        } catch (err: any) {
            setErrorMsg(err)
            setErrorOpen(true)
        }

    }

    const closeError = () => {
        setErrorOpen(false)
        setErrorMsg(null)
    }
    return (
        <>
            <div className="price-ctnr">
                <div className="price-card">
                    <div className="price-header">
                        <h3 className="text-xl text-center">Release funds</h3>
                    </div>
                    <div className="content">
                        <form action="" className="w-3/4 flex flex-col">

                            <button type="button" className="input tracking-wider font-semibold select-token-button p-4 mt-4 rounded-2xl bg-slate-400">
                                {fundType && fundType}
                            </button>

                            <button type="button" onClick={() => openModal()} className="input tracking-wider font-semibold select-token-button p-4   mt-4 rounded-2xl bg-slate-400">
                                <img src={selectedToken.image} alt="" />
                                {selectedToken.name}
                            </button>

                            <div className="amount-field">
                                <input onChange={(e) => handleAmount(e)} value={amountField} type="text" className="input tracking-widest font-semibold my-3 p-4 text-sm w-100 rounded-2xl" name="amount" id="" placeholder="Amount" />
                                <span onClick={() => setMaxAmount()}>max</span>
                            </div>

                            <input onChange={(e) => setDestAddress(e.target.value)} value={destAddress} type="text" className="input tracking-widest font-semibold my-3 p-4 text-sm w-100 rounded-2xl" name="amount" id="" placeholder="Destination address" />

                        </form>
                    </div>

                    <div className="bottom">
                        <button className="gradient py-2 rounded-2xl bg-slate-400" onClick={async () => releaseFundsContracts()}>Release</button>
                    </div>
                </div>

            </div>

            {/* Select Token Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Network Modal"
                className="network-modal"
                ariaHideApp={false}
            >
                <div className="network-list">
                    {availableTokens && availableTokens.map((t: any, index) => {
                        return (
                            <div key={index} className="input network-field select-token-button p-2 mt-4 rounded-2xl bg-slate-400" onClick={async () => handleSelectToken(t.name, t.image, t.address, t.native)}>
                                <img loading='lazy' src={t.image} alt="" />
                                <span className=''>{t.name}</span>
                            </div>
                        )
                    })
                    }
                </div>
            </Modal>


            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={errorOpen}
                onClose={() => closeError()}
                key={"bottom" + "right"}

            >
                <Alert onClose={closeError} severity="error" sx={{ width: '100%' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </>

    )
}

export default ReleaseFunds;