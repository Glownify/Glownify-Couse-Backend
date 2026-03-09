const SubmittedApplication = require("../../database/models/SubmittedApplication");
const Course = require("../../database/models/Course");

exports.submitApplication = async (req, res) => {
  console.log("Received application submission:", req.body);
  console.log("Authenticated user:", req.user);
  try {
    const { courseId, answers } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const trainerId = course.trainerId;

    const newApplication = new SubmittedApplication({
      courseId,
      trainerId,
      studentId,
      answers,
    });

    await newApplication.save();
    res
      .status(201)
      .json({
        message: "Application submitted successfully",
        application: newApplication,
      });
  } catch (error) {
    console.error("Error submitting application:", error);
    res
      .status(500)
      .json({ message: "Server error while submitting application" });
  }
};

exports.getApplicationsForTrainer = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const applications = await SubmittedApplication.find({ trainerId })
      .populate("courseId", "title")
      .populate("studentId", "name email phone city bio");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching applications" });
  }
};

exports.getApplicationForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await SubmittedApplication.find({ studentId })
      .populate({
        path: "courseId",
        populate: {
          path: "category",
          select: "name"
        }
      })
      .populate("trainerId", "name email");

    res.status(200).json(applications);

  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};
