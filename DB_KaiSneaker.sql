DROP DATABASE IF EXISTS kai_sneaker;
CREATE DATABASE IF NOT EXISTS kai_sneaker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kai_sneaker;
-- 1. Các bảng độc lập (Cần tạo trước)
CREATE TABLE `categories` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` nvarchar(100) NOT NULL
);

CREATE TABLE `images` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `image_url` varchar(500) NOT NULL
);

CREATE TABLE `roles` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) NOT NULL UNIQUE
);

CREATE TABLE `payment_method` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` nvarchar(100) NOT NULL,
  `description` TEXT
);

-- 2. Bảng Users 
CREATE TABLE `users` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` nvarchar(255),
  `gender` nvarchar(10),
  `avatar_url` varchar(500),
  `province_city` nvarchar(100),
  `district` nvarchar(100),
  `ward` nvarchar(100),
  `house_number_street` nvarchar(255),
  `status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

-- 3. Nhóm Sản phẩm & Biến thể
CREATE TABLE `brands` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` nvarchar(100) NOT NULL,
  `description` TEXT,
  `image_id` bigint,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`)
);

CREATE TABLE `products` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` nvarchar(255) NOT NULL,
  `description` text,
  `price` decimal(19,2),
  `is_deleted` boolean DEFAULT false,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `brand_id` bigint,
  `category_id` bigint,
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);

CREATE TABLE `product_variants` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `size` nvarchar(20),
  `color` nvarchar(50),
  `product_id` bigint,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

-- 4. Nhóm Kho hàng & Giỏ hàng
CREATE TABLE `inventory` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `quantity` INT DEFAULT 0,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `variant_id` BIGINT UNIQUE,
    FOREIGN KEY (`variant_id`)
        REFERENCES `product_variants` (`id`)
);

CREATE TABLE `cart` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint UNIQUE,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 5. Nhóm Đơn hàng (Đã sửa lỗi ENUM)
CREATE TABLE `orders` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `total_amount` decimal(19,2),
  `order_status` ENUM('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
  `payment_status` ENUM('UNPAID', 'PAID', 'REFUNDED') DEFAULT 'UNPAID',
  `shipping_address` nvarchar(500),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` bigint,
  `payment_method_id` bigint,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`)
);

-- 6. Các bảng quan hệ N-N & Chi tiết
CREATE TABLE `product_image` (
  `product_id` bigint,
  `image_id` bigint,
  PRIMARY KEY (`product_id`, `image_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`)
);

CREATE TABLE `order_items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `unit_price` decimal(19,2),
  `quantity` int,
  `order_id` bigint,
  `variant_id` bigint,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`)
);

CREATE TABLE `user_roles` (
  `user_id` bigint,
  `role_id` bigint,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
);

CREATE TABLE `wishlist` (
  `user_id` bigint,
  `product_id` bigint,
  PRIMARY KEY (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

CREATE TABLE `reviews` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `product_id` bigint,
  `rating` tinyint,
  `comment` TEXT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

CREATE TABLE `cart_items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `cart_id` bigint,
  `variant_id` bigint,
  `quantity` int,
  FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`),
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`)
);