import express from "express";
import { Login, Logout, isLogin } from "../controllers/Auth.js";
import { admin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/is-login', isLogin, admin);
router.post('/login', Login);
router.delete('/logout', Logout);

export default router;