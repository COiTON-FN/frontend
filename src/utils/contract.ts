import { type Abi as ABI } from "starknet";
import { variables } from "./variables";

export const contract = {
  daoAddress: variables.daoAddress as `0x${string}`,
  erc20Address: variables.erc20Address as `0x${string}`,
  erc721Address: variables.erc721Address as `0x${string}`,
  daoABI: [
    {
      "type": "impl",
      "name": "CoitonImpl",
      "interface_name": "coiton::mods::interfaces::icoiton::ICoiton"
    },
    {
      "type": "enum",
      "name": "coiton::mods::types::UserType",
      "variants": [
        { "name": "Individual", "type": "()" },
        { "name": "Entity", "type": "()" }
      ]
    },
    {
      "type": "struct",
      "name": "core::byte_array::ByteArray",
      "members": [
        {
          "name": "data",
          "type": "core::array::Array::<core::bytes_31::bytes31>"
        },
        { "name": "pending_word", "type": "core::felt252" },
        { "name": "pending_word_len", "type": "core::integer::u32" }
      ]
    },
    {
      "type": "struct",
      "name": "core::integer::u256",
      "members": [
        { "name": "low", "type": "core::integer::u128" },
        { "name": "high", "type": "core::integer::u128" }
      ]
    },
    {
      "type": "enum",
      "name": "core::bool",
      "variants": [
        { "name": "False", "type": "()" },
        { "name": "True", "type": "()" }
      ]
    },
    {
      "type": "struct",
      "name": "coiton::mods::types::User",
      "members": [
        { "name": "id", "type": "core::integer::u256" },
        { "name": "verified", "type": "core::bool" },
        { "name": "details", "type": "core::byte_array::ByteArray" },
        { "name": "user_type", "type": "coiton::mods::types::UserType" },
        {
          "name": "address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        { "name": "registered", "type": "core::bool" }
      ]
    },
    {
      "type": "enum",
      "name": "coiton::mods::types::ListingType",
      "variants": [
        { "name": "Land", "type": "()" },
        { "name": "Building", "type": "()" }
      ]
    },
    {
      "type": "enum",
      "name": "coiton::mods::types::ListingTag",
      "variants": [
        { "name": "Sold", "type": "()" },
        { "name": "ForSale", "type": "()" }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<coiton::mods::types::User>",
      "variants": [
        { "name": "Some", "type": "coiton::mods::types::User" },
        { "name": "None", "type": "()" }
      ]
    },
    {
      "type": "struct",
      "name": "coiton::mods::types::Listing",
      "members": [
        { "name": "id", "type": "core::integer::u256" },
        { "name": "details", "type": "core::byte_array::ByteArray" },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        { "name": "price", "type": "core::integer::u256" },
        { "name": "tag", "type": "coiton::mods::types::ListingTag" },
        {
          "name": "owner_details",
          "type": "core::option::Option::<coiton::mods::types::User>"
        },
        { "name": "listing_type", "type": "coiton::mods::types::ListingType" }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<core::integer::u256>",
      "variants": [
        { "name": "Some", "type": "core::integer::u256" },
        { "name": "None", "type": "()" }
      ]
    },
    {
      "type": "struct",
      "name": "coiton::mods::types::PurchaseRequest",
      "members": [
        { "name": "listing_id", "type": "core::integer::u256" },
        { "name": "request_id", "type": "core::integer::u256" },
        { "name": "price", "type": "core::integer::u256" },
        {
          "name": "initiator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "user",
          "type": "core::option::Option::<coiton::mods::types::User>"
        }
      ]
    },
    {
      "type": "interface",
      "name": "coiton::mods::interfaces::icoiton::ICoiton",
      "items": [
        {
          "type": "function",
          "name": "register",
          "inputs": [
            { "name": "user_type", "type": "coiton::mods::types::UserType" },
            { "name": "details", "type": "core::byte_array::ByteArray" }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "verify_user",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_user",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [{ "type": "coiton::mods::types::User" }],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "create_listing",
          "inputs": [
            {
              "name": "listing_type",
              "type": "coiton::mods::types::ListingType"
            },
            { "name": "price", "type": "core::integer::u256" },
            { "name": "details", "type": "core::byte_array::ByteArray" }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_all_listings",
          "inputs": [],
          "outputs": [
            { "type": "core::array::Array::<coiton::mods::types::Listing>" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_listings_by_ids",
          "inputs": [
            {
              "name": "ids",
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "outputs": [
            { "type": "core::array::Array::<coiton::mods::types::Listing>" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_listing",
          "inputs": [{ "name": "id", "type": "core::integer::u256" }],
          "outputs": [{ "type": "coiton::mods::types::Listing" }],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_user_listings",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            { "type": "core::array::Array::<coiton::mods::types::Listing>" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "create_purchase_request",
          "inputs": [
            { "name": "listing_id", "type": "core::integer::u256" },
            {
              "name": "bid_price",
              "type": "core::option::Option::<core::integer::u256>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "approve_purchase_request",
          "inputs": [
            { "name": "listing_id", "type": "core::integer::u256" },
            { "name": "request_id", "type": "core::integer::u256" }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_listings_with_purchase_requests",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            { "type": "core::array::Array::<coiton::mods::types::Listing>" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_listing_purchase_requests",
          "inputs": [{ "name": "id", "type": "core::integer::u256" }],
          "outputs": [
            {
              "type": "core::array::Array::<coiton::mods::types::PurchaseRequest>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_owner",
          "inputs": [],
          "outputs": [
            { "type": "core::starknet::contract_address::ContractAddress" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_purchase",
          "inputs": [
            { "name": "listing_id", "type": "core::integer::u256" },
            { "name": "request_id", "type": "core::integer::u256" }
          ],
          "outputs": [{ "type": "coiton::mods::types::PurchaseRequest" }],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_wallet_balance",
          "inputs": [],
          "outputs": [{ "type": "core::integer::u256" }],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "set_erc721",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "set_erc20",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_erc20",
          "inputs": [],
          "outputs": [
            { "type": "core::starknet::contract_address::ContractAddress" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_erc721",
          "inputs": [],
          "outputs": [
            { "type": "core::starknet::contract_address::ContractAddress" }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "upgrade",
          "inputs": [
            {
              "name": "impl_hash",
              "type": "core::starknet::class_hash::ClassHash"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "version",
          "inputs": [],
          "outputs": [{ "type": "core::integer::u16" }],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "withdraw",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "type": "constructor",
      "name": "constructor",
      "inputs": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "event",
      "name": "coiton::mods::events::Upgrade",
      "kind": "struct",
      "members": [
        {
          "name": "implementation",
          "type": "core::starknet::class_hash::ClassHash",
          "kind": "key"
        }
      ]
    },
    {
      "type": "enum",
      "name": "coiton::mods::events::UserEventType",
      "variants": [
        { "name": "Register", "type": "()" },
        { "name": "Verify", "type": "()" }
      ]
    },
    {
      "type": "event",
      "name": "coiton::mods::events::User",
      "kind": "struct",
      "members": [
        { "name": "id", "type": "core::integer::u256", "kind": "key" },
        {
          "name": "address",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "event_type",
          "type": "coiton::mods::events::UserEventType",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "coiton::mods::events::CreateListing",
      "kind": "struct",
      "members": [
        { "name": "id", "type": "core::integer::u256", "kind": "key" },
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        { "name": "price", "type": "core::integer::u256", "kind": "key" }
      ]
    },
    {
      "type": "enum",
      "name": "coiton::mods::events::PurchaseRequestType",
      "variants": [
        { "name": "Create", "type": "()" },
        { "name": "Approve", "type": "()" }
      ]
    },
    {
      "type": "event",
      "name": "coiton::mods::events::PurchaseRequest",
      "kind": "struct",
      "members": [
        { "name": "listing_id", "type": "core::integer::u256", "kind": "key" },
        { "name": "request_id", "type": "core::integer::u256", "kind": "key" },
        {
          "name": "bid_price",
          "type": "core::option::Option::<core::integer::u256>",
          "kind": "data"
        },
        {
          "name": "initiator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "request_type",
          "type": "coiton::mods::events::PurchaseRequestType",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "coiton::Coiton::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Upgrade",
          "type": "coiton::mods::events::Upgrade",
          "kind": "nested"
        },
        {
          "name": "User",
          "type": "coiton::mods::events::User",
          "kind": "nested"
        },
        {
          "name": "CreateListing",
          "type": "coiton::mods::events::CreateListing",
          "kind": "nested"
        },
        {
          "name": "PurchaseRequest",
          "type": "coiton::mods::events::PurchaseRequest",
          "kind": "nested"
        }
      ]
    }
  ] as const satisfies ABI,
  erc20ABI: [
    {
      type: "impl",
      name: "UpgradeableImpl",
      interface_name: "openzeppelin_upgrades::interface::IUpgradeable",
    },
    {
      type: "interface",
      name: "openzeppelin_upgrades::interface::IUpgradeable",
      items: [
        {
          type: "function",
          name: "upgrade",
          inputs: [
            {
              name: "new_class_hash",
              type: "core::starknet::class_hash::ClassHash",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
      ],
    },
    {
      type: "struct",
      name: "core::integer::u256",
      members: [
        {
          name: "low",
          type: "core::integer::u128",
        },
        {
          name: "high",
          type: "core::integer::u128",
        },
      ],
    },
    {
      type: "function",
      name: "burn",
      inputs: [
        {
          name: "value",
          type: "core::integer::u256",
        },
      ],
      outputs: [],
      state_mutability: "external",
    },
    {
      type: "function",
      name: "mint",
      inputs: [
        {
          name: "recipient",
          type: "core::starknet::contract_address::ContractAddress",
        },
        {
          name: "amount",
          type: "core::integer::u256",
        },
      ],
      outputs: [],
      state_mutability: "external",
    },
    {
      type: "impl",
      name: "ERC20MixinImpl",
      interface_name: "openzeppelin_token::erc20::interface::ERC20ABI",
    },
    {
      type: "enum",
      name: "core::bool",
      variants: [
        {
          name: "False",
          type: "()",
        },
        {
          name: "True",
          type: "()",
        },
      ],
    },
    {
      type: "struct",
      name: "core::byte_array::ByteArray",
      members: [
        {
          name: "data",
          type: "core::array::Array::<core::bytes_31::bytes31>",
        },
        {
          name: "pending_word",
          type: "core::felt252",
        },
        {
          name: "pending_word_len",
          type: "core::integer::u32",
        },
      ],
    },
    {
      type: "interface",
      name: "openzeppelin_token::erc20::interface::ERC20ABI",
      items: [
        {
          type: "function",
          name: "total_supply",
          inputs: [],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "balance_of",
          inputs: [
            {
              name: "account",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "allowance",
          inputs: [
            {
              name: "owner",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "spender",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "transfer",
          inputs: [
            {
              name: "recipient",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "transfer_from",
          inputs: [
            {
              name: "sender",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "recipient",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "approve",
          inputs: [
            {
              name: "spender",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "name",
          inputs: [],
          outputs: [
            {
              type: "core::byte_array::ByteArray",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "symbol",
          inputs: [],
          outputs: [
            {
              type: "core::byte_array::ByteArray",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "decimals",
          inputs: [],
          outputs: [
            {
              type: "core::integer::u8",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "totalSupply",
          inputs: [],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "balanceOf",
          inputs: [
            {
              name: "account",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "transferFrom",
          inputs: [
            {
              name: "sender",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "recipient",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "external",
        },
      ],
    },
    {
      type: "impl",
      name: "OwnableMixinImpl",
      interface_name: "openzeppelin_access::ownable::interface::OwnableABI",
    },
    {
      type: "interface",
      name: "openzeppelin_access::ownable::interface::OwnableABI",
      items: [
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "transfer_ownership",
          inputs: [
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "renounce_ownership",
          inputs: [],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "transferOwnership",
          inputs: [
            {
              name: "newOwner",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "renounceOwnership",
          inputs: [],
          outputs: [],
          state_mutability: "external",
        },
      ],
    },
    {
      type: "constructor",
      name: "constructor",
      inputs: [
        {
          name: "owner",
          type: "core::starknet::contract_address::ContractAddress",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
      kind: "struct",
      members: [
        {
          name: "from",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "to",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "value",
          type: "core::integer::u256",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
      kind: "struct",
      members: [
        {
          name: "owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "spender",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "value",
          type: "core::integer::u256",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_token::erc20::erc20::ERC20Component::Event",
      kind: "enum",
      variants: [
        {
          name: "Transfer",
          type: "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
          kind: "nested",
        },
        {
          name: "Approval",
          type: "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
          kind: "nested",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
      kind: "struct",
      members: [
        {
          name: "previous_owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "new_owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
      kind: "struct",
      members: [
        {
          name: "previous_owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "new_owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
      kind: "enum",
      variants: [
        {
          name: "OwnershipTransferred",
          type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
          kind: "nested",
        },
        {
          name: "OwnershipTransferStarted",
          type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
          kind: "nested",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
      kind: "struct",
      members: [
        {
          name: "class_hash",
          type: "core::starknet::class_hash::ClassHash",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
      kind: "enum",
      variants: [
        {
          name: "Upgraded",
          type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
          kind: "nested",
        },
      ],
    },
    {
      type: "event",
      name: "cairo::erc20::erc20::Event",
      kind: "enum",
      variants: [
        {
          name: "ERC20Event",
          type: "openzeppelin_token::erc20::erc20::ERC20Component::Event",
          kind: "flat",
        },
        {
          name: "OwnableEvent",
          type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
          kind: "flat",
        },
        {
          name: "UpgradeableEvent",
          type: "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
          kind: "flat",
        },
      ],
    },
  ] as const satisfies ABI,
  erc721ABI: [
    {
      "type": "impl",
      "name": "MyTokenImpl",
      "interface_name": "coiton::mods::interfaces::ierc721::IERC721"
    },
    {
      "type": "struct",
      "name": "core::integer::u256",
      "members": [
        {
          "name": "low",
          "type": "core::integer::u128"
        },
        {
          "name": "high",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "type": "interface",
      "name": "coiton::mods::interfaces::ierc721::IERC721",
      "items": [
        {
          "type": "function",
          "name": "mint_coiton_nft",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_last_minted_id",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_user_token_id",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_token_mint_timestamp",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u64"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_approved",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transfer_from",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "type": "constructor",
      "name": "constructor",
      "inputs": [
        {
          "name": "admin",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
      "kind": "struct",
      "members": [
        {
          "name": "from",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "to",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
      "kind": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "approved",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::bool",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
      "kind": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "approved",
          "type": "core::bool",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Transfer",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
          "kind": "nested"
        },
        {
          "name": "Approval",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
          "kind": "nested"
        },
        {
          "name": "ApprovalForAll",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_introspection::src5::SRC5Component::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "coiton::mods::tokens::erc721::MyToken::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "ERC721Event",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
          "kind": "flat"
        },
        {
          "name": "SRC5Event",
          "type": "openzeppelin_introspection::src5::SRC5Component::Event",
          "kind": "flat"
        }
      ]
    }
  ] as const satisfies ABI,
};
