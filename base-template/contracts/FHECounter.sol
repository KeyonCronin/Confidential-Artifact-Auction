// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title A simple FHE counter contract
/// @notice A basic example contract showing how to work with encrypted data using FHEVM
/// @dev Demonstrates encrypted arithmetic operations and permission management
contract FHECounter is ZamaEthereumConfig {
    euint32 private _count;

    /// @notice Returns the current encrypted count
    /// @return The current encrypted count value
    function getCount() external view returns (euint32) {
        return _count;
    }

    /// @notice Increments the counter by a specified encrypted value
    /// @param inputEuint32 The encrypted input value
    /// @param inputProof The input proof for verification
    /// @dev This example omits overflow checks for simplicity
    /// In production, implement proper range checks
    function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedEuint32 = FHE.fromExternal(inputEuint32, inputProof);

        _count = FHE.add(_count, encryptedEuint32);

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }

    /// @notice Decrements the counter by a specified encrypted value
    /// @param inputEuint32 The encrypted input value
    /// @param inputProof The input proof for verification
    /// @dev This example omits underflow checks for simplicity
    /// In production, implement proper range checks
    function decrement(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedEuint32 = FHE.fromExternal(inputEuint32, inputProof);

        _count = FHE.sub(_count, encryptedEuint32);

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }
}
