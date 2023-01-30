import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const {DataTypes} = Sequelize;

const User = db.define('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    }
}, {
    freezeTableName: true,
    // timestamps: true
});

//jika sinkron hanya 1 tabel
// User.sync().then((data)=>{
//     console.log("Table and model synced successfully!");
// }).catch((err)=>{
//     console.log("Error syncing the table and model!");
// });

//.sync({force: true})
//create tabel dan drop tabel jika ada tabel yg sama

//.sync({alter: true})

//add user 
// User.sync({alter:true}).then(()=>{
    //working with our update table
//     const user = User.build({username: 'syafiq', password: '1234'});
//     return user.save();
// }).then((data) => {
//     console.log("user addes to db");
// }).catch((err)=> {
//     console.log(err);
// });

export default User;