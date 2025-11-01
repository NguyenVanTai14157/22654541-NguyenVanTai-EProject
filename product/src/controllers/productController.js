const Product = require("../models/product");
const messageBroker = require("../utils/messageBroker");
const uuid = require('uuid');

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {

  constructor() {
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();
  }
  
  async getid(req,res,next){
    const p=await Product.findById(req.params.id);
    if(!p){
      return res.status(404).json({message:"p not found"});
    }
    return res.status(200).json(p);
  }
  async createProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = new Product(req.body); //tạo product từ dữ liệu người dùng gửi

      const validationError = product.validateSync(); //nếu dữ liệu hợp lệ thì sẽ trả về undefined
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      await product.save({ timeout: 30000 });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
  async createOrder(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    
      const { ids } = req.body;
      const products = await Product.find({ _id: { $in: ids } });
  
      const orderId = uuid.v4(); // Generate a unique order ID
      // 🧠 Lưu tạm thông tin đơn hàng vào bản đồ (Map) trong RAM
      // dùng để theo dõi trạng thái đơn hàng (pending → completed)
      this.ordersMap.set(orderId, { 
        status: "pending", // trạng thái ban đầu: đang chờ xử lý
        products,                  // danh sách sản phẩm
        username: req.user.username // người dùng đang tạo đơn
      });
      
      // 📤 Gửi message đến hàng đợi "orders" (RabbitMQ)
      // để thông báo cho Order Service xử lý đơn hàng này
      await messageBroker.publishMessage("orders", {
        products,
        username: req.user.username,
        orderId, // include the order ID in the message to orders queue
      });
      // 📥 Đăng ký tiêu thụ (consume) hàng đợi "products"
      // Nhận phản hồi từ Product Service sau khi xử lý
      messageBroker.consumeMessage("products", (data) => {
        const orderData = JSON.parse(JSON.stringify(data));
        const { orderId } = orderData;
        const order = this.ordersMap.get(orderId);
        if (order) {
          // update the order in the map
          this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
          console.log("Updated order:", order);
        }
      });
  
      // Long polling until order is completed
      let order = this.ordersMap.get(orderId);
      while (order.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking status again
        order = this.ordersMap.get(orderId);
      }
  
      // Once the order is marked as completed, return the complete order details
      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  

  async getOrderStatus(req, res, next) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  }

  async getProducts(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const products = await Product.find({});

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = ProductController;
