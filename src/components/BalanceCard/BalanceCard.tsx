import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tokenNameToAddress } from '../../assets/content/availTokens';
import { _address, _balance, _chain } from '../../services/auth';
import { chainIdToNetworkNames } from '../../utils/utils';
import { fromWei } from '../../utils/utils';
import './balanceCard.scss';

const BalanceCard = (props: any) => {
    const [user, setAddress] = useState(null);
    const [chainId, setChainId] = useState<any>(null);
    
    useEffect(() => {
        _address.subscribe(r => setAddress(r));
        _chain.subscribe(r => setChainId(r));

    }, []);

    useEffect(() => {
        console.log(props.balance)
    }, [])

    return (
        <div className="balance-card">
            <div className="balance">
                <div className="text">
                    {props.balanceName}:
                </div>
                <div >
                    {user ? `${props.balance} ${props.currency}` : 'Connect your Metamask'}
                </div>
            </div >
            <div className="bottom">
                {
                    user
                        ?
                        <>
                            <Link to={'/add-funds'} state={chainId ? { token: tokenNameToAddress[chainIdToNetworkNames[chainId].name][props.currency], fundType: props.balanceName } : null}
                                 className="add-fund left">
                                <span>
                                    Add funds
                                </span>
                            </Link>
                            <Link to={'/release-funds'} state={chainId ? { token: tokenNameToAddress[chainIdToNetworkNames[chainId].name][props.currency], fundType: props.balanceName }:null}
                                className="unlock-fund right">
                                <span >Release</span>
                            </Link>
                        </>
                        :
                        <span className='add-fund material-icons' ></span>
                }

            </div>

        </div>
    )
}


export default BalanceCard