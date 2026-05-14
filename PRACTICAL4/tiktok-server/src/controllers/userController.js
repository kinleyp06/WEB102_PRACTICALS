const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
      },
    });

    res.json(user);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};