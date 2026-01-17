import jwt from "jsonwebtoken";

export const protectedRoute = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch {
    return res.sendStatus(401);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }
  next();
};  
