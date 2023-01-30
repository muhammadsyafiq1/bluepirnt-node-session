import express  from "express"
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controllers/User.js"
import { verifyUser, admin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', getUsers)
router.get('/user/:id',verifyUser, getUserById)
router.post('/users',createUser)
router.patch('/user/:id',verifyUser, updateUser)
router.delete('/user/:id',verifyUser, deleteUser)

export default router