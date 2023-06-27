# Upgradeable Proxy


- use the same storage layout in proxy and implementation contract

- return data from fallback in proxy contract

- create library storage for implementation and admin address 

- forward all users to fallback function i.e. implementation contract and 
forward admin to function in proxy contract

- create proxy admin contract



# Steps

Deployment smart contracts
1. deploy contract CounterV1, CounterV2, NewProxy, ProxyAdmin
2. call NewProxy.upgradeTo with address of CounterV1 contract
3. call NewProxy.changeAdmin with address of ProxyAdmin contract
4. call ProxyAdmin.getProxyImplementation and it returns address of CounterV1 contract
5. call ProxyAdmin.getProxyAdmin and it returns address of ProxyAdmin contract
6. deploy address of NewProxy contract and interface of CounterV1 contract

Update count by CounterV1
7. call count in interface of CounterV1 contract and it returns 0
8. call inc in interface of CounterV1 contract several times
9. call count in interface of CounterV1 contract and it returns 3

Change implementation to CounterV2
10. call ProxyAdmin.upgrade with address of NewProxy contract and address of CounterV2 contract
11. call ProxyAdmin.getProxyImplementation and it returns address of CounterV2 contract
12. deploy address of NewProxy contract and interface of CounterV2 contract

Update count by CounterV2
13. call count in interface of CounterV2 contract and it returns 3
14. call dec in interface of CounterV2 contract
15. call count in interface of CounterV2 contract and it returns 2