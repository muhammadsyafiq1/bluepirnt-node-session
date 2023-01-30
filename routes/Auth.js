import express from "express";
import { Login, Logout, isLogin } from "../controllers/Auth.js";

const router = express.Router();

router.get('/is-login', isLogin);
router.post('/login', Login);
router.delete('/logout', Logout);

export default router;