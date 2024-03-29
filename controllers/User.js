import User from "../models/User.js"
import argon2 from "argon2"

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async (req, res) => {
    // console.log(req.params.id);
    try {
        const response = await User.findOne({
            attributes: ['uuid','name','email','role'],
            where : {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async (req, res) => {
    const {name, email, password, confirmPassword, role} = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg: "Password tidak sama"});

    const hashPassword = await argon2.hash(password);

    try {
        const user = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        // console.log(user);
        req.session.userId = user.uuid; 
        res.status(201).json({msg :"Regsiter Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({where:{
        uuid: req.params.id
    }});
    if(!user) return res.status(404).json({msg: "User not found"});

    const {name, email, password, confirmPassword, role} = req.body;

    let hashPassword;

    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }

    if(password !== confirmPassword) return res.status(400).json({msg: "Password tidak sama!"});

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "user berhasil diupdate"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if(!user) return res.status(404).json({msg: "User tidak ditermukan"});

    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({msg: "User deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}