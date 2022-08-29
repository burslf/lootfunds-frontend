import { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { _address } from '../../services/auth';
import { sidenavService, isSidenavOpened } from '../../services/sidenav';
import { concatenatedAdd } from '../../utils/utils';
import BalanceCard from '../BalanceCard/BalanceCard';
import { Link } from 'react-router-dom';
import './sidebar.scss';
import { menuListSidebar } from '../../assets/content/menu';
import React from 'react';
import { _currentCurrency, _lmtBalance, _lmtLockedBalance } from '../../services/lockMyTokens';

const Sidebar = (props) => {
    const [isOpened, setIsOpened] = useState(null);
    const [userAddress, setAddress] = useState(null);

    useEffect(() => {
        isSidenavOpened.subscribe(r => {
            if (r) {
                document.getElementById("layout")!.classList.add("hidden")
            } else {
                document.getElementById("layout")!.classList.remove("hidden")
            }
            setIsOpened(r)
        })

        _address.subscribe(r => { setAddress(r) })
        
    }, []);

    const closeSidebar = () => {
        sidenavService.close()
    }

    return (
        <ProSidebar width={'100%'} collapsedWidth={'0px'} collapsed={!isOpened} onToggle={() => closeSidebar()}>
            <div className="side-header">
                {!userAddress
                    ?
                    <button onClick={async () => await props.login()} className="gradient py-2 rounded-md">
                        Login
                    </button>
                    :
                    <button className="gradient py-2 rounded-md">
                        {concatenatedAdd(userAddress)}
                    </button>
                }
                <span onClick={() => closeSidebar()} className="material-icons close">close</span>
            </div>
            <div className="side-content">
                <ul>

                    {menuListSidebar.map((m,i) => {
                        return (
                            <Link key={i} to={m.route} onClick={() => { sidenavService.close() }}>
                                <li>{m.name}</li>
                            </Link>
                        )
                    })}
                </ul>
                {userAddress && <button onClick={async () => await props.logout()} className="gradient py-2 px-8 rounded-md">
                    Logout
                </button>}
            </div>
        </ProSidebar>
    )
}

export default Sidebar