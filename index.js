const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // Import the cors middleware

const app = express();

// Set up Global configuration access
dotenv.config();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});

// Dummy user credentials for demonstration
const dummyUser = {
  username: "Arun",
  password: "password123",
};

// Main Code Here //
// Authenticating user and generating JWT
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match
  if (username === dummyUser.username && password === dummyUser.password) {
    // Generate JWT token
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const data = {
      username: dummyUser.username,
      role: "user", // You can assign roles as needed
    };
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: "1m" });

    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// Verification of JWT
app.get("/user/validateToken", (req, res) => {
  // Tokens are generally passed in header of request
  // Due to security reasons.

  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.json({ message: "Successfully Verified" });
    } else {
      // Access Denied
      return res.status(401).json({ error: "Access Denied" });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ error: "Access Denied" });
  }
});
