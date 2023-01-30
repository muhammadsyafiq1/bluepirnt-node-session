import express from "express"
import { listPaginate } from "../controllers/Paginate.js"

const router = express.Router()

router.get('/paginates', listPaginate)

export default router