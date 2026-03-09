const AdmissionForm = require("../../database/models/AdmissionForm");
const Course = require("../../database/models/Course");

exports.getAdmissionForm = async (req, res) => {
  try {
    const { id } = req.params;
    const admissionForm = await AdmissionForm.findOne({ courseId:id });

    if (!admissionForm) {
        return res.status(404).json({   message: "Admission form not found for this course" });
    }

    res.status(200).json({ admissionForm });
  }
    catch (error) {
    console.error("GET ADMISSION FORM ERROR:", error);
    res.status(500).json({
      message: "Server error during admission form retrieval"
    });
  }
};

exports.updateAdmissionForm = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { fields } = req.body;
    const trainerId = req.user.id;
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        message: "At least one field is required"
      });
    }
    // 🔐 Check course ownership
    const course = await Course.findOne({
      _id: courseId,
      trainerId
    });

    if (!course) {
      return res.status(403).json({
        message: "You are not authorized to manage this course form"
      });
    }

    // 🔎 Validate each field
    for (const field of fields) {
      if (
        !field.label ||
        !field.type ||
        !field.fieldKey ||
        typeof field.order !== "number"
      ) {
        return res.status(400).json({
          message: "Each field must contain label, type, fieldKey, and numeric order"
        });
      }
    }

    // 🔥 Normalize fieldKeys
    const normalizedFields = fields.map(field => ({
      ...field,
      fieldKey: field.fieldKey.trim().toLowerCase()
    }));

    // 🔥 Remove duplicate fieldKeys
    const fieldKeys = normalizedFields.map(f => f.fieldKey);
    const hasDuplicates = new Set(fieldKeys).size !== fieldKeys.length;

    if (hasDuplicates) {
      return res.status(400).json({
        message: "Duplicate fieldKey values are not allowed"
      });
    }

    // 🔥 Sort by order
    normalizedFields.sort((a, b) => a.order - b.order);

    // 🔄 Update admission form
    const admissionForm = await AdmissionForm.findOneAndUpdate(
      { courseId },
      { fields: normalizedFields },
      { new: true }
    );

    res.status(200).json({
      message: "Admission form updated successfully",
      admissionForm
    });

  } catch (error) {
    console.error("UPDATE ADMISSION FORM ERROR:", error);
    res.status(500).json({
      message: "Server error during admission form update"
    });
  }
};



exports.deleteAdmissionForm = async (req, res) => {
  try {
    const { courseId } = req.params;
    const admissionForm = await AdmissionForm.findOneAndDelete({ courseId });
    
    if (!admissionForm) {
        return res.status(404).json({ message: "Admission form not found for this course" });
    }

    res.status(200).json({ message: "Admission form deleted successfully" });
  } catch (error) {
    console.error("DELETE ADMISSION FORM ERROR:", error);
    res.status(500).json({
      message: "Server error during admission form deletion"
    });
  }
};