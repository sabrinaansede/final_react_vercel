import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token no provisto" });
  }

  try {
    const secret = process.env.JWT_SECRET || "dev_secret_autisi";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verificando JWT:", err.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
