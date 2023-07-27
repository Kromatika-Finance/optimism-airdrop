// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleDistributor is Ownable {
    bytes32 public merkleRoot;
    address public tokenAddress;
    uint256 public constant MIN_CLAIM = 10;
    uint256 public constant MAX_CLAIM = 1000;
    uint256 public endTime;
    mapping(address => bool) public hasClaimed;

    constructor(bytes32 merkleRoot_, address tokenAddress_) {
        merkleRoot = merkleRoot_;
        tokenAddress = tokenAddress_;
    }

    /// @notice Emitted after a successful claim
    /// @param recipient recipient of claim
    /// @param amount of tokens claimed
    event Claim(address indexed recipient, uint256 amount);

    /// @notice Emitted after a successful sweep
    /// @param amount of tokens swept
    event Sweep(uint256 amount);

    /// @notice Allows claiming tokens if address is part of merkle tree
    /// @param to address of claimee
    /// @param amount of tokens owed to claimee
    /// @param merkleProof merkle proof to prove address and amount are in tree
    function claim(
        address to,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external {
        require(to == msg.sender, "CLAIMEE != msg.sender");
        // Revert if address has already claimed tokens
        require(!hasClaimed[to], "ALREADY_CLAIMED");

        require(amount <= MAX_CLAIM, "ABOVE_THRESHOLD");
        require(amount >= MIN_CLAIM, "BELOW_THRESHOLD");

        bytes32 node = keccak256(abi.encodePacked(to, amount));

        // Verify merkle proof
        require(
            MerkleProof.verify(merkleProof, merkleRoot, node),
            "MerkleDistributor: invalid proof!"
        );
        require(block.timestamp <= endTime, "Claim ended");

        // Set address to claimed
        hasClaimed[to] = true;

        // Claim tokens
        IERC20(tokenAddress).transfer(to, amount * 1e18);

        emit Claim(to, amount * 1e18);
    }

    /// @notice Sweep any unclaimed funds once the claiming period is over
    /// @param amount of tokens
    function sweep(uint256 amount) external onlyOwner {
        require(block.timestamp >= endTime, "MerkleDistributor: not ended");
        require(
            IERC20(tokenAddress).transfer(msg.sender, amount * 1e18),
            "MerkleDistributor: fail sweep"
        );

        emit Sweep(amount * 1e18);
    }

    /// @notice Set endTime of the claiming period
    /// @param _endTime of the claiming period
    function setEndTime(uint256 _endTime) external onlyOwner {
        require(block.timestamp >= endTime, "MerkleDistributor: not ended");
        endTime = block.timestamp + _endTime;
    }
}
