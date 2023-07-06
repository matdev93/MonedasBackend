const product = require('../models/product');
const user = require('../models/user');

const getProducts = async(req, res) => {
    try {
        const products = await product.find();
        res.json({success: true, msg: 'Lista de productos', info: products})
    } catch {
        res.status(500).json({ success: false, message: error.message})
    }
};

const getProductById = async(req, res) => {
    const { productId } = req.params;
  
    try {
      const products = await product.findById(productId);
  
      res.json({ success: true, message: 'Producto obtenido', info: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// a partir de aca son permisos para perfil admin

const createProduct = async (req, res) => {
    try {
      const users = await user.findById(req.auth.id);
      if (!users.isAdmin){
        throw new Error('No tienes acceso')
      }
      const newProduct = new product(req.body);
      await newProduct.save();
  
      res.json({ success: true, message: 'Producto Creado', info: newProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

const editProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const products = await product.findByIdAndUpdate(productId, req.body, {new: true});
  
      res.json({
        success: true,
        message: 'Producto editado',
        updateInfo: products
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
      const products = await product.findByIdAndDelete(productId);
  
      res.json({
        success: true,
        message: "Producto eliminado",
        deleteProduct: products
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
};

//funcion para reducir stock

const reduceStock = async(req, res) => {
    const productosComprado = req.body.cartItems;
    try {
        productosComprado.map(async(producto) => {
            await product.findByIdAndUpdate(producto._id, {stock: producto.stock - producto.quantity})
        })
    res.json({msg: "Se ha reducido el stock de los productos", success: true})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

module.exports = {getProducts, createProduct, getProductById, editProduct, deleteProduct, reduceStock};
