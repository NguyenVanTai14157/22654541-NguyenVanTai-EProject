const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/order");
const amqp = require("amqplib");
const config = require("./config");

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setupOrderConsumer();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  async setupOrderConsumer() {
    console.log("Connecting to RabbitMQ...");

    const amqpServer = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

    const connectRabbitMQ = async (retryCount = 0) => {
      try {
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        await channel.assertQueue("orders");
        console.log("RabbitMQ connected");

        channel.consume("orders", async (data) => {
          console.log("Consuming ORDER service");
          const { products, username, orderId } = JSON.parse(data.content);

          const newOrder = new Order({
            products,
            user: username,
            totalPrice: products.reduce((acc, p) => acc + p.price, 0),
          });

          await newOrder.save();
          channel.ack(data);

          console.log("Order saved to DB and ACK sent to ORDER queue");

          const { user, products: savedProducts, totalPrice } = newOrder.toJSON();
          channel.sendToQueue(
            "products",
            Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
          );
        });
      } catch (err) {
        console.error(`Failed to connect to RabbitMQ (${retryCount}):`, err.message);
        // ⏳ Thử kết nối lại sau 5s
        setTimeout(() => connectRabbitMQ(retryCount + 1), 5000);
      }
    };

    connectRabbitMQ();
  }




  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
