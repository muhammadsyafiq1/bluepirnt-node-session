import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/Database.js"
import User from "./User.js";

const {DataTypes} = Sequelize;

const Product = db.define('products', {
    uuid: {
        type : DataTypes.STRING,
        defaultValue : UUIDV4,
        allowNull: false,
        validate :{
            notEmpty: true
        }
    },
    name: {
        type : DataTypes.STRING,
        allowNull: false,
        validate :{
            notEmpty: true,
            len: [3, 100]
        }
    },
    price: {
        type : DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image:{
        type: DataTypes.STRING
    },
    url:{
        type:DataTypes.STRING
    }
}, {
    freezeTableName: true
});

// definisi relasi one to many
User.hasMany(Product);
Product.belongsTo(User, {foreignKey: 'userId'});

export default Product