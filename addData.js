const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const customerModel = require("./models/customerModel");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("Couldn't connect:", error.message);
    process.exit(1);
  }
};

const generateIndianMobileNumber = (uniqueMobileNumbers) => {
  let mobileNumber;
  do {
    const prefix = faker.helpers.arrayElement(["7", "8", "9"]);
    const suffix = faker.string.numeric(9);
    mobileNumber = prefix + suffix;
  } while (uniqueMobileNumbers.has(mobileNumber));
  uniqueMobileNumbers.add(mobileNumber);
  return mobileNumber;
};

const generateData = (s_no, uniqueEmails,uniqueMobileNumbers) => {
  let email;
  do {
    email = faker.internet.email();
  } while (uniqueEmails.has(email));
  uniqueEmails.add(email);
  return {
    s_no,
    name_of_customer: faker.person.fullName(),
    email,
    mobile_number: generateIndianMobileNumber(uniqueMobileNumbers),
    dob: faker.date.birthdate({ min: 2000, max: 2008, mode: "year" }),
    created_at: new Date(),
    modified_at: new Date(),
  };
};

const addData = async () => {
  const totalRecords = 2000000;
  const batchSize = 10000;
  const uniqueEmails = new Set();
  const uniqueMobileNumbers = new Set();
  let s_no = 1;

  try {
    for (let i = 0; i < totalRecords / batchSize; i++) {
      const batch = [];
      for (let j = 0; j < batchSize; j++) {
        batch.push(generateData(s_no++, uniqueEmails,uniqueMobileNumbers));
      }
      await customerModel.insertMany(batch);
    }
  } catch (error) {
    console.error("Error seeding data:", error.message);
  } finally {
    mongoose.disconnect();
    console.log("Database disconnected");
  }
};

(async () => {
  await connectDb();
  await addData();
})();
