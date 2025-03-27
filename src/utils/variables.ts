export const variables = {
  rpcUrl: import.meta.env.VITE_STRK_RPC,
  starknetTokenAddress: import.meta.env.VITE_STARKNET_TOKEN_ADDRESS,
  daoAddress: import.meta.env.VITE_DEPLOYED_ADDRESS,
  erc20Address: import.meta.env.VITE_ERC20_ADDRESS,
  erc721Address: import.meta.env.VITE_ERC721_ADDRESS,

  gateway: import.meta.env.VITE_PINATA_GATEWAY,
  renderEndpoint: import.meta.env.VITE_RENDER_ENDPOINT,
  paystackPubKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
};
