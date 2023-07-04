# Upgradeable Proxy

- use the same storage layout in proxy and implementation contract because delegate call requires the same storage layout

- return data from fallback in proxy contract because fallback does not return data previously

- create library storage for implementation and admin address because implementation and admin address are removed in implementation contract

- forward all users to fallback function i.e. implementation contract because users cannot call functions in proxy contract. Also, forward admin to function in proxy contract. However, admin is unable to call functions in implementation contract.

- create proxy admin contract and owner of proxy contract is transfered from admin EOA to proxy admin contract. So admin or user is able to call the functions in implementation contract.



# Steps

- Deployment smart contracts
1. deploy contract CounterV1, CounterV2, NewProxy, ProxyAdmin
2. call NewProxy.upgradeTo with address of CounterV1 contract
3. call NewProxy.changeAdmin with address of ProxyAdmin contract
4. call ProxyAdmin.getProxyImplementation and it returns address of CounterV1 contract
5. call ProxyAdmin.getProxyAdmin and it returns address of ProxyAdmin contract
6. deploy address of NewProxy contract and interface of CounterV1 contract

- Update count by CounterV1
7. call count in interface of CounterV1 contract and it returns 0
8. call inc in interface of CounterV1 contract several times
9. call count in interface of CounterV1 contract and it returns 3

- Change implementation to CounterV2
10. call ProxyAdmin.upgrade with address of NewProxy contract and address of CounterV2 contract
11. call ProxyAdmin.getProxyImplementation and it returns address of CounterV2 contract
12. deploy address of NewProxy contract and interface of CounterV2 contract

- Update count by CounterV2
13. call count in interface of CounterV2 contract and it returns 3
14. call dec in interface of CounterV2 contract
15. call count in interface of CounterV2 contract and it returns 2




# Sepolia Testnet

CounterV1
0xe7add7932599357fb9b59d1606ce2c78146c9dbe

CounterV2
0x4DbD9050d5979680C79DAAe8a0e5609105a3380d

NewProxy
0xc671Bb572911bAFdFC822ECa4B255bEEA1fdB6a6

ProxyAdmin
0xC9cE2AF416Ea3fAA35D3fdEEaeDfA6096D215F47



# Types of Upgradeable Proxy

[Transparent proxy](https://github.com/stephenatgithub/upgrading-via-multisig)

[Universal Upgradeable Proxy Standard](https://github.com/stephenatgithub/upgrading-uups)

