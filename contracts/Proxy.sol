// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Proxy {
    address imp;

    function changeImp(address _imp) external {
        imp = _imp;
    }

    // cannot call new function tripleX
    // function changeX(uint _x) external {
    //     Logic1(imp).changeX(_x);
    // }

    // generic function
    fallback() external {
        (bool s,) = imp.call(msg.data);
        require(s);
    }
}


contract Logic1 {
    uint x = 0;

    function changeX(uint _x) external {
        x = _x;
    }
}


contract Logic2 {
    uint x = 0;

    function changeX(uint _x) external {
        x = _x * 2;
    }

    function tripleX() external {
        x = x * 3;
    }
}
