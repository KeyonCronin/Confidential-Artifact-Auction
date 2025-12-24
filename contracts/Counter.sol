// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title A simple counter contract
/// @notice Basic counter for comparison with FHE version
/// @dev Demonstrates standard non-encrypted counter operations
contract Counter {
    uint32 private _count;

    /// @notice Returns the current count
    /// @return The current count value
    function getCount() external view returns (uint32) {
        return _count;
    }

    /// @notice Increments the counter by a specific value
    /// @param value The amount to increment
    function increment(uint32 value) external {
        _count += value;
    }

    /// @notice Decrements the counter by a specific value
    /// @param value The amount to decrement
    function decrement(uint32 value) external {
        require(_count >= value, "Counter: cannot decrement below zero");
        _count -= value;
    }
}
