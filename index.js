import express from "express"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import User from "./routes/User.js"
import Product from "./routes/Product.js"
import Auth from "./routes/Auth.js"
import Paginate from "./routes/Paginate.js"
import FileUpload from "express-fileupload"

dotenv.config();
// 1 menyimpan session kedalam db
// import SequelizeStore  from "connect-session-sequelize"

//import koneksi agar bisa sync ke model untuk generate tabel secara otomatis / migrate
import db from "./config/Database.js" 

const app = express();

//2 menyimpan session ke db
// const sessionStore = SequelizeStore(session.Store);
// const store = new sessionStore({
//     db: db
// })

//singkrongkan koneksi db // migrate
// (async()=>{
//     await db.sync({alter: true});
// })();


app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure: 'auto'
    },
    // 3 menyimpan session ke db
    // store: store
}))
app.use(FileUpload())
app.use(cors({
    // forntend dapat mengirimkan request beserta credentials
    credentials: true,
    // domain yang diizinkan untuk akses api
    origin: 'http://localhost:3000'
}))
// agar  bisa menerima data dalam bentuk JSON
app.use(express.json());

//middleware route
app.use(User)
app.use(Product)
app.use(Auth)
app.use(Paginate)

// 4 membuat tabel session 
// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log("api work");
})