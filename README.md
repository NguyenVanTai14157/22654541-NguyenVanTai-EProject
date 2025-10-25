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
CI/CD
Tạo token bên Docker Hub
Copy token vào GitHub
Vào GitHub
Chọn responsitory
Chọn setting -> secrets and variables -> Actions ->
new responsitory secret -> Names(DOCKER_NAME), secret(username đăng nhập bên docker hub)
new responsitory secret -> Names(DOCKER_PASSWORD), secret(token của Docker Hub)
Tạo thư mục .GitHub/workflows
Tạo file docker-cicd.yml
Điền thông tin cho file docker-cicd.yml
Push workflow lên GitHub để chạy CI/CD

git add .github/workflows/docker-cicd.yml
git commit -m "update6"
git push origin main
Thao tác với github Action: Thực hiện CI/CD với dự án
![](./public/18.png)
![](./public/19.png)
![](./public/20.png)
![](./public/21.png)
CI/CD liên kết với Docker
![](./public/22.png)
![](./public/23.png)




