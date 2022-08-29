export const mockAvailTokens = {
    "ETHEREUM": [
        {
            name: "ETH",
            image: "/assets/images/ethereum-logo.webp",
            address: null,
            native: false
        },
        {
            name: "USDT",
            image: "/assets/images/tether-logo.webp",
            address: "0xe802376580c10fE23F027e1E19Ed9D54d4C9311e",
            native: false
        },
        {
            name: "WETH",
            image: "/assets/images/ethereum-logo.webp",
            address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            native: false
        }
    ],
    "GNOSIS": [
        {
            name: "xDai",
            image: "/assets/images/gnosis-logo.webp",
            address: null,
            native: true
        },
        {
            name: "USDT",
            image: "/assets/images/tether-logo.webp",
            address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
            native: false
        },
    ]
}

export const tokenNameToAddress = {
    "ETHEREUM": {
        "ETH": {
            name: "ETH",
            image: "/assets/images/ethereum-logo.webp",
            native: true
        },
        "USDT": {
            name: "USDT",
            image: "/assets/images/tether-logo.webp",
            address: "0xe802376580c10fE23F027e1E19Ed9D54d4C9311e",
            native: false
        },
        "WETH": {
            name: "WETH",
            image: "/assets/images/ethereum-logo.webp",
            address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            native: false
        },
    },
    "GNOSIS": {
        "xDai": {
            name: "xDai",
            image: "/assets/images/gnosis-logo.webp",
            address: null,
            native: true
        },
        "USDT": {
            name: "USDT",
            image: "/assets/images/tether-logo.webp",
            address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
            native: false
        },
    }


}
