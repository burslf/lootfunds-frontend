import { ethers } from "ethers";
import { chainIdToNetworkNames } from "../utils/utils";


class ethereum {
    constructor() { }

    // async switchEthereumChain(chain) {
    //     const chainToHex = ethers.utils.hexValue(chain)
    //     return await window.ethereum.request({
    //         method: 'wallet_switchEthereumChain',
    //         params: [{ chainId: chainToHex }],
    //     })
    // }

    async connectMetamask() {
        return await window.ethereum
        .request({ method: "eth_requestAccounts" })
    }

    async currentChainId() {
        return await window.ethereum
        .request({ method: "eth_chainId" })
    }

    async accounts(){
        return await window.ethereum.request({method: 'eth_accounts'});
    }

    async switchEthereumChain(chain) {
        const chainToHex = ethers.utils.hexValue(chain)

        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainToHex }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: chainToHex,
                      chainName: chainIdToNetworkNames[chain].name,
                      rpcUrls: [chainIdToNetworkNames[chain].rpcUrl],
                      blockExplorerUrls: [chainIdToNetworkNames[chain].blockExplorer],
                      nativeCurrency: {
                        name: chainIdToNetworkNames[chain].currency,
                        symbol: chainIdToNetworkNames[chain].currency, // 2-6 characters long
                        decimals: 18,
                      }
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
              }
            }
            // handle other "switch" errors
          }
    }

}


export default ethereum