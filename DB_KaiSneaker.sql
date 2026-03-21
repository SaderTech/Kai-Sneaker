-- ==========================================================
-- KAI SNEAKER - DATABASE FULL DEMO (TINH GỌN 2 USERS)
-- Bao gồm: Cấu trúc bảng + Data chuẩn + Full Text Mô tả
-- 1 Tài khoản Admin | 1 Tài khoản User (Antony)
-- Mật khẩu mặc định: 123456
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `kai_sneaker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kai_sneaker`;

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- 1. LÀM SẠCH DATABASE
-- ==========================================================
DROP TABLE IF EXISTS `wishlist`, `reviews`, `order_items`, `orders`, `payment_method`, `cart_items`, `cart`, `user_roles`, `roles`, `users`, `inventory`, `product_variants`, `product_image`, `products`, `brands`, `categories`, `images`;

-- ==========================================================
-- 2. TẠO CẤU TRÚC BẢNG
-- ==========================================================
CREATE TABLE `images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `brands_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(19,2) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `brand_id` bigint DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `brand_id` (`brand_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_image` (
  `product_id` bigint NOT NULL,
  `image_id` bigint NOT NULL,
  PRIMARY KEY (`product_id`,`image_id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `product_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_image_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `size` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `color` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `variant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `variant_id` (`variant_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `gender` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province_city` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `district` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ward` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `house_number_street` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cart_id` bigint DEFAULT NULL,
  `variant_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` tinytext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_amount` decimal(19,2) DEFAULT NULL,
  `order_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'UNPAID',
  `shipping_address` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` bigint DEFAULT NULL,
  `payment_method_id` bigint DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `unit_price` decimal(19,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `variant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `rating` tinyint DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `wishlist` (
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================================
-- 3. INSERT DỮ LIỆU (DML) - SẢN PHẨM & KHO HÀNG
-- ==========================================================

INSERT INTO `images` VALUES (1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMea_zN-jsoAG76xWLDVxL_i6HX8rpOBRwpA&s'),(2,'https://ryos.co.nz/cdn/shop/files/HOMEPAGE_BANNER_7.png?crop=center&height=1680&v=1729820343&width=3840'),(3,'https://cdn.shopify.com/s/files/1/0032/7722/6093/files/PO_NB_banner_2390x598_1_1024x1024.webp?v=1723683996'),(4,'https://metrobrands.com/wp-content/uploads/2023/05/VANS-1920-X-694-PX.jpg'),(5,'https://drake.vn/image/catalog/H%C3%ACnh%20content/logo%20gi%C3%A0y%20Converse/logo-gi%C3%A0y-converse-07.jpg'),(6,'https://cdn.advertisingvietnam.com/image/2021/06/08/1623127858318.png'),(7,'https://sneakerdaily.vn/wp-content/uploads/2026/01/GIYNIK1.jpg'),(8,'https://sneakerdaily.vn/wp-content/uploads/2026/01/Giay-Nike-Air-Force-1-Low-%E2%80%98Valentines-Day-IQ4937-161-3.jpg'),(9,'https://sneakerdaily.vn/wp-content/uploads/2026/01/Giay-Nike-Air-Force-1-Low-%E2%80%98Valentines-Day-IQ4937-161-5.jpg'),(10,'https://sneakerdaily.vn/wp-content/uploads/2026/01/Giay-Nike-Air-Force-1-Low-%E2%80%98Valentines-Day-IQ4937-161Nike-Air-Force-1-Low-%E2%80%98Valentines-Day-IQ4937-161.jpg'),(11,'https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-1-Essential-Black-White-FZ5808-102.jpg'),(12,'https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-1-Essential-Black-White-FZ5808-102-2.jpg'),(13,'https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-1-Essential-Black-White-FZ5808-102-3.jpg'),(14,'https://sneakerdaily.vn/wp-content/uploads/2025/03/Giay-Nike-Air-Max-1-Essential-Black-White-FZ5808-102-4.jpg'),(15,'https://sneakerdaily.vn/wp-content/uploads/2025/05/Giay-adidas-UltraBoost-22-Legacy-Indigo-GX3061.jpg'),(16,'https://sneakerdaily.vn/wp-content/uploads/2025/05/Giay-adidas-UltraBoost-22-Legacy-Indigo-GX3061-2.jpg'),(17,'https://sneakerdaily.vn/wp-content/uploads/2025/05/Giay-adidas-UltraBoost-22-Legacy-Indigo-GX3061-3.jpg'),(18,'https://sneakerdaily.vn/wp-content/uploads/2025/05/Giay-adidas-UltraBoost-22-Legacy-Indigo-GX3061-4.jpg'),(19,'https://sneakerdaily.vn/wp-content/uploads/2023/09/giay-adidas-samba-og-white-black-gum-b75806.jpg.webp'),(20,'https://sneakerdaily.vn/wp-content/uploads/2023/09/29.jpg.webp'),(21,'https://sneakerdaily.vn/wp-content/uploads/2023/09/26.jpg.webp'),(22,'https://sneakerdaily.vn/wp-content/uploads/2023/09/27.jpg.webp'),(23,'https://sneakerdaily.vn/wp-content/uploads/2025/10/Giay-Puma-Speedcat-Premium-%E2%80%98Rose-Black-404391-01Puma-Speedcat-Leather-%E2%80%98Rose-White-404390-01.jpg'),(24,'https://sneakerdaily.vn/wp-content/uploads/2025/10/Giay-Puma-Speedcat-Premium-%E2%80%98Rose-Black-404391-01-2.jpg'),(25,'https://sneakerdaily.vn/wp-content/uploads/2025/10/Giay-Puma-Speedcat-Premium-%E2%80%98Rose-Black-404391-01-3.jpg'),(26,'https://sneakerdaily.vn/wp-content/uploads/2025/10/Giay-Puma-Speedcat-Premium-%E2%80%98Rose-Black-404391-01-4.jpg'),(27,'https://sneakerdaily.vn/wp-content/uploads/2025/12/4-37.jpg'),(28,'https://sneakerdaily.vn/wp-content/uploads/2025/12/z7329943730237_2bfd571e55121bc1e45d4171e4042fbb-scaled.jpg'),(29,'https://sneakerdaily.vn/wp-content/uploads/2025/12/z7329943736485_53f384b6948395ca783c513f9bd48ac8-scaled.jpg'),(30,'https://sneakerdaily.vn/wp-content/uploads/2025/12/z7329943739463_3150b6db9a37616085455cc3f9653a9f-scaled.jpg'),(31,'https://sneakerdaily.vn/wp-content/uploads/2025/12/4-36.jpg'),(32,'https://sneakerdaily.vn/wp-content/uploads/2025/12/z7329900861791_26293be5940c078a6c6b60d1b6ff926c-scaled.jpg'),(33,'https://sneakerdaily.vn/wp-content/uploads/2025/12/z7329900869678_c45f3fa1d2dadd8f8823fe39949fb1bf-scaled.jpg'),(34,'https://sneakerdaily.vn/wp-content/uploads/2025/12/z7329900875109_30f7baf99c4d594f874eca242184dede-scaled.jpg'),(35,'https://cdn.hstatic.net/products/200000265619/vn000d7zy7u-01-web_218cabc074ff4c2c9d7ae245aabc9b20_1024x1024.jpg'),(36,'https://cdn.hstatic.net/products/200000265619/vn000d7zy7u-02_c45e8359a5854559a1d3204622c99d3e.jpg'),(37,'https://cdn.hstatic.net/products/200000265619/vn000d7zy7u-03_50d839de17f04acc9407c9bcd0326e41.jpg'),(38,'https://cdn.hstatic.net/products/200000265619/vn000d7zy7u-04_a9aef475c4ad49dfa2b55d08aa93ae0c.jpg'),(39,'/uploads/b407845c-c379-452d-bfc2-47f787fb6629.jpg'),(40,'/uploads/a60fa558-0060-43f8-9bc9-e687ccc04b96.jpg'),(41,'/uploads/ee8ab98f-03b8-4ea5-a430-d83ac7e61281.jpg'),(42,'/uploads/a195c106-c6fb-4823-833e-fc59f950a8b9.jpg'),(43,'/uploads/ead00224-2926-47d6-b8e9-2d887150e051.jpg'),(44,'/uploads/eba82938-9c97-409a-84bf-049115c641c0.jpg'),(45,'/uploads/236b0f56-8872-4750-8ff9-bc3518bd54dc.jpg'),(46,'/uploads/dca8b654-ea60-46fb-a5ba-10577c470585.jpg'),(47,'/uploads/3a1f3f44-31b8-42d5-8320-5d17c24a630c.jpg'),(48,'/uploads/5914f657-28f9-470c-8b86-df5fd8cde364.jpg'),(49,'/uploads/c78fb04a-ed75-402a-a43d-7e6141a31a51.jpg'),(50,'/uploads/db40823f-7b3d-40b0-a84a-bdcc31b9cde6.jpg'),(51,'/uploads/ef65efa5-86cb-4a43-8ba5-5dbed9b0ec6c.jpg'),(52,'/uploads/083d4b34-c337-41c1-b897-ff1aa0e26fe2.jpg'),(53,'/uploads/ab6a63aa-2a04-4454-9fa0-e2e9f5953935.jpg'),(54,'/uploads/0e5679ea-7c02-42f0-8ef4-46eebec9426b.jpg'),(55,'/uploads/086bfe6e-8ada-46df-8c27-a5d897aa0fa6.jpg'),(56,'/uploads/db0b70c6-0bb4-4c7e-925d-45a69f0ca1c4.jpg'),(57,'/uploads/48286283-11ef-4cc3-ae2d-bf6488e9c08b.jpg'),(58,'/uploads/3f7428a9-2307-46dc-8b6f-52698cf8e5f9.jpg'),(59,'/uploads/fa316d37-673e-406d-9039-633586316205.jpg'),(60,'/uploads/22aa4782-c8e0-4f1b-8073-ab99aeef0780.jpg'),(61,'/uploads/3013102c-fee1-4dba-9c9d-9aa43401eb3b.png');

INSERT INTO `categories` VALUES (1,'Running'),(2,'Basketball'),(3,'Lifestyle'),(4,'Skateboarding');

INSERT INTO `brands` VALUES 
(1,'Nike','Thương hiệu thể thao hàng đầu thế giới với khẩu hiệu "Just Do It". Nike luôn dẫn đầu với các dòng Air Jordan và Air Force 1 biểu tượng.',1),
(2,'Adidas','Gã khổng lồ đến từ Đức với triết lý thiết kế 3 sọc đặc trưng. Nổi tiếng với công nghệ đệm Boost êm ái và dòng Yeezy đình đám.',2),
(3,'New Balance','Biểu tượng của sự cân bằng và phong cách cổ điển. New Balance mang lại sự thoải mái tuyệt đối cho những người yêu thích vẻ đẹp bền bỉ.',3),
(4,'Vans','Vans là thương hiệu giày thể thao, đặc biệt biểu tượng cho những môn thể thao mạo hiểm, dựa trên sự trẻ trung, tính hữu dụng và nâng cao phong cách cá nhân. Tồn tại để truyền cảm hứng và khuyến khích sự sáng tạo cho giới trẻ trên toàn cầu là mục tiêu của Vans. Được thành lập vào năm 1966 bởi Paul Van Doren và sau hơn 56 năm thành lập, Vans đã có mặt trên 22 quốc gia trên toàn thế giới như Hàn quốc, Thái Lan, Philippines, Trung Quốc, Hongkong, Singapore,... ',4),
(5,'Converse','Thành lập năm 1908, thương hiệu Converse đã nổi tiếng: ’’Công ty thể thao truyền thống của Mỹ ‘’ và hãng cũng sở hữu những thiết kế kinh điển như Chuck Taylor All Star, Jack Purcell, One Star, Chuck 70s, Chuck Taylor All Star CX, Run Star Hike,... Ngày nay, Converse được ưu chuộng và trở thành biểu tượng của thời trang đường phố và có mặt trên 160 quốc gia',5),
(6,'Puma','Puma SE, có thương hiệu là Puma, là một tập đoàn đa quốc gia của Đức chuyên thiết kế và sản xuất giày dép, quần áo và phụ kiện thể thao và thông thường, có trụ sở chính tại Herzogenaurach, Bavaria, Đức. Puma là nhà sản xuất đồ thể thao lớn thứ ba trên thế giới.',6);

INSERT INTO `products` VALUES 
(1,'Giày Nike Air Force 1 Low ‘Valentine’s Day’ IQ4937-161','Nike Air Force 1 Low “Valentine’s Day” là phiên bản đặc biệt được ra mắt dành cho dịp lễ tình nhân, mang phong cách nhẹ nhàng, nữ tính nhưng vẫn giữ trọn nét cổ điển đặc trưng của dòng Air Force 1.\nPhần upper được làm từ da cao cấp, bề mặt mịn, form giày chắc chắn và giữ dáng tốt khi mang lâu. Khu vực toe box được thiết kế các lỗ thoáng khí hình trái tim, thay thế cho kiểu đục lỗ tròn truyền thống, tạo điểm nhấn chủ đề một cách tinh tế và khác biệt.\nỞ phần gót giày, Nike bổ sung các chi tiết trang trí mang cảm hứng Valentine như mảng màu xanh pastel nhẹ, kết hợp logo Nike thêu sắc nét, giúp tổng thể thiết kế thêm phần sinh động nhưng vẫn hài hòa. Một số chi tiết phụ kiện nhỏ mang hình trái tim hoặc ruy băng càng làm nổi bật tinh thần ngọt ngào của phiên bản này.',3200000.00,0,'2026-03-06 03:54:23',1,2),
(2,'Giày Nike Air Max 1 Essential ‘Black White’ FZ5808-102','Giày Nike Air Max 1 Essential ‘Black White’ FZ5808-102 là phiên bản mang phong cách cổ điển và đơn giản của mẫu giày Air Max 1 nổi tiếng. Được thiết kế với sự kết hợp tinh tế giữa hai gam màu cơ bản đen và trắng, đôi giày này dễ dàng phối hợp với nhiều phong cách khác nhau, từ thể thao đến streetwear.',3500000.00,0,'2026-03-06 03:54:23',1,1),
(3,'Giày adidas UltraBoost 22 ‘Legacy Indigo’ GX3061','Với thiết kế cải tiến và công nghệ đột phá, adidas UltraBoost 22 ‘Legacy Indigo’ là đôi giày chạy bộ lý tưởng cho những ai tìm kiếm sự kết hợp hoàn hảo giữa hiệu suất và phong cách. Được thiết kế cho các vận động viên hiện đại, đôi giày này mang đến một trải nghiệm chạy mượt mà, nhẹ nhàng, đồng thời thể hiện phong cách tinh tế nhờ vào phối màu Legacy Indigo (xanh indigo đậm) thanh lịch, dễ phối đồ và cực kỳ bắt mắt.\nPhần upper Primeknit+ siêu nhẹ và thoáng khí ôm sát chân, đồng thời cung cấp sự linh hoạt tối ưu cho từng chuyển động. Với khả năng co giãn 4 chiều, phần upper giúp bạn cảm thấy thoải mái trong từng bước chạy mà không bị gò bó, mang đến cảm giác “chân trần” dễ chịu.\nCông nghệ đệm Boost thế hệ mới vẫn là tâm điểm của UltraBoost 22, giúp tăng cường khả năng hoàn trả năng lượng, mang lại sự mềm mại và đàn hồi dưới mỗi bước chạy. Từ bước tiếp đất cho đến bước đẩy, đệm Boost giúp bạn giữ được sự ổn định và hiệu quả trong suốt hành trình dài.\nĐế ngoài của giày được làm từ cao su Continental cao cấp, nổi bật với khả năng bám sân tuyệt vời, cho bạn sự tự tin khi chạy trên nhiều bề mặt, từ đường phố đến công viên. Thiết kế đế với các rãnh linh hoạt giúp tối ưu hóa sự chuyển động và giảm thiểu sự trượt ngã trong các điều kiện thời tiết khác nhau.',4200000.00,0,'2026-03-06 03:54:23',2,1),
(4,'Giày adidas Samba OG ‘White Black Gum’ B75806','Phần upper của giày có màu trắng chủ đạo với các điểm nhấn màu đen và nâu gum. Nó có một thiết kế đơn giản và cổ điển.\nĐế giữa của giày được làm từ EVA, một loại vật liệu nhẹ và đàn hồi. Nó cung cấp khả năng hấp thụ sốc và độ êm ái cho mỗi bước chân.',2800000.00,0,'2026-03-06 03:54:23',2,2),
(5,'Giày Puma Speedcat Premium ‘Rosé Black’ 404391-01','Giày Puma Speedcat Premium ‘Rosé Black’ là phiên bản đặc biệt thuộc dòng Speedcat của Puma, được hợp tác cùng ca sĩ Rosé. Mẫu này mang đậm phong cách cổ điển của giày đua xe, kết hợp cùng chất liệu cao cấp và thiết kế tinh giản, sang trọng.',2500000.00,0,'2026-03-06 03:54:23',6,2),
(6,'Giày New Balance 530 ‘Beige Brown’ U530SUA','New Balance 530 trở lại với diện mạo mới cùng nhiều phối màu bắt mắt, mang tinh thần năng động và dễ ứng dụng hằng ngày. Phần upper kết hợp lưới thoáng khí và chất liệu tổng hợp giúp đôi chân luôn khô thoáng, thoải mái suốt cả ngày. Thiết kế đơn giản nhưng hiện đại, dễ phối đồ trong nhiều hoàn cảnh. Đệm ABZORB ở đế giữa hỗ trợ hấp thụ lực hiệu quả, mang lại cảm giác êm ái và nhẹ nhàng trong từng bước chân.',3900000.00,0,'2026-03-06 03:54:23',3,2),
(7,'Giày New Balance 1906R ‘Arid Stone’ U1906RCN','New Balance 1906R mang đậm tinh thần retro–tech đặc trưng của dòng 2000s, kết hợp hiệu năng cao và thẩm mỹ hiện đại. Đế giày tích hợp lớp đệm ACTEVA LITE nhẹ và linh hoạt, công nghệ hấp thụ sốc N-ergy cùng các miếng đệm ABZORB SBS ở gót, mang lại cảm giác êm ái và ổn định khi di chuyển. Phần upper được cấu tạo từ lưới thoáng khí kết hợp các lớp phủ tổng hợp uốn cong và chi tiết da lộn, tạo chiều sâu thiết kế và độ bền cao. Tổng thể 1906R là sự tái hiện tinh tế của ngôn ngữ thiết kế hiệu suất cao, vừa mang giá trị di sản vừa đáp ứng nhu cầu sử dụng hiện đại.',4100000.00,0,'2026-03-06 03:54:23',3,1),
(8,'Giày Vans Old Skool Pig Suede After Dark','Vans Old Skool Pig Suede là phiên bản mang nét khác biệt rõ rệt của dòng Old Skool kinh điển, với toàn bộ phần upper làm từ 100% Leather – da lộn Pig Suede. Chất da lộn mịn, bề mặt đều màu giúp đôi giày có chiều sâu thị giác và cảm giác cao cấp ngay từ cái nhìn đầu tiên.\nThiết kế vẫn giữ phom cổ thấp đặc trưng của Old Skool, với dải logo Sidestripe™ màu trắng chạy dọc thân giày, tạo điểm tương phản rõ nét trên nền da lộn sẫm màu. Các mảng panel được cắt may gọn gàng, đường chỉ chắc chắn giúp form giày đứng và ôm chân ổn định. Phần cổ giày có đệm nhẹ, hỗ trợ tốt khi mang trong thời gian dài. Phần đế giữa và thành giày bằng cao su trắng mang lại sự cân bằng cho thiết kế, đồng thời giữ nguyên kết cấu lưu hóa truyền thống của Vans. Đế ngoài waffle đặc trưng tiếp tục đảm bảo độ bám và độ ổn định, đúng tinh thần của dòng Old Skool từ năm 1977.',2100000.00,0,'2026-03-06 03:54:23',4,4),
(9,'Giày Vans Knu Skool In the Shadows','Knu Skool In the Shadows là sự hòa quyện giữa phong cách cổ điển của thập niên 90 và xu hướng hiện đại, mang đến vẻ ngoài đen trắng cơ bản nhưng đầy cuốn hút. Lấy cảm hứng từ thiết kế Puffy, đôi giày gây ấn tượng với lưỡi giày phồng, cổ giày đệm dày và dải logo Sidestripe đúc 3D độc đáo, tạo nên diện mạo vừa cổ điển vừa táo bạo.\n\nThân giày được làm từ sự kết hợp giữa chất liệu da lộn bền chắc và vải, mang lại cảm giác thoải mái và độ bền vượt trội. Dây buộc to bản tạo điểm nhấn mạnh mẽ, cùng chi tiết phần cứng hình đầu lâu độc đáo làm tăng tính cá tính cho đôi giày. Đế ngoài như bánh waffle cao su đặc trưng của Vans đảm bảo độ bám tốt và độ bền lâu dài, phù hợp cho mọi hoạt động.\n\nChất liệu: 78.38% Da, 21.62% Vải\nMàu sắc: WHITE/BLACK',1800000.00,0,'2026-03-19 14:06:00',4,4),
(10,'Giày Vans Super Lowpro Vivid Verdant/Space Yellow','Vans Super LowPro phiên bản này thuộc dòng TIER 2 SUPER LOWPRO vẫn mang thiết kế giữ đúng tinh thần “thấp – nhẹ – linh hoạt” với phom dáng siêu thấp phát triển từ Serio Style 84, tạo cảm giác chân gần sát mặt đất nhưng vẫn có độ đệm vừa đủ để di chuyển thoải mái hằng ngày. Tổng thể form gọn, thân giày thuôn dài, cổ thấp và dáng retro đặc trưng.\n\nPhần upper làm từ 100% Leather giúp đôi giày giữ form ổn định và tăng độ bền trong quá trình sử dụng. Lưỡi gà có đệm tạo cảm giác êm chân, kết hợp mũi giày chắc chắn và chi tiết đục lỗ hai bên thân giúp tăng độ thoáng khí khi di chuyển.\n\nDấu ấn nhận diện của dòng Super LowPro nằm ở dải SideStripe™ phối màu tương phản chạy dọc thân giày, đi cùng tag “Serio” Heritage trên lưỡi gà như một chi tiết đặc trưng. Bên dưới, phom đế thấp hỗ trợ chuyển động linh hoạt, trong khi đế ngoài cao su hoạ tiết tổ ong đặc trưng của Vans giúp tăng độ bám trên nhiều bề mặt.\n\nChất liệu: 100% Leather\n\nMàu sắc: VIVID VERDANT/SPACE YELLOW',2430000.00,0,'2026-03-19 14:23:40',4,4),
(11,'Test Product','hahihihihihi dadad',2345678.00,1,'2026-03-19 16:55:57',2,2),
(12,'Giày adidas Superstar II Unisex Cloud White','Giày adidas Superstar II Unisex Cloud White (mã sản phẩm JI0080) là một phiên bản nổi bật của mẫu giày classic adidas Superstar, nổi bật với thiết kế cổ điển và sự kết hợp màu sắc thanh lịch. Dưới đây là những đặc điểm chi tiết của đôi giày này:\n\n1. Màu sắc:\nCloud White: Màu trắng chủ đạo của giày mang đến vẻ ngoài sáng sủa, tươi mới, dễ dàng kết hợp với nhiều trang phục khác nhau.\nCác chi tiết như ba sọc đặc trưng của adidas và mũi giày (shell toe) được giữ nguyên màu sắc trắng hoặc đen, tạo nên sự tương phản đẹp mắt và nổi bật.\n2. Chất liệu:\nUpper: Giày được làm từ chất liệu da cao cấp, bền bỉ và dễ dàng vệ sinh, giúp bảo vệ đôi giày khỏi bụi bẩn và mài mòn. Da chất lượng cao giúp giày có độ bề',2690000.00,0,'2026-03-19 17:04:04',2,3),
(13,'Giày test 2','Giày test 2',2690000.00,0,'2026-03-19 17:08:57',2,3),
(14,'Giày test 3','Giày test 3',2690000.00,0,'2026-03-19 17:11:36',2,3),
(15,'Giày test 2 được update nè','Update rồi này 3',3500001.00,0,'2026-03-19 20:10:32',2,3),
(16,'Giày test 4','Giày test 4 đó nha a hihihi ',2242000.00,0,'2026-03-19 20:23:23',2,3);

INSERT INTO `product_image` VALUES (1,7),(1,8),(1,9),(1,10),(2,11),(2,12),(2,13),(2,14),(3,15),(3,16),(3,17),(3,18),(4,19),(4,20),(4,21),(4,22),(5,23),(5,24),(5,25),(5,26),(6,27),(6,28),(6,29),(6,30),(7,31),(7,32),(7,33),(7,34),(8,35),(8,36),(8,37),(8,38),(9,39),(9,40),(9,41),(9,42),(10,43),(10,44),(10,45),(10,46),(11,47),(11,48),(12,49),(13,50),(14,51),(14,52),(15,53),(15,54),(15,55),(15,56),(16,57),(16,58),(16,59),(16,60);

INSERT INTO `product_variants` VALUES (1,'38','White',1),(2,'39','White',1),(3,'40','White',1),(4,'41','White',1),(5,'42','White',1),(6,'43','White',1),(7,'44','White',1),(8,'45','White',1),(9,'39','Black White',2),(10,'40','Black White',2),(11,'41','Black White',2),(12,'42','Black White',2),(13,'43','Black White',2),(14,'44','Black White',2),(15,'45','Black White',2),(16,'38','Legacy Indigo',3),(17,'39','Legacy Indigo',3),(18,'40','Legacy Indigo',3),(19,'41','Legacy Indigo',3),(20,'42','Legacy Indigo',3),(21,'43','Legacy Indigo',3),(22,'39','White Black',4),(23,'40','White Black',4),(24,'41','White Black',4),(25,'42','White Black',4),(26,'43','White Black',4),(27,'44','White Black',4),(28,'38','Black White',5),(29,'39','Black White',5),(30,'40','Black White',5),(31,'41','Black White',5),(32,'42','Black White',5),(33,'43','Black White',5),(34,'38','Pink',6),(35,'39','Pink',6),(36,'40','Pink',6),(37,'41','Pink',6),(38,'42','Pink',6),(39,'38','Silver',7),(40,'39','Silver',7),(41,'40','Silver',7),(42,'41','Silver',7),(43,'42','Silver',7),(44,'43','Silver',7),(45,'44','Silver',7),(46,'45','Silver',7),(47,'39','Brown Dark',8),(48,'40','Brown Dark',8),(49,'41','Brown Dark',8),(50,'42','Brown Dark',8),(51,'43','Brown Dark',8),(52,'44','Brown Dark',8),(53,'39','Pink',11),(54,'40','White',12),(55,'40','White',13),(56,'40','White',14),(60,'40','White',15),(61,'41','White',15),(62,'42','White',15);

INSERT INTO `inventory` VALUES (1,20,'2026-03-18 10:34:08',1),(2,15,'2026-03-18 10:34:08',2),(3,30,'2026-03-18 10:34:08',3),(4,25,'2026-03-18 10:34:08',4),(5,18,'2026-03-18 10:34:08',5),(6,20,'2026-03-18 10:34:08',6),(7,25,'2026-03-18 10:34:08',7),(8,30,'2026-03-18 10:34:08',8),(9,15,'2026-03-18 10:34:08',9),(10,10,'2026-03-18 10:34:08',10),(11,15,'2026-03-18 10:34:08',11),(12,19,'2026-03-18 10:34:08',12),(13,18,'2026-03-18 10:34:08',13),(14,22,'2026-03-18 10:34:08',14),(15,25,'2026-03-18 10:34:08',15),(16,30,'2026-03-18 10:34:08',16),(17,20,'2026-03-18 10:34:08',17),(18,15,'2026-03-18 10:34:08',18),(19,12,'2026-03-18 10:34:08',19),(20,18,'2026-03-18 10:34:08',20),(21,20,'2026-03-18 10:34:08',21),(22,15,'2026-03-18 10:34:08',22),(23,10,'2026-03-18 10:34:08',23),(24,12,'2026-03-18 10:34:08',24),(25,15,'2026-03-18 10:34:08',25),(26,30,'2026-03-18 10:34:08',26),(27,25,'2026-03-18 10:34:08',27),(28,20,'2026-03-18 10:34:08',28),(29,12,'2026-03-18 10:34:08',29),(30,8,'2026-03-18 10:34:08',30),(31,15,'2026-03-18 10:34:08',31),(32,20,'2026-03-18 10:34:08',32),(33,5,'2026-03-18 10:34:08',33),(34,10,'2026-03-18 10:34:08',34),(35,25,'2026-03-18 10:34:08',35),(36,18,'2026-03-18 10:34:08',36),(37,30,'2026-03-18 10:34:08',37),(38,14,'2026-03-18 10:34:08',38),(39,7,'2026-03-18 10:34:08',39),(40,12,'2026-03-18 10:34:08',40),(41,20,'2026-03-18 10:34:08',41),(42,15,'2026-03-18 10:34:08',42),(43,10,'2026-03-18 10:34:08',43),(44,8,'2026-03-18 10:34:08',44),(45,11,'2026-03-18 10:34:08',45),(46,19,'2026-03-18 10:34:08',46),(47,22,'2026-03-18 10:34:08',47),(48,15,'2026-03-18 10:34:08',48),(49,30,'2026-03-18 10:34:08',49),(50,25,'2026-03-18 10:34:08',50),(51,10,'2026-03-18 10:34:08',51),(52,12,'2026-03-18 10:34:08',52),(53,36,'2026-03-19 16:55:58',53),(54,12,'2026-03-19 17:04:04',54),(55,12,'2026-03-19 17:08:57',55),(56,12,'2026-03-19 17:11:36',56),(57,100,'2026-03-19 20:52:54',60),(58,30,'2026-03-19 20:22:37',61),(59,20,'2026-03-19 20:22:37',62);

-- ==========================================================
-- 4. INSERT 2 TÀI KHOẢN TINH GỌN (Admin & Antony)
-- ==========================================================

INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'USER');

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `gender`, `phone`, `avatar_url`, `province_city`, `district`, `ward`, `house_number_street`, `status`, `created_at`) VALUES 
(1,'admin@sneaker.com','$2a$10$wNFZEDibVpkO1EXYaQDwKO4Ybxwik8on4YIZEA4MHgX5xLZZahYsO','Admin Kai Sneaker',NULL,'0366745129',NULL,NULL,NULL,NULL,NULL,'ACTIVE',NOW()),
(2,'Antony@gmail.com','$2a$10$wNFZEDibVpkO1EXYaQDwKO4Ybxwik8on4YIZEA4MHgX5xLZZahYsO','Antony','Nam','0999999999','http://localhost:8080/uploads/884cbf5c-6b9d-4a87-89d1-810857e49a21_z7435123526551_6c05c81460d9844c53ae4516a24cab08.jpg','An Giang','Sơn Trà','Thái Ất','Số 16 Ngõ 22/12','ACTIVE',NOW());

INSERT INTO `user_roles` VALUES (1,1),(2,2);

-- ==========================================================
-- 5. ĐỒNG BỘ GIỎ HÀNG, ĐƠN HÀNG VÀ WISHLIST CHO 2 TÀI KHOẢN
-- ==========================================================

-- Tạo giỏ hàng sạch sẽ
INSERT INTO `cart` (`id`, `user_id`, `created_at`) VALUES (1,1,NOW()),(2,2,NOW());

-- Giữ nguyên đống giày xịn của Antony trong giỏ (Cart ID: 2)
INSERT INTO `cart_items` (`id`, `cart_id`, `variant_id`, `quantity`) VALUES (1,2,60,1),(2,2,55,1),(3,2,15,1),(4,2,13,1),(5,2,34,1);

-- Phương thức thanh toán
INSERT INTO `payment_method` VALUES (1,'COD','Thanh toán khi nhận hàng'),(2,'Bank Transfer','Chuyển khoản ngân hàng: 80369335908 - TPBank (Ngân hàng TMCP Tiên Phong) - Nguyễn Quang Hào');

-- Chia đơn hàng cho 2 người (1 của Admin, 1 của Antony)
INSERT INTO `orders` (`id`, `total_amount`, `order_status`, `payment_status`, `shipping_address`, `created_at`, `user_id`, `payment_method_id`, `full_name`, `note`, `phone`) VALUES 
(1,3200000.00,'DELIVERED','PAID','To 4, Ha dong, Hanoi',NOW(),1,1,'Admin','Giao giờ hành chính','0366745129'),
(2,3500000.00,'CONFIRMED','UNPAID','Ngã tư lục quân Hòa Lạc',NOW(),2,2,'Antony','Giao xong gửi stk e ck','0999999999');

-- Chi tiết đơn hàng
INSERT INTO `order_items` (`id`, `unit_price`, `quantity`, `order_id`, `variant_id`) VALUES (1,3200000.00,1,1,3),(2,3500000.00,1,2,12);

-- Wishlist của Antony
INSERT INTO `wishlist` VALUES (2,1),(2,13),(2,16);

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- KẾT THÚC DEMO SCRIPT