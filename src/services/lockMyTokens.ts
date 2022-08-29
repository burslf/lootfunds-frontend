import { BehaviorSubject } from "rxjs";
import { ethers } from "ethers";
import { fromBigNumber } from '../utils/utils';

const _lmtLockedBalance = new BehaviorSubject(null)
const _lmtBalance = new BehaviorSubject(null)
const _currentCurrency = new BehaviorSubject(null)

const lmtService = {

    setLmtBalance: function (b) {
        _lmtBalance.next(b)
    },
    setLmtLockedBalance: function (b) {
        _lmtLockedBalance.next(b)
    },
    setCurrentCurrency: function (c) {
        _currentCurrency.next(c)
    },
}

const getLmtBalances = async (lmtContract, tokenAddress, userAddress) => {
    try {
        const lmtBalances = await lmtContract.walletBalance(tokenAddress, userAddress)
        const lockedBalance = fromBigNumber(lmtBalances._locked)
        const balance = fromBigNumber(lmtBalances._available)
        console.log(lockedBalance, balance)
        return [lockedBalance, balance]
    } catch (e: any) {
        return e
    }
}

const getLmtNativeBalances = async (lmtContract, userAddress) => {
    try {
        const lmtBalances = await lmtContract.walletNativeBalance(userAddress)
        const lockedBalance = fromBigNumber(lmtBalances._locked)
        const balance = fromBigNumber(lmtBalances._available)
        console.log(lockedBalance, balance)
        return [lockedBalance, balance]
    } catch (e: any) {
        return e
    }
}

const depositFund = async (lmtContract: ethers.Contract, tokenAddress, amount) => {
    try {
        const gas = await lmtContract.estimateGas.depositERC20(tokenAddress, amount)
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.depositERC20(tokenAddress, amount, {
            gasLimit: gas
        })
    } catch (err: any) {
        const code:any = {err};
        throw code.err.reason
    }
    // 0.0000603

}

const lockFund = async (lmtContract, tokenAddress, amount, timestamp) => {
    try {
        const gas = await lmtContract.estimateGas.lockERC20(tokenAddress, amount, timestamp)
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.lockERC20(tokenAddress, amount, timestamp, {
            gasLimit: gas
        })

    } catch (err: any) {
        // const code = err.data.replace('Reverted ','');
        const code:any = {err};
        if (code.err.reason){
            throw JSON.stringify(code.err.reason)
        }else if (code.err.message){
            throw JSON.stringify(code.err.message)    
        }
    }
}

const depositNativeFund = async (lmtContract: ethers.Contract, amount) => {
    console.log(amount)
    try {
        const gas = await lmtContract.estimateGas.depositNative({value:amount})
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.depositNative({
            gasLimit: gas,
            value: fromBigNumber(amount)
        })
    } catch (err: any) {
        const code:any = {err};
        throw code.err.reason
    }
    // 0.0000603

}

const lockNativeFund = async (lmtContract, amount, timestamp) => {
    try {
        const gas = await lmtContract.estimateGas.lockNative(timestamp, {value:amount})
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.lockNative(timestamp, {
            gasLimit: gas,
            value: amount
        })

    } catch (err: any) {
        // const code = err.data.replace('Reverted ','');
        const code:any = {err};
        if (code.err.reason){
            throw JSON.stringify(code.err.reason)
        }else if (code.err.message){
            throw JSON.stringify(code.err.message)    
        }
    }
}

const releaseFunds = async (lmtContract, tokenAddress, amount, dest) => {
    try {
        const gas = await lmtContract.estimateGas.withdrawERC20(tokenAddress, amount, dest)
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.withdrawERC20(tokenAddress, amount, dest, {
            gasLimit: gas
        })

    } catch (err: any) {
        // const code = err.data.replace('Reverted ','');
        const code:any = {err};
        if (code.err.reason){
            throw JSON.stringify(code.err.reason)
        }else if (code.err.message){
            throw JSON.stringify(code.err.message)    
        }
    }
    
}

const releaseLockedFunds = async(lmtContract, tokenAddress, amount, dest) => {
    console.log(tokenAddress, amount, dest)
    try {
        const gas = await lmtContract.estimateGas.withdrawLockedERC20(tokenAddress, amount, dest)
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.withdrawLockedERC20(tokenAddress, amount, dest, {
            gasLimit: gas
        })

    } catch (err: any) {
        // const code = err.data.replace('Reverted ','');
        const code:any = {err};
        if (code.err.reason){
            throw JSON.stringify(code.err.reason)
        }else if (code.err.message){
            throw JSON.stringify(code.err.message)    
        }
    }
    
}

const releaseNativeFunds = async(lmtContract, amount, dest) => {
    console.log(amount, dest)
    try {
        const gas = await lmtContract.estimateGas.withdrawNative(amount, dest)
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.withdrawNative(amount, dest, {
            gasLimit: gas
        })

    } catch (err: any) {
        // const code = err.data.replace('Reverted ','');
        const code:any = {err};
        if (code.err.reason){
            throw JSON.stringify(code.err.reason)
        }else if (code.err.message){
            throw JSON.stringify(code.err.message)    
        }
    }
    
}

const releaseNativeLockedFunds = async(lmtContract, amount, dest) => {
    console.log(amount, dest)
    try {
        const gas = await lmtContract.estimateGas.withdrawLockedNative(amount, dest)
        console.log(gas)
        const formattedGas = Number(gas)
        console.log(gas)
        await lmtContract.withdrawLockedNative(amount, dest, {
            gasLimit: gas
        })

    } catch (err: any) {
        // const code = err.data.replace('Reverted ','');
        const code:any = {err};
        if (code.err.reason){
            throw JSON.stringify(code.err.reason)
        }else if (code.err.message){
            throw JSON.stringify(code.err.message)    
        }
    }
    
}






export {
    _lmtLockedBalance,
    _lmtBalance,
    _currentCurrency,
    lmtService,
    getLmtBalances,
    getLmtNativeBalances,
    depositFund,
    lockFund,
    releaseFunds,
    releaseLockedFunds,
    depositNativeFund,
    lockNativeFund,
    releaseNativeFunds,
    releaseNativeLockedFunds
}