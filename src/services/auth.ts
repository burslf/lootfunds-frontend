import { BehaviorSubject } from "rxjs";

const _isWeb3Enabled = new BehaviorSubject(false)
const _chain = new BehaviorSubject(null)
const _address = new BehaviorSubject(null)
const _tokens = new BehaviorSubject(null)
const _balance = new BehaviorSubject(null)

const authService = {
    setWeb3: function (web3) {
        _isWeb3Enabled.next(web3)
    },
    setChain: function (chainId) {
        _chain.next(chainId)
    },
    setAddress: function (add) {
        _address.next(add)
    },
    setTokens: function (tok) {
        _tokens.next(tok)
    },
    setBalance: function (bal) {
        _balance.next(bal)
    },
    logout: function () {
        _isWeb3Enabled.next(false)
        _address.next(null)
        _tokens.next(null)
        _balance.next(null)
        _chain.next(null)
    },
}

export {
    authService,
    _isWeb3Enabled,
    _address,
    _tokens,
    _balance,
    _chain,
}