📘 Giới thiệu dự án
Dự án mô phỏng hệ thống bán hàng trực tuyến được xây dựng theo kiến trúc hướng dịch vụ (SOA - Service Oriented Architecture), trong đó mỗi chức năng chính được tách thành một microservice độc lập.
Mục tiêu của dự án hiểu và thực hành các khái niệm:
Giao tiếp giữa các dịch vụ thông qua API Gateway.
Sử dụng RabbitMQ để truyền thông điệp bất đồng bộ giữa các service.
Triển khai toàn bộ hệ thống trên Docker Compose.

Bước 1: Khởi tạo dự án
Chạy npm install cho dự án.
![](./public/1.png)
Bước 2: Dockerfile API Gateway
![](./public/2.png)
Bước 3: Dockerfile Auth
![](./public/3.png)
Bước 4: Dockerfile Order
![](./public/4.png)
Bước 5: Dockerfile Product
![](./public/5.png)
Bước 6: Chạy lệnh docker compose up -d --build để xây dựng lại (build) các image từ mã nguồn mới nhất và khởi động tất cả các dịch vụ (Auth, Product, Order, API Gateway, MongoDB, RabbitMQ) trong nền dựa trên cấu hình trong file docker-compose.yml.
![](./public/6.png)
![](./public/7.png)
Bước 7: Test tất cả các API cho các service
Thực hiện lần lượt các yêu cầu:
Đăng ký người dùng mới
Đăng nhập lấy token
Tạo sản phẩm
Đặt hàng
![](./public/8.png)
![](./public/9.png)
![](./public/10.png)
![](./public/11.png)
![](./public/12.png)
![](./public/13.png)
![](./public/14.png)
![](./public/14_1.png)
Bước 8: bổ sung code vào 2 file productController.js và productRoutes.js ể hiện thị thông tin hóa đơn với id.
![](./public/15.png)
![](./public/16.png)
Bước 9: Kiểm tra trên postman
![](./public/17.png)



