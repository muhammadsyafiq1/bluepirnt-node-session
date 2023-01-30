import User from "../models/User.js";

export const verifyUser = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(402).json({msg: "Silahkan Login Dahulu"});
    }

    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    req.userId = user.id;
    req.role = user.role;
    next();
}

export const admin = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(402).json({msg: "Silahkan Login Dahulu"});
    }

    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    if(user.role !== "admin") return res.status(403).json({msg: "Forbidden"})
    next();
}