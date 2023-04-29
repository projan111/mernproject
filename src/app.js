require('dotenv').config()
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bycript = require("bcryptjs");
const app = express();
require("./db/connection");
const port = process.env.PORT || 3000;
const Register = require("./models/model");

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);

// console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const UserRegister = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword,
      });
      //This is a Token Generator Middleware methods
      const token = await UserRegister.generateAuthToken()
      console.log("Token part is" + token)
      
      //Saving users information into the database
      const registered = await UserRegister.save();
      console.log(registered)
      res.status(201).render("index");

    } else {
      res.send("Password are not matching");
    }
  } catch (error) {
    res.status(400).send("There is someting going on with the save method");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await Register.findOne({ email: email });

    const isMatch = await bycript.compare(password, userEmail.password)
    
    //Generating Tokens after logged in
    const loginToken = await userEmail.generateAuthToken()
    console.log("User login Tokan is : " + loginToken)

    if (isMatch) {
      res.status(201).render("index");
      console.log("Successfully Logged in")
    } else {
      res.send("Incorrect password");
    }
  } catch (error) {
    res.status(400).send("Invalid Email");
  }
});

//***** For Practice Purpose *****
//Bcrypt Password || Compare it if it's true or not
const securePassword = async (password) => {
  const secure = await bycript.hash(password, 10);
  console.log(secure);

  const comparePass = await bycript.compare(password, secure);
  console.log(comparePass);
};
// securePassword("Hello@123")


//Creating a token for the password which user have inserted
// const jwt = require("jsonwebtoken");
// const { verify } = require("crypto");
// const createToken = async() => {
//   const token = await jwt.sign({ _id: "644b7a852abc7379b6bd1231" }, "dfdbfisbfgsfbsjofbsfhsfbjsgfusfgshsbf", {
//     expiresIn: "2 minutes"
//   });
//   console.log("tokan is:"+token)
//   const userVar = await jwt.verify(token, "dfdbfisbfgsfbsjofbsfhsfbjsgfusfgshsbf");
//   console.log(userVar)
// }
// createToken()

app.listen(port, () => {
  console.log(`Listening to the port: http://localhost:${port}`);
});
