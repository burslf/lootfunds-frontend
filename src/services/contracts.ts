import { BehaviorSubject } from "rxjs";

const _lmtContract = new BehaviorSubject(null)

const contractsService = {
    setLmtContract : function(s) {
        _lmtContract.next(s)
    }
    
}

export {
    _lmtContract,
    contractsService
}