-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 19, 2026 at 12:09 AM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel13DB`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `guest_id` bigint(20) UNSIGNED NOT NULL,
  `booking_reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `total_guests` int(11) NOT NULL DEFAULT '1',
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','checked_in','checked_out','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `special_requests` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `hotel_id`, `room_id`, `guest_id`, `booking_reference`, `check_in_date`, `check_out_date`, `total_guests`, `total_price`, `status`, `special_requests`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'BK-GP-001', '2026-04-19', '2026-04-22', 2, '297.00', 'confirmed', 'Early check-in preferred', '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 1, 6, 2, 'BK-GP-002', '2026-04-24', '2026-04-27', 1, '447.00', 'pending', NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(4, 3, 37, 3, 'BK-69E3813022C37', '2026-04-18', '2026-04-20', 2, '0.00', 'confirmed', NULL, '2026-04-18 05:03:44', '2026-04-18 05:04:06');

-- --------------------------------------------------------

--
-- Table structure for table `booking_services`
--

CREATE TABLE `booking_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `booking_services`
--

INSERT INTO `booking_services` (`id`, `booking_id`, `service_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, '25.00', '2026-04-17 15:31:45', '2026-04-17 15:31:45');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-8c89b73888959ec7264708bdab42bf70', 'i:2;', 1776518428),
('laravel-cache-8c89b73888959ec7264708bdab42bf70:timer', 'i:1776518428;', 1776518428);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guests`
--

CREATE TABLE `guests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `guests`
--

INSERT INTO `guests` (`id`, `hotel_id`, `first_name`, `last_name`, `email`, `phone`, `country`, `id_type`, `id_number`, `date_of_birth`, `address`, `created_at`, `updated_at`) VALUES
(1, 1, 'Michael', 'Johnson', 'michael.johnson@email.com', '+1 555-1001', 'USA', 'passport', 'US123456789', NULL, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 1, 'Emily', 'Davis', 'emily.davis@email.com', '+1 555-1002', 'Canada', 'passport', 'CA987654321', NULL, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 3, 'clydey', 'Ednalan', 'clydey@gmail.com', '234234234', 'Philippines', 'drivers_license', '34324234', '2026-04-18', 'Olongapo City zambales', '2026-04-18 04:42:51', '2026-04-18 04:43:09');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `star_rating` int(11) NOT NULL DEFAULT '3',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `address`, `city`, `country`, `phone`, `email`, `star_rating`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Grand Plaza Hotel', '123 Main Street', 'New York', 'USA', '+1 555-0100', 'info@grandplaza.com', 5, 'Luxury hotel in the heart of Manhattan', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 'Seaside Resort', '456 Beach Road', 'Miami', 'USA', '+1 555-0200', 'info@seasideresort.com', 4, 'Beautiful beachfront resort', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 'Mountain View Lodge', '789 Mountain Ave', 'Denver', 'USA', '+1 555-0300', 'info@mountainview.com', 3, 'Cozy mountain retreat', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(5, 'ABC Hotel', 'Manila', 'manila', 'PHilippines', '123456678', 'abcinfo@test.com', 5, 'ABC hotel', 0, '2026-04-18 04:28:00', '2026-04-18 04:28:53');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_user`
--

CREATE TABLE `hotel_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('admin','manager','receptionist','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hotel_user`
--

INSERT INTO `hotel_user` (`id`, `hotel_id`, `user_id`, `role`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'admin', '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 2, 1, 'admin', '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 3, 1, 'admin', '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(4, 1, 2, 'manager', '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(5, 1, 3, 'receptionist', '2026-04-17 15:31:45', '2026-04-17 15:31:45');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_04_18_000001_create_hotels_table', 1),
(5, '2025_04_18_000002_create_room_types_table', 1),
(6, '2025_04_18_000003_create_rooms_table', 1),
(7, '2025_04_18_000004_create_guests_table', 1),
(8, '2025_04_18_000005_create_bookings_table', 1),
(9, '2025_04_18_000006_create_payments_table', 1),
(10, '2025_04_18_000007_create_services_table', 1),
(11, '2025_04_18_000008_create_hotel_user_table', 1),
(12, '2025_04_18_000009_create_booking_services_table', 1),
(13, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','credit_card','debit_card','bank_transfer','online') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','completed','failed','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `amount`, `payment_method`, `status`, `transaction_id`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, '297.00', 'credit_card', 'completed', 'TXN-69e2c2e1af4ac', NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 2, '447.00', 'bank_transfer', 'pending', NULL, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `room_type_id` bigint(20) UNSIGNED NOT NULL,
  `room_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `hotel_id`, `room_type_id`, `room_number`, `floor`, `description`, `is_available`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '101', '1', 'sampletest', 0, '2026-04-17 15:31:45', '2026-04-17 17:13:36'),
(2, 1, 1, '201', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 1, 1, '301', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(4, 1, 1, '401', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(5, 1, 1, '501', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(6, 1, 2, '102', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(7, 1, 2, '202', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(8, 1, 2, '302', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(9, 1, 2, '402', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(10, 1, 3, '103', '3', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(11, 1, 3, '203', '3', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(12, 2, 4, '101', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(13, 2, 4, '201', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(14, 2, 4, '301', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(15, 2, 4, '401', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(16, 2, 4, '501', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(17, 2, 5, '102', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(18, 2, 5, '202', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(19, 2, 5, '302', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(20, 2, 5, '402', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(21, 2, 6, '103', '3', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(22, 2, 6, '203', '3', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(23, 3, 7, '101', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(24, 3, 7, '201', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(25, 3, 7, '301', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(26, 3, 7, '401', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(27, 3, 7, '501', '1', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(28, 3, 8, '102', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(29, 3, 8, '202', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(30, 3, 8, '302', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(31, 3, 8, '402', '2', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(32, 3, 9, '103', '3', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(33, 3, 9, '203', '3', NULL, 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(37, 3, 9, '105', '1', 'sample', 1, '2026-04-17 17:12:47', '2026-04-17 17:13:01'),
(38, 2, 6, '106', '1', 'sample description', 0, '2026-04-17 17:14:59', '2026-04-18 04:02:00');

-- --------------------------------------------------------

--
-- Table structure for table `room_types`
--

CREATE TABLE `room_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price_per_night` decimal(10,2) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT '2',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_types`
--

INSERT INTO `room_types` (`id`, `hotel_id`, `name`, `description`, `price_per_night`, `capacity`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'Standard Room', 'Comfortable standard room with essential amenities', '99.00', 2, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 1, 'Deluxe Room', 'Spacious deluxe room with city view', '149.00', 2, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 1, 'Executive Suite', 'Luxury suite with separate living area', '249.00', 4, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(4, 2, 'Standard Room', 'Comfortable standard room with essential amenities', '99.00', 2, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(5, 2, 'Deluxe Room', 'Spacious deluxe room with city view', '149.00', 2, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(6, 2, 'Executive Suite', 'Luxury suite with separate living area', '249.00', 4, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(7, 3, 'Standard Room', 'Comfortable standard room with essential amenities', '99.00', 2, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(8, 3, 'Deluxe Room', 'Spacious deluxe room with city view', '149.00', 2, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(9, 3, 'Executive Suite', 'Luxury suite with separate living area', '249.00', 4, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `hotel_id`, `name`, `description`, `price`, `category`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Breakfast', 'Daily breakfast buffet', '25.00', 'food', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 1, 'Airport Shuttle', 'Airport pickup and drop service', '50.00', 'transport', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 1, 'Spa Treatment', '60-minute massage', '80.00', 'wellness', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(4, 1, 'Room Service', 'In-room dining service', '15.00', 'food', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(5, 2, 'Breakfast', 'Daily breakfast buffet', '25.00', 'food', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(6, 2, 'Airport Shuttle', 'Airport pickup and drop service', '50.00', 'transport', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(7, 2, 'Spa Treatment', '60-minute massage', '80.00', 'wellness', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(8, 2, 'Room Service', 'In-room dining service', '15.00', 'food', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(9, 3, 'Breakfast', 'Daily breakfast buffet', '25.00', 'food', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(10, 3, 'Airport Shuttle', 'Airport pickup and drop service', '50.00', 'transport', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(11, 3, 'Spa Treatment', '60-minute massage', '80.00', 'wellness', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(12, 3, 'Room Service', 'In-room dining service', '15.00', 'food', 1, '2026-04-17 15:31:45', '2026-04-17 15:31:45');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('G6F2UaQquiiUFO81WVPER0Oce3GQ208PgBC4eUWE', 1, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJqZUNYeVNST29rV3RiTXVNcXFsVFIwN1dOaHhTbHRKc1Z3ZEZIOGtEIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9ib29raW5nc1wvZ3Vlc3RzP2hvdGVsX2lkPTMiLCJyb3V0ZSI6ImJvb2tpbmdzLmd1ZXN0cyJ9fQ==', 1776518646);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'System Admin', 'admin@hotelsystem.com', NULL, '$2y$12$Hw95Fnjhb/fVAjtG6UABgeWqrXdMyD5OxlgF.gXllphMMkjRvlGI2', NULL, NULL, NULL, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(2, 'John Manager', 'john@grandplaza.com', NULL, '$2y$12$.BDuOyR3AOqL7ldBKho23OYvwrHl8bPgEGPtviL2FfRoWUiD8IxRi', NULL, NULL, NULL, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45'),
(3, 'Sarah Reception', 'sarah@grandplaza.com', NULL, '$2y$12$84hmW6gnOWnftZqQawrf..4GBs6ul/Tv7u1KzuYKMBAZXhFuRtjzW', NULL, NULL, NULL, NULL, '2026-04-17 15:31:45', '2026-04-17 15:31:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookings_booking_reference_unique` (`booking_reference`),
  ADD KEY `bookings_hotel_id_foreign` (`hotel_id`),
  ADD KEY `bookings_room_id_foreign` (`room_id`),
  ADD KEY `bookings_guest_id_foreign` (`guest_id`);

--
-- Indexes for table `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_services_booking_id_service_id_unique` (`booking_id`,`service_id`),
  ADD KEY `booking_services_service_id_foreign` (`service_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `guests`
--
ALTER TABLE `guests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guests_hotel_id_foreign` (`hotel_id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotel_user`
--
ALTER TABLE `hotel_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hotel_user_hotel_id_user_id_unique` (`hotel_id`,`user_id`),
  ADD KEY `hotel_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_booking_id_foreign` (`booking_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rooms_hotel_id_room_number_unique` (`hotel_id`,`room_number`),
  ADD KEY `rooms_room_type_id_foreign` (`room_type_id`);

--
-- Indexes for table `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_types_hotel_id_foreign` (`hotel_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_hotel_id_foreign` (`hotel_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `booking_services`
--
ALTER TABLE `booking_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guests`
--
ALTER TABLE `guests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hotel_user`
--
ALTER TABLE `hotel_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `room_types`
--
ALTER TABLE `room_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_guest_id_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_services_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `guests`
--
ALTER TABLE `guests`
  ADD CONSTRAINT `guests_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hotel_user`
--
ALTER TABLE `hotel_user`
  ADD CONSTRAINT `hotel_user_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hotel_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rooms_room_type_id_foreign` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `room_types`
--
ALTER TABLE `room_types`
  ADD CONSTRAINT `room_types_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
