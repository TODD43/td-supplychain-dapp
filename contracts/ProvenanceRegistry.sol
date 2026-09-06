// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TD SupplyChain Provenance Registry
/// @notice Demo registry for recording product lifecycle events on-chain.
/// @dev Educational/testnet demo. Do not store sensitive personal data on-chain.
contract ProvenanceRegistry {
    struct Product {
        string productId;
        string name;
        string origin;
        uint256 createdAt;
        bool exists;
    }

    struct EventRecord {
        string status;
        string location;
        string noteHash;
        uint256 timestamp;
        address recordedBy;
    }

    mapping(bytes32 => Product) public products;
    mapping(bytes32 => EventRecord[]) private history;
    mapping(address => bool) public operators;

    address public owner;

    event OperatorUpdated(address indexed operator, bool allowed);
    event ProductRegistered(bytes32 indexed productKey, string productId, string name, string origin);
    event ProductEventRecorded(bytes32 indexed productKey, string status, string location, string noteHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOperator() {
        require(operators[msg.sender] || msg.sender == owner, "Not operator");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setOperator(address operator, bool allowed) external onlyOwner {
        require(operator != address(0), "Zero address");
        operators[operator] = allowed;
        emit OperatorUpdated(operator, allowed);
    }

    function registerProduct(
        string calldata productId,
        string calldata name,
        string calldata origin
    ) external onlyOperator returns (bytes32 productKey) {
        require(bytes(productId).length > 0, "Product ID required");

        productKey = keccak256(abi.encodePacked(productId));
        require(!products[productKey].exists, "Product exists");

        products[productKey] = Product({
            productId: productId,
            name: name,
            origin: origin,
            createdAt: block.timestamp,
            exists: true
        });

        emit ProductRegistered(productKey, productId, name, origin);
    }

    function recordEvent(
        string calldata productId,
        string calldata status,
        string calldata location,
        string calldata noteHash
    ) external onlyOperator {
        bytes32 productKey = keccak256(abi.encodePacked(productId));
        require(products[productKey].exists, "Unknown product");
        require(bytes(status).length > 0, "Status required");

        history[productKey].push(EventRecord({
            status: status,
            location: location,
            noteHash: noteHash,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        }));

        emit ProductEventRecorded(productKey, status, location, noteHash);
    }

    function getHistoryLength(string calldata productId) external view returns (uint256) {
        bytes32 productKey = keccak256(abi.encodePacked(productId));
        return history[productKey].length;
    }

    function getHistoryItem(string calldata productId, uint256 index)
        external
        view
        returns (EventRecord memory)
    {
        bytes32 productKey = keccak256(abi.encodePacked(productId));
        require(index < history[productKey].length, "Index out of range");
        return history[productKey][index];
    }
}
