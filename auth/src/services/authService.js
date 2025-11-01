const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");
const config = require("../config");
const User = require("../models/user");

/**
 * Class to hold the business logic for the auth service interacting with the user repository
 */
class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async findUserByUsername(username) {
    const user = await User.findOne({user: username });
    return user;
  }
  
  async login(username, password) {
    const user = await this.userRepository.getUserByUsername(username);

    if (!user) {
      return { success: false, message: "Invalid username or password" };
    }

    const isMatch = await bcrypt.compare(password, user.pass);

    if (!isMatch) {
      return { success: false, message: "Invalid username or password" };
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret); // thời gian không hết hạn

    return { success: true, token };
  }

  async register(user) {
    const salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(user.pass, salt);

    return await this.userRepository.createUser(user);
  }

  async deleteTestUsers() {
    // Delete all users with a username that starts with "test"
    await User.deleteMany({ user: /^test/ });
  }
}

module.exports = AuthService;
