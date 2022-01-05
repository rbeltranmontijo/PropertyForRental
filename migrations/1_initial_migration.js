const Migrations = artifacts.require("Migrations");
const PropertyRental = artifacts.require("PropertyRental");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(PropertyRental);
};
