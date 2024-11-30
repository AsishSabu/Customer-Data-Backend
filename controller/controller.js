const Customer = require("../models/customerModel");

const getCustomerData = async (req, res) => {
  const { search, minAge, maxAge, page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  const query = {};
  const today = new Date();
  console.log(req.query);

  try {
    if (page <= 0 || isNaN(page)) {
      return res.status(400).json({ message: "Invalid page number." });
    }
    if ((minAge && isNaN(minAge)) || (maxAge && isNaN(maxAge))) {
      return res.status(400).json({ message: "Invalid age range." });
    }

    if (minAge && maxAge) {
      const maxDob = new Date(
        today.getFullYear() - minAge,
        today.getMonth(),
        today.getDate()
      );
      const minDob = new Date(
        today.getFullYear() - maxAge - 1,
        today.getMonth(),
        today.getDate() + 1
      );
      query.dob = { $gte: minDob, $lte: maxDob };
    }
    if (search) {
      query.$or = [
        { name_of_customer: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const sort = search
      ? {
          name_of_customer: {
            $regex: `^${search}`,
            $options: "i",
          }
            ? 1
            : 0,
          name_of_customer: 1,
        }
      : { s_no: 1 };

    const totalCount = await Customer.countDocuments(query);
    const data = await Customer.find(query).sort(sort).skip(skip).limit(limit);

    res.status(200).json({ data, count: totalCount });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
};
module.exports = {
  getCustomerData,
};
