-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2025 at 02:49 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `building_name` varchar(255) NOT NULL,
  `building_image` varchar(255) NOT NULL,
  `building_address` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `property_type` enum('Commercial','Residential','Mixed') NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `owner_phone` varchar(50) NOT NULL,
  `owner_address` varchar(255) NOT NULL,
  `suspended` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`id`, `building_name`, `building_image`, `building_address`, `location`, `property_type`, `owner_email`, `owner_phone`, `owner_address`, `suspended`, `created_at`) VALUES
(3, 'Sunset Apartments', 'sunset.jpg', '123 Sunset Blvd', 'California', 'Residential', 'owner@example.com', '1234567890', '456 Owner St', 0, '2025-03-01 07:57:15');

-- --------------------------------------------------------

--
-- Table structure for table `stalls`
--

CREATE TABLE `stalls` (
  `id` int(11) NOT NULL,
  `stallCode` varchar(50) NOT NULL,
  `rooms` varchar(255) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `monthlyRent` decimal(10,2) DEFAULT NULL,
  `eeuReader` varchar(255) DEFAULT NULL,
  `building_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stalls`
--

INSERT INTO `stalls` (`id`, `stallCode`, `rooms`, `size`, `monthlyRent`, `eeuReader`, `building_id`, `created_at`) VALUES
(1, 'GROUND', 'ROM12', '656858', 4000.00, '1000', 3, '2025-03-07 09:47:17'),
(2, 'Flor', 'rom1', '656858', 500.00, '79669', 3, '2025-03-07 10:32:54'),
(3, 'mid', 'mR', '5676', 8000.00, '1000', 3, '2025-03-07 10:33:29'),
(4, 'sho', 'cs', '587', 500.00, '1000', 3, '2025-03-07 12:18:04'),
(5, 'Up', 'uR', '587', 500.00, '1000', 3, '2025-03-08 10:53:50');

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(50) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `sex` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `subcity` varchar(100) DEFAULT NULL,
  `woreda` varchar(100) DEFAULT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `room` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `payment_term` varchar(50) DEFAULT NULL,
  `deposit` decimal(10,2) DEFAULT NULL,
  `lease_start` date DEFAULT NULL,
  `lease_end` date DEFAULT NULL,
  `registered_by_agent` tinyint(1) DEFAULT 0,
  `authentication_no` varchar(100) DEFAULT NULL,
  `agent_first_name` varchar(255) DEFAULT NULL,
  `agent_sex` varchar(50) DEFAULT NULL,
  `agent_phone` varchar(50) DEFAULT NULL,
  `agent_city` varchar(100) DEFAULT NULL,
  `agent_subcity` varchar(100) DEFAULT NULL,
  `agent_woreda` varchar(100) DEFAULT NULL,
  `agent_house_no` varchar(50) DEFAULT NULL,
  `eeu_payment` tinyint(1) DEFAULT 0,
  `generator_payment` tinyint(1) DEFAULT 0,
  `water_payment` tinyint(1) DEFAULT 0,
  `terminated` tinyint(1) DEFAULT 0,
  `building_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`id`, `tenant_id`, `full_name`, `sex`, `phone`, `city`, `subcity`, `woreda`, `house_no`, `room`, `price`, `payment_term`, `deposit`, `lease_start`, `lease_end`, `registered_by_agent`, `authentication_no`, `agent_first_name`, `agent_sex`, `agent_phone`, `agent_city`, `agent_subcity`, `agent_woreda`, `agent_house_no`, `eeu_payment`, `generator_payment`, `water_payment`, `terminated`, `building_id`, `created_at`) VALUES
(37, 'TT12', 'Seid Abdela', 'male', '0923797665', 'adis', 'yeka', '14', '105', '1', NULL, '3 months', 57.00, '2025-03-07', '2025-03-20', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 1, 3, '2025-03-07 09:49:06'),
(39, '09', 'abe', 'male', '09090', 'ad', 'y', '7', '78', '2', NULL, '3 months', 57.00, '2025-01-07', '2026-04-16', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 3, '2025-03-07 10:34:45'),
(40, 'EE', 'abebe', 'male', '090909090909', 'adis', 'lemi', '14', '12', '3', NULL, '6 months', 57.00, '2025-03-07', '2026-04-17', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 3, '2025-03-07 12:14:59'),
(41, 'ss', 'kebde', 'male', '09337000', 'adis', 'yeka abado', '14', '79', '4', NULL, '12 months', NULL, '2025-03-07', '2026-04-29', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 3, '2025-03-07 12:19:21'),
(42, 'TR', 'deb', 'male', '093333333', 'ad', 'y', '7', '78', '5', NULL, '3 months', 57.00, '2025-03-08', '2026-04-30', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, 0, 3, '2025-03-08 10:55:12'),
(43, 'AA', 'SEEE', 'male', '09090909', 'adiss', 'yeka', '14', '56', '1', NULL, '2 months', 656.00, '2025-03-08', '2026-04-15', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 3, '2025-03-08 12:58:29');

-- --------------------------------------------------------

--
-- Table structure for table `tenant_utility_usage`
--

CREATE TABLE `tenant_utility_usage` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `utility_type` enum('electricity','water','generator') NOT NULL,
  `previous_reading` decimal(10,2) NOT NULL,
  `current_reading` decimal(10,2) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `billing_date` date DEFAULT curdate(),
  `utility_status` varchar(20) DEFAULT 'Pending',
  `payment_proof_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `penalty` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tenant_utility_usage`
--

INSERT INTO `tenant_utility_usage` (`id`, `tenant_id`, `utility_type`, `previous_reading`, `current_reading`, `rate`, `cost`, `billing_date`, `utility_status`, `payment_proof_link`, `created_at`, `penalty`) VALUES
(121, 42, 'water', 20.00, 30.00, 4.00, 40.00, '2025-03-08', 'Approved', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAwFBMVEX///9gvmryq0dgvWpYu2JRuVyf1aRcvGZQuVtUul9Xu2H8/vy23rnu+O/3+/em2Kro9elBtE7D5MXZ7tv+9uz++vTyqD3M6M786tTy+fLh8eL74cP627fypzrypTSZ057979751at2xX2w3LORz5Zuw3b3ypL1vXS+4sHwmwD98eL2xYb40', '2025-02-01 13:36:09', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `utility_rates`
--

CREATE TABLE `utility_rates` (
  `id` int(11) NOT NULL,
  `electricity_rate` decimal(10,2) NOT NULL,
  `water_rate` decimal(10,2) NOT NULL,
  `generator_rate` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utility_rates`
--

INSERT INTO `utility_rates` (`id`, `electricity_rate`, `water_rate`, `generator_rate`, `created_at`) VALUES
(1, 2.50, 4.00, 4.00, '2025-03-01 12:46:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stalls`
--
ALTER TABLE `stalls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stallCode` (`stallCode`),
  ADD KEY `fk_stall_building` (`building_id`);

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tenant_building` (`building_id`);

--
-- Indexes for table `tenant_utility_usage`
--
ALTER TABLE `tenant_utility_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tenant_usage` (`tenant_id`);

--
-- Indexes for table `utility_rates`
--
ALTER TABLE `utility_rates`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stalls`
--
ALTER TABLE `stalls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tenants`
--
ALTER TABLE `tenants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `tenant_utility_usage`
--
ALTER TABLE `tenant_utility_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `utility_rates`
--
ALTER TABLE `utility_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stalls`
--
ALTER TABLE `stalls`
  ADD CONSTRAINT `fk_stall_building` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenants`
--
ALTER TABLE `tenants`
  ADD CONSTRAINT `fk_tenant_building` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_utility_usage`
--
ALTER TABLE `tenant_utility_usage`
  ADD CONSTRAINT `fk_tenant_usage` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
