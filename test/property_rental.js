const PropertyRental = artifacts.require("PropertyRental");

let instance;

beforeEach(async () => {
  instance = await PropertyRental.new();
});

contract("PropertyRental", function(accounts) {
  it("should print list of accounts", async function() {
    console.log(accounts);
  });
  it("should add property to list", async function() {
    await instance.submitPropertyToList(
      "veracruz 55",
      "cdmx",
      "mexico",
      "9000",
      { from: accounts[0] }
    );
    let propertyList = await instance.myProperties();

    assert(propertyList.length == 1);
  });
  it("should generate contract lease", async function() {
    await instance.submitPropertyToList(
      "veracruz 55",
      "cdmx",
      "mexico",
      "9000",
      { from: accounts[0] }
    );
    let propertyList = await instance.myProperties();

    await instance.applyForRentalProperty(propertyList[0].id, "Robin", 3000, {
      from: accounts[1],
    });
    await instance.applyForRentalProperty(propertyList[0].id, "Jaime", 3000, {
      from: accounts[2],
    });
    await instance.applyForRentalProperty(propertyList[0].id, "Beltran", 3000, {
      from: accounts[3],
    });

    let appliesList = await instance.obtainApliesForMyProperty(
      propertyList[0].id,
      {
        from: accounts[0],
      }
    );
    // console.log(appliesList);

    await instance.approveApplicantForMyProperty(
      propertyList[0].id,
      accounts[1]
    );
    appliesList = await instance.obtainApliesForMyProperty(propertyList[0].id, {
      from: accounts[0],
    });
    // console.log("PRIMER APROVADO", appliesList);
    await instance.approveApplicantForMyProperty(
      propertyList[0].id,
      accounts[2]
    );
    appliesList = await instance.obtainApliesForMyProperty(propertyList[0].id, {
      from: accounts[0],
    });
    // console.log("SEGUNDO APROVADO", appliesList);
    await instance.approveApplicantForMyProperty(
      propertyList[0].id,
      accounts[3]
    );

    appliesList = await instance.obtainApliesForMyProperty(propertyList[0].id, {
      from: accounts[0],
    });
    // console.log("TERCER APROVADO DEBE SER VACIO", appliesList);

    let myContract = await instance.returnMyLeasingContract(
      propertyList[0].id,
      {
        from: accounts[0],
      }
    );
    // console.log("My Leasing contract address: ", myContract[0]);
    // console.log(
    //   "My Leasing contract numConfirmations: ",
    //   myContract[1].toNumber()
    // );
    // console.log("My Leasing contract wantToleave: ", myContract[2]);
    // console.log(
    //   "My Leasing contract lesasingWantLeave: ",
    //   myContract[3].toNumber()
    // );
    assert(myContract[1].toNumber() == 4); // Numero de confirmaciones necesarias
  });
  it("should cancel contract lease", async function() {
    await instance.submitPropertyToList(
      "veracruz 55",
      "cdmx",
      "mexico",
      "9000",
      {
        from: accounts[0],
      }
    );
    let propertyList = await instance.myProperties();

    await instance.applyForRentalProperty(propertyList[0].id, "Robin", 3000, {
      from: accounts[1],
    });
    await instance.applyForRentalProperty(propertyList[0].id, "Jaime", 3000, {
      from: accounts[2],
    });
    await instance.applyForRentalProperty(propertyList[0].id, "Beltran", 3000, {
      from: accounts[3],
    });

    await instance.approveApplicantForMyProperty(
      propertyList[0].id,
      accounts[1]
    );

    await instance.approveApplicantForMyProperty(
      propertyList[0].id,
      accounts[2]
    );

    await instance.approveApplicantForMyProperty(
      propertyList[0].id,
      accounts[3]
    );
    // let propertyRentedList = await instance.returnsPropertyRented(
    //   propertyList[0].id,
    //   {
    //     from: accounts[0],
    //   }
    // );
    // console.log(propertyRentedList);

    await instance.submitDeleteLeasingContracts(propertyList[0].id, {
      from: accounts[0],
    });
    await instance.submitDeleteLeasingContracts(propertyList[0].id, {
      from: accounts[1],
    });
    await instance.submitDeleteLeasingContracts(propertyList[0].id, {
      from: accounts[2],
    });
    await instance.submitDeleteLeasingContracts(propertyList[0].id, {
      from: accounts[3],
    });

    let propertyRentedList = await instance.returnsPropertyRented();
    // console.log("SEGUNDA: ", propertyRentedList);

    await instance.deleteLeasingContract(propertyList[0].id, {
      from: accounts[0],
    });
    propertyRentedList = await instance.returnsPropertyRented();
    // console.log("TERCERA: ", propertyRentedList[0].propertyId);
    assert(propertyRentedList[0].propertyId != propertyList[0].id);
  });
});
