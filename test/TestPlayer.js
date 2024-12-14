const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlayerManager", function () {
    let PlayerManager;
    let playerManager;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Triển khai contract
        PlayerManager = await ethers.getContractFactory("PlayerManager");
        [owner, addr1, addr2] = await ethers.getSigners();
        playerManager = await PlayerManager.deploy(); // Triển khai contract
    });


    it("Should allow admin to add a new player", async function () {
        await playerManager.addPlayer("Alice", 100);
        const player = await playerManager.players(1);

        expect(player.name).to.equal("Alice");
        expect(player.strength).to.equal(100);

        const playerID = await playerManager.playerIDs(0);
        expect(playerID).to.equal(1);

    });

    it("Should automatically increment player ID when adding players", async function () {
        await playerManager.addPlayer("Alice", 100);
        await playerManager.addPlayer("Bob", 200);

        const player1 = await playerManager.players(1);
        const player2 = await playerManager.players(2);

        expect(player1.name).to.equal("Alice");
        expect(player2.name).to.equal("Bob");

        const firstPlayerID = await playerManager.playerIDs(0);
        const secondPlayerID = await playerManager.playerIDs(1);

        expect(firstPlayerID).to.equal(1);
        expect(secondPlayerID).to.equal(2);

    });

    it("Should allow admin to update a player's information", async function () {
        await playerManager.addPlayer("Alice", 100);
        await playerManager.updatePlayer(1, "AliceUpdated", 150);

        const player = await playerManager.players(1);
        expect(player.name).to.equal("AliceUpdated");
        expect(player.strength).to.equal(150);
    });

    it("Should revert when updating a non-existent player", async function () {
        await expect(playerManager.updatePlayer(1, "NonExistent", 200)).to.be.revertedWith("Player does not exist");
    });

    it("Should only allow admin to add or update players", async function () {
        await expect(playerManager.connect(addr1).addPlayer("Malicious", 300)).to.be.revertedWith("Only admin can perform this action");

        await playerManager.addPlayer("Alice", 100);
        await expect(playerManager.connect(addr1).updatePlayer(1, "Hacker", 300)).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should return all players correctly", async function () {
        await playerManager.addPlayer("Alice", 100);
        await playerManager.addPlayer("Bob", 200);

        const [ids, names, strengths] = await playerManager.getAllPlayers();

        expect(ids.length).to.equal(2);
        expect(names.length).to.equal(2);
        expect(strengths.length).to.equal(2);

        expect(ids[0]).to.equal(1);
        expect(names[0]).to.equal("Alice");
        expect(strengths[0]).to.equal(100);

        expect(ids[1]).to.equal(2);
        expect(names[1]).to.equal("Bob");
        expect(strengths[1]).to.equal(200);
    });
});
