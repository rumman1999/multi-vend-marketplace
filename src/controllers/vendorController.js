const Vendor = require("../models/vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.registerVendor = async (req, res) => {
  const { name, email, password, storeName, phone, address  , isApproved} = req.body;

  try {
    let vendor = await Vendor.findOne({ email });
    if (vendor)
      return res.status(400).json({ message: "Vendor already exist" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    vendor = new Vendor({
      name,
      email,
      password: hashedPass,
      storeName,
      phone,
      address,
      isApproved,
    });

    await vendor.save();
    res.status(201).json({ message: "Vnedor Registered" });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

exports.loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    let vendor = Vendor.findOne({ email });
    if (!vendor)
      return res.status(400).json({ message: "Vnedor NOt registered yet" });

    const isMatch = await bcrypt.compare(password, vendor.password);

    if (!isMatch)
      return res.status(200).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};
