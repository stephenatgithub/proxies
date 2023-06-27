const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { assert } = require("chai");
  
  describe("UpgradeableProxy", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default     
        const [owner, otherAccount] = await ethers.getSigners();

        const NewProxy = await ethers.getContractFactory("NewProxy");
        const newProxy = await NewProxy.deploy();

        const CounterV1 = await ethers.getContractFactory("CounterV1");
        const counterV1 = await CounterV1.deploy();  

        const CounterV2 = await ethers.getContractFactory("CounterV2");
        const counterV2 = await CounterV2.deploy();  

        // storage = NewProxy, logic = CounterV1
        const proxyAsCounterV1 = await ethers.getContractAt("CounterV1", newProxy.address);  

        // storage = NewProxy, logic = CounterV2
        const proxyAsCounterV2 = await ethers.getContractAt("CounterV2", newProxy.address);

        return { newProxy, counterV1, counterV2, proxyAsCounterV1, proxyAsCounterV2, owner, otherAccount };
    }    
  
    it("Should work with counterV1", async function () {
        const { newProxy, counterV1, proxyAsCounterV1, owner } = await loadFixture(deployFixture);
        await newProxy.upgradeTo(counterV1.address);
        assert.equal(owner.address, await proxyAsCounterV1.admin());

        await proxyAsCounterV1.inc();
        await proxyAsCounterV1.inc();
        assert.equal(await proxyAsCounterV1.count(), 2);
    });      

    it("Should work with counterV2", async function () {
        const { newProxy, counterV1, counterV2, proxyAsCounterV1, proxyAsCounterV2, owner, otherAccount } = await loadFixture(deployFixture);

        await newProxy.upgradeTo(counterV1.address);
        assert.equal(owner.address, await proxyAsCounterV1.admin());

        await proxyAsCounterV1.inc();
        await proxyAsCounterV1.inc();
        assert.equal(await proxyAsCounterV1.count(), 2);
        
        await newProxy.upgradeTo(counterV2.address);
        assert.equal(owner.address, await proxyAsCounterV2.admin());

        await proxyAsCounterV2.dec();
        assert.equal(await proxyAsCounterV2.count(), 1);
        
      });      

    it("Should work with admin", async function () {
        const { newProxy, counterV1, proxyAsCounterV1, owner, otherAccount } = await loadFixture(deployFixture);
        await newProxy.upgradeTo(counterV1.address);

        assert.equal(owner.address, await proxyAsCounterV1.connect(owner).admin());

        assert.equal(0, await proxyAsCounterV1.connect(otherAccount).admin());
    }); 
  
});
