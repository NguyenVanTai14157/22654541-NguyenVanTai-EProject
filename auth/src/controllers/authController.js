const AuthService = require("../services/authService");

/**
 * Class to encapsulate the logic for the auth routes
 */

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { user, pass } = req.body;

    const result = await this.authService.login(user, pass);

    if (result.success) {
      res.json({ token: result.token });
    } else {
      res.status(400).json({ message: result.message });
    }
  }

  async register(req, res) {
    const user = req.body;
  
    try {
      const existingUser = await this.authService.findUserByUsername(user.user);
  
      if (existingUser) {
        console.log("Username already taken") //lỗi trên mongoose(mongodb shell)
        throw new Error("Username already taken"); //lỗi trên postman
      }
  
      const result = await this.authService.register(user);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;

    try {
      const user = await this.authService.getUserById(userId);
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
