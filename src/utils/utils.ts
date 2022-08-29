const concatenatedAdd = (add) => {
    let start = add.slice(0, 4);
    let end = add.slice(add.length - 4, add.length);
    return `${start}...${end}`
}

const getGatewayUrl = (ipfs) => {
    let hash = ipfs.split("ipfs://").pop()
    return `https://ipfs.io/ipfs/${hash}`
}

const fromWei = (amount) => {
    let result;
    if (amount < 10 ** 9) {
        result = 0
    } else {
        result = amount / 10 ** 18
    }
    return result
}

const fromBigNumber = (bigNumber) => {
    return bigNumber.toString()
}

const truncateAddress = (input) => {
    if (input.length > 14) {
        return input.substring(0, 5) + '...' + input.substring(input.length - 4, input.length);
    }
    return input;
};

const rpcUrls = {
    xDaiChain: {
        url: "https://rpc.gnosischain.com/",
        chainId: 100
    },
    ethereum: {
        url: "https://mainnet.infura.io/v3/",
        chainId: 1
    },
    polygon: {
        url: "https://polygon-rpc.com/",
        chainId: 137
    }
}

const chainIdToNetworkNames = {
    100: {
        currency: "xDai",
        name: "GNOSIS",
        rpcUrl: "https://rpc.gnosischain.com/",
        blockExplorer: "https://blockscout.com/xdai/mainnet/"
    },
    // 1: {
    //     currency: "ETH", // Mainnet
    //     name: "ETHEREUM"
    // },
    5: {
        currency: "ETH", // Testnet
        name: "ETHEREUM",
        rpcUrl: "https://goerli.infura.io/v3/",
        blockExplorer: "https://goerli.etherscan.io"
    },
    // 137: {
    //     currency: "MATIC", // Mainnet
    //     name: "POLYGON"
    // },
    // 80001: {
    //     currency: "MATIC", // Testnet
    //     name: "POLYGON"
    // },
    // 56: {
    //     currency: "BNB", // Mainnet 
    //     name: "BINANCE"
    // },
    // 97: {
    //     currency: "BNB", // Testnet
    //     name: "BINANCE"
    // },


}
export {
    concatenatedAdd,
    getGatewayUrl,
    fromWei,
    rpcUrls,
    chainIdToNetworkNames,
    fromBigNumber,
    truncateAddress
}