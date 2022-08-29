import { BehaviorSubject } from "rxjs";

const isSidenavOpened = new BehaviorSubject(false)

const sidenavService = {
    open : function() {
        isSidenavOpened.next(true)
    },
    close: function() {
        isSidenavOpened.next(false)
    },
    toggle: function() {
        isSidenavOpened.next(!isSidenavOpened.getValue())
    }
}

export {
    isSidenavOpened, 
    sidenavService,
}