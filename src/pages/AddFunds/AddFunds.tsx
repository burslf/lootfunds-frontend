import { useEffect, useState } from "react";
import './addFunds.scss';
import Modal from 'react-modal/lib/components/Modal';
import React from "react";
import { mockAvailTokens, tokenNameToAddress } from '../../assets/content/availTokens';
import { _address, _balance, _chain } from "../../services/auth";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { depositFund, depositNativeFund, lockFund, lockNativeFund } from "../../services/lockMyTokens";
import { getContractInstance, getTokenBalance, _signer } from "../../services/ethers";
import {chainIdToContract } from "../../assets/contract/contractAddress";
import LockMyTokensABI from '../../assets/contract/LockMyTokensABI.json';
import { BigNumber, ethers } from "ethers";
import { Alert, Snackbar, TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useLocation } from "react-router-dom";
import ERC20Abi from '../../assets/contract/ERC20Abi.json';
import { chainIdToNetworkNames, fromBigNumber, fromWei } from "../../utils/utils";

const AddFunds = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [modalTypeIsOpen, setModalTypeIsOpen] = useState<boolean>(false);
    const [availableTokens, setAvailableTokens] = useState<any[]|null>(null);
    const [curAddress, setAddress] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [curBalance, setCurBalance] = useState<number | null>(null);
    
    // Form states 
    const [amountField, setAmount] = useState("");
    const [selectedToken, setSelectedToken] = useState<any>(null);
    const [dateField, setDateField] = useState<any>(null);
    const [fundType, setFundType] = useState<string | null>(null);
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

    // Error state
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [errorOpen, setErrorOpen] = useState<boolean>(false);

    const location: any = useLocation()

    useEffect(() => {
        _address.subscribe(a => setAddress(a));
        _signer.subscribe(s => setSigner(s));
        _chain.subscribe(c => {setChainId(c)});
        _balance.subscribe(b => setCurBalance(b))

    }, [])

    useEffect(() => {
        if (chainId){
            setAvailableTokens(mockAvailTokens[chainIdToNetworkNames[chainId].name])
        }
    }, [chainId])

    useEffect(() => {
        if (location.state?.token && location.state?.fundType) {
            console.log(location.state.token, location.state.fundType);
            setSelectedToken(location.state.token);
            setFundType(location.state.fundType);
        }
    }, [])


    const openModal = () => {
        if (!modalIsOpen) {
            setModalIsOpen(true)
        }
    }

    const openTypeModal = () => {
        if (!modalTypeIsOpen) {
            setModalTypeIsOpen(true)
        }
    }

    const closeModal = () => {
        if (modalIsOpen) {
            setModalIsOpen(false)
        }
    }

    const closeTypeModal = () => {
        if (modalTypeIsOpen) {
            setModalTypeIsOpen(false)
        }
    }


    const handleAmount = (e) => {
        setAmount(e.target.value);
        let decimals = 18;
    }

    const handleSelectToken = (name, image, address, native) => {
        setSelectedToken({ name, image, address, native })
        console.log({ address })
        closeModal()
    }

    const handleDate = (e) => {
        const dateNow = Math.floor(Date.now() / 1000)
        if (parseInt(e.format("X")) < dateNow) {
            setErrorMsg("Date cannot be from past")
            setErrorOpen(true)
            return
        }
        setDateField(e)
        // let a = e.format()
        // console.log(a.format())
        // console.log(e.target.value)
        // setDateField(e.target.value)
        // const timestamp = Math.floor(new Date(e.target.value).getTime() / 1000);
        // setDateField(timestamp)
        // console.log(timestamp)

    }

    const setMaxAmount = async () => {
        console.log(selectedToken)
        if (selectedToken.native && curBalance){
            setAmount(fromWei(curBalance))
        }else{
            const balanceOfToken = await getTokenBalance(selectedToken.address, ERC20Abi, curAddress, signer)
            setAmount(fromWei(fromBigNumber(balanceOfToken)))
        }
        // console.log(fromBigNumber(balanceOfToken))
    }

    const handleSelectType = (type) => {
        setFundType(type)
        closeTypeModal()
    }

    const addFundsContracts = async () => {
        if (!amountField) {
            setErrorMsg("No amount selected")
            setErrorOpen(true)
            return
        }
        try {
            const lmtContract = await getContractInstance(chainIdToContract[chainId!], LockMyTokensABI, signer);
            const tokenAddress = selectedToken.address
            const decimals = 18
            const amountString = (Number(amountField) * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false })
            console.log(amountString)
            const amountInWei = BigNumber.from(amountString)
            if (selectedToken.native){
                if (fundType == "Deposit") {
                    console.log(amountInWei)
                    await depositNativeFund(lmtContract, amountInWei)
                }else {
                    const date = dateField
                    if (!date) {
                        setErrorMsg("No date selected")
                        setErrorOpen(true)
                        return
                    }
                    await lockNativeFund(lmtContract, amountInWei, date.format("X"));
                }
            }else {
                if (fundType == "Deposit") {
                    await depositFund(lmtContract, tokenAddress, amountInWei)
                } else {
                    const date = dateField
                    if (!date) {
                        setErrorMsg("No date selected")
                        setErrorOpen(true)
                        return
                    }
                    await lockFund(lmtContract, tokenAddress, amountInWei, date.format("X"))
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
                        <h3 className="text-xl text-center">Add funds</h3>
                    </div>
                    <div className="content">
                        <form action="" className="w-3/4 flex flex-col">

                            {
                                fundType ?
                                    <button type="button" onClick={() => openTypeModal()} className="input tracking-wider font-semibold select-token-button p-4 mt-4 rounded-2xl bg-slate-400">
                                        {fundType}
                                        <span>
                                            <ArrowDropDownIcon />
                                        </span>
                                    </button>
                                    :
                                    <button type="button" onClick={() => openTypeModal()} className="input tracking-wider font-semibold select-token-button p-4 mt-4 rounded-2xl bg-slate-400">
                                        Select type
                                        <span>
                                            <ArrowDropDownIcon />
                                        </span>
                                    </button>
                            }
                            {
                                selectedToken
                                    ?
                                    <button type="button" onClick={() => openModal()} className="input tracking-wider font-semibold select-token-button p-4   mt-4 rounded-2xl bg-slate-400">
                                        <img src={selectedToken.image} alt="" />
                                        {selectedToken.name}
                                    </button>
                                    :
                                    <button type="button" onClick={() => openModal()} className="input tracking-wider font-semibold select-token-button p-4 mt-4 rounded-2xl bg-slate-400">
                                        Select token
                                    </button>

                            }

                            <div className="amount-field">
                                <input onChange={(e) => handleAmount(e)} value={amountField} type="text" className="input tracking-widest font-semibold my-3 p-4 text-sm w-100 rounded-2xl" name="amount" id="" placeholder="Amount" />
                                <span onClick={() => setMaxAmount()}>max</span>
                            </div>

                            {
                                fundType == "Lock"
                                &&
                                // <input placeholder="Select date" type="date" onChange={e => handleDate(e)} className="input tracking-wider font-semibold select-token-button p-4 rounded-2xl bg-slate-400" />
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DateTimePicker
                                        label="Date&Time picker"
                                        value={dateField}
                                        open={calendarOpen}
                                        onClose={() => setCalendarOpen(false)}
                                        onChange={handleDate}
                                        disablePast
                                        // renderInput={(params) => <TextField {...params} />}
                                        renderInput={(params) => (
                                            <div className="w-full">
                                                <TextField style={{ opacity: 0, width: 0, height: 0 }} {...params} />
                                                <button type="button" className="input tracking-widest border-none outline-hidden font-semibold my-3 p-4 text-sm w-full rounded-2xl" onClick={() => setCalendarOpen(true)}>
                                                    {dateField ? dateField.format("M-DD-YYYY HH:mm") : "Select date"}
                                                </button>
                                            </div>
                                        )}
                                    />
                                </LocalizationProvider>

                            }


                        </form>
                    </div>

                    <div className="bottom">
                        <button className="gradient py-2 rounded-2xl bg-slate-400" onClick={async () => addFundsContracts()}>Add</button>
                    </div>
                </div>

            </div >

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

            {/* Select Type Modal */}
            <Modal
                isOpen={modalTypeIsOpen}
                onRequestClose={closeTypeModal}
                contentLabel="Network Modal"
                className="network-modal"
                ariaHideApp={false}
            >
                {/* <div> */}
                <h2 className="text-xl">Select funds type</h2>
                {/* </div> */}
                <div className="network-list">
                    <button className="input border-none outline-none network-field select-token-button p-2 mt-4 rounded-2xl bg-slate-400" onClick={async () => handleSelectType("Lock")}>
                        {/* <img loading='lazy' src={t.image} alt="" /> */}
                        <span className=''>Lock funds</span>
                    </button>
                    <button className="input border-none outline-none network-field select-token-button p-2 mt-4 rounded-2xl bg-slate-400" onClick={async () => handleSelectType("Deposit")}>
                        {/* <img loading='lazy' src={t.image} alt="" /> */}
                        <span className=''>Deposit fund</span>
                    </button>



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

export default AddFunds;