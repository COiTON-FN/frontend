import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import {
    StarknetConfig,
    jsonRpcProvider,
    starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { FeeSource } from "@cartridge/controller"
import { contract } from "@/utils/contract";


// Define session policies
const policies = {
    contracts: {
        [contract.daoAddress]: {
            methods: [
                {
                    name: "Create Listing",
                    entrypoint: "create_listing",
                    // description: "Approve spending of ",
                },
                { name: "Create Purchase Request", entrypoint: "create_purchase_request" },
                { name: "Register", entrypoint: "register" },
                { name: "Approve Purchase Request", entrypoint: "approve_purchase_request" },

            ],
        },
        [contract.erc20Address]: {
            methods: [
                {
                    name: "Approve", entrypoint: "approve",
                    description: "Approve spending of tokens",
                },
            ]
        },
        [contract.erc721Address]: {
            methods: [
                {
                    name: "Approve", entrypoint: "approve",
                    description: "Approve transfer of tokens",
                },
            ]
        }
    },
}

// Initialize the connector
const connector = new ControllerConnector({
    policies,
    feeSource: FeeSource.PAYMASTER,
    // signupOptions: ["Argent"]
    // rpc: 'https://api.cartridge.gg/x/starknet/sepolia',

})

// Configure RPC provider
const provider = jsonRpcProvider({
    rpc: (chain: Chain) => {

        switch (chain) {
            case mainnet:
                return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' }
            case sepolia:
            default:
                return { nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia' }
        }
    },
})

export function StarknetProvider({ children }: { children: React.ReactNode }) {
    return (
        <StarknetConfig
            autoConnect
            chains={[mainnet, sepolia]}
            provider={provider}
            connectors={[connector]}
            explorer={starkscan}

        >
            {children}
        </StarknetConfig>
    )
}