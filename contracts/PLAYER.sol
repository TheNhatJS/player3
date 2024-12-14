// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PlayerManager {
    struct Player {
        string name;
        uint256 strength;
    }

    mapping(uint256 => Player) public players;

    uint256[] public playerIDs;

    modifier onlyAdmin() {
        require(msg.sender == owner, "Only admin can perform this action");
        _;
    }

    address public owner;
    uint256 public nextPlayerID;

    constructor() {
        owner = msg.sender;
        nextPlayerID = 1;
    }

    function addPlayer(string memory name, uint256 strength) public onlyAdmin {
        uint256 playerID = nextPlayerID;
        nextPlayerID++;
        players[playerID] = Player(name, strength);
        playerIDs.push(playerID);
    }

    function updatePlayer(
        uint256 playerID,
        string memory name,
        uint256 strength
    ) public onlyAdmin {
        require(players[playerID].strength != 0, "Player does not exist");
        players[playerID] = Player(name, strength);
    }

    function getAllPlayers()
        public
        view
        returns (uint256[] memory, string[] memory, uint256[] memory)
    {
        uint256 length = playerIDs.length;
        string[] memory names = new string[](length);
        uint256[] memory strengths = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 playerID = playerIDs[i];
            names[i] = players[playerID].name;
            strengths[i] = players[playerID].strength;
        }

        return (playerIDs, names, strengths);
    }
}
