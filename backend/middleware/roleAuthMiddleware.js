import { AppError } from "../utils/AppError.js";
import { catchAsyncError } from "./catchAsyncError.js";

 const authorizeUser = (...allowedRoles) => {
  return catchAsyncError(async (req, res, next) => {
    const userRoles = req.user.roles; 

    if (!userRoles || !Array.isArray(userRoles)) {
      return next(new AppError("No roles assigned to user", 403));
    }

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return next(
        new AppError(`Access Denied: Allowed for [${allowedRoles.join(", ")}] only`, 403)
      );
    }

    next();
  });
};

export default authorizeUser









// // depend on settind a user on the req object in a authentication middleware
// const authorizeUser = (role) => {
//     return (req, res, next) => {
//         const user = req.user;
//         if(!user) {
//             return res.status(401).send({error : "User is not found"});
//         }

//         if(!user.role === role) {
//             return res.status(404).send({error : "Forbidden access to a resource"});
//         }
//         next();
//     }
// }

// export default authorizeUser;