pragma solidity ^0.4.2;

contract Owned {
    function Owned() { owner = msg.sender; }
    address owner;
}