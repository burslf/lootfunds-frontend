import { ethers } from "ethers";
import { BehaviorSubject } from "rxjs";
import { fromBigNumber } from "../utils/utils";

const _signer = new BehaviorSubject(null)
const _provider = new BehaviorSubject<any>(null)


const ethersService = {
    setSigner: function (sig) {
        _signer.next(sig)
    },
    setProvider: function (prov) {
        _provider.next(prov)
    }
    
}

const getContractInstance = async (contractAddress, abi, signer) => {
    return new ethers.Contract(contractAddress, abi, signer)
}

const getTokenBalance = async (tokenAddress, abi, userAddress, signer) => {
    const ERC20contract = await new ethers.Contract(tokenAddress, abi, signer)
    const balance = await ERC20contract.balanceOf(userAddress) 
    return balance
}

export {
    ethersService,
    _signer,
    _provider,
    getContractInstance,
    getTokenBalance
}