process.env.PORT="4000";
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");
const users = [
  {
    email: "yash@yenmo.in",
    password: "abc123",
  },
];

const handleAuth = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email);

  if (user) {
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.email !== email) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    users.push({ email, password });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).send({
    message: "Success",
    auth_token: token,
  });
};

module.exports = { handleAuth };
