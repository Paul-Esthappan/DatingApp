const Employment = require("../models/employementSchema");

// Save employment data
const addEmploymentDetails = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { companyName, designation, companyLocation, professionTitle, expertiseLevel } = req.body;
    const userId = req.params.id;

    const employment = new Employment({
      userId,
      companyName,
      designation,
      companyLocation,
      professionTitle,
      expertiseLevel,
    });
    await employment.save();
    res.status(201).send({ message: "Employment data saved successfully", employment });
  } catch (error) {
    console.error("Error saving employment data:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { addEmploymentDetails };
