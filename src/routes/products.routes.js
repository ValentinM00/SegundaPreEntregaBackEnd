import { Router } from "express";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import productDao from "../dao/mongoDB/product.dao.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { limit, page, sort, category, status } = req.query;

        const option = {
            limit: limit || 10,
            page: page || 1,
            sort: {
                price: sort === "asc" ? 1 : -1,
            },
            learn: true,
        };

        if (category) {
            const products = await productDao.getAll({ category }, option);
            return res.status(200).json({ status: "success", products });
        }

        if (status) {
            const products = await productDao.getAll({ status }, option);
            return res.status(200).json({ status: "success", products });
        }


        const products = await productDao.getAll({}, option);
        res.status(200).json({ status: "success", products });
    }catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.getById(pid);
        if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encotrado" });

        res.status(200).json({ status: "success", product });
    }catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.deleteOne(pid);
        if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado"});

        res.status(200).json({ status: "success", msg: `El producto con el id ${pid} fue eliminado` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});

router.put("/:pid", async (req, res) => {
    try{
        const { pid } = req.params;
        const productData = req.body
        const product = await productDao.update(pid, productData);
        if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" });

        res.status(200).json({ status: "success", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error ionterno del servidor" });
    }
});

router.post("/", checkProductData, async (req, res) => {
    try {
        const productData = req.body;
        const product = await productDao.create(productData);

        res.status(201).json({ status: "success", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor "});
    }
});

export default router;