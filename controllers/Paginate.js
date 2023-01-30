import Paginate from "../models/Paginate.js"
import {Op} from "sequelize"

export const listPaginate = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.seacrh_query || "";
    const offset  = limit * page; 
    const totalRows = await Paginate.count({
        where: {
            // [Op.or] : [{name}, {email}]
            // penggunaan or untuk sleect semua hasil dari filter 
            [Op.or] : [{name: {
                [Op.like] : '%'+search+'%'
            }}, {email : {
                [Op.like] : '%'+search+'%'
            }}]
        }
    });
    
    //total halaman
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Paginate.findAll({
        where: {
            // [Op.or] : [{name}, {email}]
            [Op.or] : [{name: {
                [Op.like] : '%'+search+'%'
            }}, {email : {
                [Op.like] : '%'+search+'%'
            }}]
        },
        offset: offset,
        limit: limit,
        order: [
            ['id', 'DESC']
        ]
    });

    //parsing data
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
} 