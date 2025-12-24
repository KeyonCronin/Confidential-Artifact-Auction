import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", function () {
  let counter: any;
  let owner: any;

  beforeEach(async function () {
    const [ownerAccount] = await ethers.getSigners();
    owner = ownerAccount;

    const CounterFactory = await ethers.getContractFactory("Counter");
    counter = await CounterFactory.deploy();
    await counter.waitForDeployment();
  });

  describe("Basic Operations", function () {
    /**
     * Test: Verify initial counter value
     * Expected: Counter starts at 0
     */
    it("should have initial count of 0", async function () {
      const count = await counter.getCount();
      expect(count).to.equal(0);
    });

    /**
     * Test: Increment counter
     * Expected: Count increases by specified amount
     */
    it("should increment counter", async function () {
      await counter.increment(5);
      const count = await counter.getCount();
      expect(count).to.equal(5);
    });

    /**
     * Test: Decrement counter
     * Expected: Count decreases by specified amount
     */
    it("should decrement counter", async function () {
      await counter.increment(10);
      await counter.decrement(3);
      const count = await counter.getCount();
      expect(count).to.equal(7);
    });

    /**
     * Test: Prevent underflow
     * Expected: Transaction reverts when decrementing below 0
     */
    it("should prevent decrement below zero", async function () {
      await counter.increment(5);
      await expect(
        counter.decrement(10)
      ).to.be.revertedWith("Counter: cannot decrement below zero");
    });

    /**
     * Test: Multiple increments
     * Expected: Each increment adds to the total
     */
    it("should handle multiple increments", async function () {
      await counter.increment(5);
      await counter.increment(3);
      await counter.increment(2);
      const count = await counter.getCount();
      expect(count).to.equal(10);
    });
  });
});
