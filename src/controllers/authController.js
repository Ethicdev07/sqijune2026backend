const users = require("./../model/users.js");

const signUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "failed",
        message: "minimum 8 characters required",
      });
    }

    const existingUser = users.find((user) => user.email == email);

    if (existingUser) {
      return res.status(409).json({
        status: "failed",
        message: "User already exist",
      });
    }

    //save

    const newUser = {
      id: users.length + 1,
      firstname,
      lastname,
      email,
      password,
    };

    users.push(newUser);

    res.status(201).json({
      status: "successfull",
      data: {
        user: {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          password: newUser.password,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: "Failed",
      message: "Signup not succesfull",
    });
  }
};

const getAllUsers = async(req, res)=>{
  res.status(200).json({
    status: "successfull",
    results: users.length,
    data: { users }
  })
}

module.exports = { signUp, getAllUsers };
