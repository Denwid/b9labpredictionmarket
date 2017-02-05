pragma solidity ^0.4.2;

contract Owned {
    function Owned() { owner = msg.sender; }
    function getOwner() returns (address) { return owner; }
    address owner;
}