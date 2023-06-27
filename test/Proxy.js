const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { assert } = require("chai");

describe("Proxy", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    // storage = proxy, logic = Logic1
    const proxyAsLogic1 = await ethers.getContractAt("Logic1", proxy.address);

    // storage = proxy, logic = Logic2
    const proxyAsLogic2 = await ethers.getContractAt("Logic2", proxy.address);

    return { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2 };
  }
  
  async function lookup(a, m) {
    return parseInt(await ethers.provider.getStorageAt(a, m));
  }

  it("Should work with logic1", async function () {
    const { proxy, proxyAsLogic1, logic1 } = await loadFixture(deployFixture);

    await proxy.changeImp(logic1.address);

    // before change, x = 0
    assert.equal(await lookup(logic1.address, "0x0"), 0);

    await proxyAsLogic1.changeX(52);

    // after change, x = 52
    assert.equal(await lookup(logic1.address, "0x0"), 52);
  });
    

  it("Should work with version upgrade", async function () {
    const { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2 } = await loadFixture(deployFixture);

    await proxy.changeImp(logic1.address);

    // before change, x = 0
    assert.equal(await lookup(logic1.address, "0x0"), 0);

    await proxyAsLogic1.changeX(56);

    // after change, x = 56
    assert.equal(await lookup(logic1.address, "0x0"), 56);

    await proxy.changeImp(logic2.address);

    // before change, x = 0
    assert.equal(await lookup(logic2.address, "0x0"), 0);

    await proxyAsLogic2.changeX(1);

    // after change, x = 2
    assert.equal(await lookup(logic2.address, "0x0"), 2);

    await proxyAsLogic2.tripleX();

    // after change, x = 6
    assert.equal(await lookup(logic2.address, "0x0"), 6);

  });

});
