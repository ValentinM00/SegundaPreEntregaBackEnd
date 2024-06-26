import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";

export const checkProductData = async (req = request, res = response, next) => {
    try {
        const { title, description, price, code, stock, category } = req.body;
        const newProduct = {
            title,
            description,
            price,
            code,
            stock,
            category,
        };

        const products = await productDao.getAll();
        const productExists = products.docs.fins((p) => p.code === code);
        if(productExists) return res.status(400).json({ status: "Error", msg: `El producto con el codigo ${code} ya existe` });

        const checkData = Object.values(newProduct).includes(undefined);
        if (checkData) return res.status(400).json({ status: "Error", msg: "Todos los datos son obligatorios" });

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Errorinterno del servidor" });
    }
};
