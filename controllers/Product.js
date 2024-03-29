
import fs from "fs";
import path from "path";
import Product from "../models/Product.js"
import User from "../models/User.js";

export const getProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                // attributes:[
                //     'name', 'price'
                // ],
                //ambil relasi dengan user
                include:[{
                    model: User,
                    attributes:[
                        'name', 'email'
                    ]
                }]
            });
        }else{
            response = await Product.findAll({
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User
                }]
            })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            include:[{
                model: User
            }],
            where:{
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProduct = async (req, res) => {
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.name
    const file = req.files.file
    const price = req.body.price
    const userId = req.userId
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedType = ['.png','.jpg','.jpeg']
 
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({name: name, image: fileName, url: url, price: price, userId: userId});
            res.status(201).json({msg: "Product Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })
    
}

export const bulkCreateProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "Tidak ada berkas yang diunggah" });
    
    // Jika permintaan berisi array produk
    if (Array.isArray(req.files.files) && req.files.files.length > 0) {
        try {
            const produk = req.body.produk;
            const allowedType = ['.png','.jpg','.jpeg'];
            const produkDibuat = [];

            for (let i = 0; i < req.files.files.length; i++) {
                const file = req.files.files[i];
                const nama = produk[i].nama;
                const harga = produk[i].harga;
                const idPengguna = req.userId;
                const ukuranBerkas = file.data.length;
                const ekstensi = path.extname(file.name);
                const namaBerkas = file.md5 + ekstensi;
                const url = `${req.protocol}://${req.get("host")}/images/${namaBerkas}`;

                if (!allowedType.includes(ekstensi.toLowerCase())) return res.status(422).json({ msg: "Jenis berkas tidak valid" });
                if (ukuranBerkas > 5000000) return res.status(422).json({ msg: "Ukuran gambar harus kurang dari 5 MB" });

                file.mv(`./public/images/${namaBerkas}`, async (err) => {
                    if (err) return res.status(500).json({ msg: err.message });
                    try {
                        await Product.create({ nama: nama, gambar: namaBerkas, url: url, harga: harga, idPengguna: idPengguna });
                        produkDibuat.push({ nama: nama, gambar: namaBerkas, url: url, harga: harga });
                    } catch (error) {
                        console.log(error.message);
                    }
                });
            }

            res.status(201).json({ msg: "Produk Berhasil Dibuat", produkDibuat });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: "Terjadi Kesalahan Server" });
        }
    } else {
        // Jika permintaan hanya berisi satu produk
        const { name, price } = req.body;
        const file = req.files.file;
        const idPengguna = req.userId;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Jenis berkas tidak valid" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Ukuran gambar harus kurang dari 5 MB" });

        file.mv(`./public/images/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
            try {
                await Product.create({ name: name, image: fileName, url: url, price: price, userId: idPengguna });
                res.status(201).json({ msg: "Produk Berhasil Dibuat" });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ msg: "Terjadi Kesalahan Server" });
            }
        });
    }
};

 
export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    console.log(product.image);
    console.log(product);
    if(!product) return res.status(404).json({msg: "No Data Found"});
     
    let fileName = "";
    if(req.files === null){
        fileName = product.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];
 
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
 
        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.name;
    const price = req.body.price;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
     
    try {
        await Product.update({name: name, image: fileName, url: url, price:price},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async  (req, res) => {
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "No Data Found"});
 
    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Product Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}
