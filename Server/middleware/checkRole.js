const isTrainer = (req, res, next) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ message: "Access denied: Trainers only" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

// module.exports = (requiredRole) => {
//   return (req, res, next) => {
//     if (requiredRole === "trainer" && req.user.role !== "trainer") {
//       return res.status(403).json({ message: "Access denied: Trainers only" });
//     }
//     if (requiredRole === "admin" && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied: Admins only" });
//     }
//     next();
//   };
// };

module.exports.isTrainer = isTrainer;
module.exports.isAdmin = isAdmin;