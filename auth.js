const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

// const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());

const users = [
  { "username": "evans", "password": "1234" },
  { "username": "dennis", "password": "3214" },
  { "username": "ricky", "password": "2314" }
];

const secretKey = crypto.randomBytes(64).toString("hex");

// Register a new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Create a new user object
  const newUser = { username, password };
  users.push(newUser);

  const token = generateToken(username);
  res.status(201).json({ token, message: "Registration successful" });
  res.json({ token: generatedToken });
  // Sending the token as an HTTP-only cookie
res.setHeader('Set-Cookie', `token=${generatedToken}; HttpOnly`);

});

// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });

    res.json({ token: generatedToken }); 
  }

  const token = generateToken(username);
  res.json({ token, message: "Login successful" });
});

// Get user data
app.get("/api/get", authenticateToken, (req, res) => {
  res.send(users);
});

// Helper function to generate a JWT
function generateToken(username) {
  return jwt.sign({ username }, secretKey, { expiresIn: "1h" });
}

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}


// // Sending the token as an HTTP-only cookie
// res.setHeader('Set-Cookie', `token=${generatedToken}; HttpOnly`);



let isThrottled = false;

function throttleRequest() {
  if (!isThrottled) {
    // Make your API request or call the desired function here
    // console.log('Request sent');

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 4000); // Adjust the delay (in milliseconds) according to your requirements
  }
}

// Usage example
// Call the `throttleRequest` function when you want to make the request
throttleRequest();
throttleRequest();
throttleRequest();

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);

const newToken = new Token({
  token: tokenSchema
});

// const mytoken  =newToken((err) => {
//   if (err) {
//     // Handle the error if the token fails to save
//     console.error(err);
//   } else {
//     // Token successfully saved
//     console.log('Token stored in the database.');
//   }
// });

const token = 'your-token-to-validate';

Token({ token }, (err, foundToken) => {
  if (err) {
    // Handle the error if the query fails
    console.error(err);
  } else if (!foundToken) {
    // Token not found in the database
    console.log('Token not found.');
  } else if (foundToken.expiration < Date.now()) {
    // Token has expired
    console.log('Token has expired.');
  } else {
    // Token is valid
    console.log('Token is valid.');
  }
});






const connectionString = process.env.DB_CONNECTION;

mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Continue with your application logic
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.connect("mongodb+srv://Tuthogi:Tuthogi@cluster0.swcumaa.mongodb.net/");

app.listen(5000,(req,res)=>{
     console.log("listening on port 5000")

})
