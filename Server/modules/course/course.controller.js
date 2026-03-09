const Course = require("../../database/models/Course");
const AdmissionForm = require("../../database/models/AdmissionForm");
const Payment = require("../../database/models/Payment");

exports.createCourse = async (req, res) => {
  const session = await Course.startSession();
  console.log("CREATE COURSE REQUEST BODY:", req.body);
  console.log("Authenticated User:", req.user);
  try {
    await session.startTransaction();

    const trainerId = req.user.id;
    console.log("Authenticated Trainer ID:", trainerId);

    const {
      title,
      description,
      category,
      duration,
      mode,
      location,
      price,
      youwillLearn,
      requirements,
      startDate,
      fields,
      upiId,
      paymentLink,
      paymentNote
    } = req.body;

    if (!title || !category || !mode || !price) {
      return res.status(400).json({
        message: "Title, category, mode and price are required"
      });
    }

    // -----------------------------
    // VALIDATE ADMISSION FIELDS
    // -----------------------------
    let normalizedFields = [];

    if (fields && Array.isArray(fields)) {
      for (const field of fields) {
        if (
          !field.label ||
          !field.type ||
          !field.fieldKey ||
          typeof field.order !== "number"
        ) {
          return res.status(400).json({
            message:
              "Each field must contain label, type, fieldKey, and numeric order"
          });
        }
      }

      normalizedFields = fields.map(field => ({
        ...field,
        fieldKey: field.fieldKey.trim().toLowerCase()
      }));

      const fieldKeys = normalizedFields.map(f => f.fieldKey);

      if (new Set(fieldKeys).size !== fieldKeys.length) {
        return res.status(400).json({
          message: "Duplicate fieldKey values are not allowed"
        });
      }

      normalizedFields.sort((a, b) => a.order - b.order);
    }

    // -----------------------------
    // CREATE COURSE
    // -----------------------------
    const [course] = await Course.create([{
      trainerId,
      title,
      description,
      category,
      duration,
      mode,
      location,
      price,
      startDate,
      poster: req.body.poster || null,
      youwillLearn,
      requirements
    }], { session });

    // -----------------------------
    // CREATE ADMISSION FORM
    // -----------------------------
    let admissionForm = null;

    if (normalizedFields.length > 0) {
      [admissionForm] = await AdmissionForm.create([{
        courseId: course._id,
        fields: normalizedFields
      }], { session });
    }

    // -----------------------------
    // CREATE PAYMENT
    // -----------------------------
    let payment = null;

    if (upiId || paymentLink || paymentNote) {
      [payment] = await Payment.create([{
        courseId: course._id,
        upiId,
        paymentLink,
        paymentNote,
        qrCodeImage: req.body.qrCodeImage || null
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Course created successfully",
      course,
      admissionForm,
      payment
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("CREATE COURSE ERROR:", error);

    return res.status(500).json({
      message: "Server error during course creation"
    });
  }
};

exports.getTrainerCourses = async (req, res) => {
  const trainerId = req.user.id;
  try {
    const courses = await Course.find({ trainerId })
      .populate("category", "name");

    res.status(200).json({ courses });

  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({
      message: "Server error during course retrieval"
    });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "name")
      .populate("trainerId", "name email");
    res.status(200).json(courses);
  } catch (error) {
    console.error("GET ALL COURSES ERROR:", error);
    res.status(500).json({
      message: "Server error during courses retrieval"
    });
  }
};

exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id)
      .populate("category", "name")
      .populate("trainerId", "name email bio");
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("GET COURSE BY ID ERROR:", error);
    res.status(500).json({
      message: "Server error during course retrieval"
    });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course
    });

  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({
      message: "Server error during course update"
    });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const course = await Course.findOneAndDelete({
      _id: id,
      trainerId
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found or not authorized"
      });
    }

    res.status(200).json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({
      message: "Server error during course deletion"
    });
  }
};



