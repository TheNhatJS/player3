// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployMudule = buildModule("TokenModule", (m) => {
  const PlayerManager = m.contract("PlayerManager");
  return PlayerManager;
});

module.exports = DeployMudule;