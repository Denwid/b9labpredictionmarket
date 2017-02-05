pragma solidity ^0.4.2;

contract Owned {
    function Owned() { owner = msg.sender; }
    function getOwner() returns (address) { return owner; }
    modifier onlyowner() { if (msg.sender == owner) _; }
    address owner;
}