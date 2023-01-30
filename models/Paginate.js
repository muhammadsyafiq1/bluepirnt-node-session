import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const {DataTypes} = Sequelize;

const Paginate = db.define('paginates', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
    timestamps: true
});



export default Paginate;