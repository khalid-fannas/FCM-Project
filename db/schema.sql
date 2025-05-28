USE fcm_system;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `work_email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` Enum('super_admin','admin','hr','data_entry' , "employee") DEFAULT 'employee' NOT NULL,
);

CREATE TABLE `employees` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone_number` bigint NOT NULL,
  `address` varchar(255) NOT NULL,
  `personal_picture` varchar(255) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `position_name` varchar(255) NOT NULL,
  `shift_id` int NOT NULL,
  `hire_date` date NOT NULL,
  `salary_base` decimal NOT NULL,
  `status` Enum('active','inactive') NOT NULL default 'active'
);

CREATE TABLE vehicles (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vehicle_type` VARCHAR(100) NOT NULL,
  `model` VARCHAR(255) NOT NULL,
  `manufacture_date` VARCHAR(255) NOT NULL,
  `vin_number` VARCHAR(255) UNIQUE NOT NULL,
  `exterior_color` VARCHAR(100) NOT NULL,
  `interior_color` VARCHAR(100) NOT NULL,
  `mileage` INT NOT NULL,
  `purchase_price` DECIMAL(10,2) NOT NULL,
  `market_price` DECIMAL(10,2) NOT NULL,
  `purchased_from` VARCHAR(255) NOT NULL,
  `purchase_date` DATE NOT NULL,
  `purchase_team` VARCHAR(255) NOT NULL,
  `approved_by` varchar(255) NOT NULL,
  `status` Enum('sent', 'not_sent') NOT NULL DEFAULT 'not_sent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `buyer_id` INT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT,
);

CREATE TABLE `shifts` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
);

CREATE TABLE `salaries` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `base_salary` decimal NOT NULL
);

CREATE TABLE `bonuses` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  `bonus_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE `deductions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `amount` decimal NOT NULL,
  `reason` text,
  `deduction_date` date NOT NULL
);

CREATE TABLE `attendances` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `shifts_id` int,
  `date` date NOT NULL,
  `check_in` time,
  `check_out` time
);

CREATE TABLE `violations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` Enum('verbal_warning','first_warning','final_warning','termination') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_by` int,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `violations_employees_record` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `reported_by` int NOT NULL,
  `offender_id` int NOT NULL,
  `violation_id` int NOT NULL,
  `reason` text,
  `reason_type` ENUM('lateness', 'manual', 'other') DEFAULT 'manual'
);

CREATE TABLE `late_entries` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `minutes_late` int NOT NULL,
  `reason` text,
  `excuse` Enum('approved','rejected') default 'rejected',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `violation_linked` BOOLEAN DEFAULT FALSE,
  `created_by` int NOT NULL,
  `updated_by` int,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `users` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

ALTER TABLE `employees` ADD FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`);

ALTER TABLE `vehicles` ADD FOREIGN KEY (`buyer_id`) REFERENCES `employees` (`id`);

ALTER TABLE `vehicles` ADD FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`);

ALTER TABLE `salaries` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `bonuses` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `bonuses` ADD FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

ALTER TABLE `deductions` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `attendances` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `attendances` ADD FOREIGN KEY (`shifts_id`) REFERENCES `shifts` (`id`);

ALTER TABLE `violations` ADD FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`);

ALTER TABLE `violations` ADD FOREIGN KEY (`updated_by`) REFERENCES `employees` (`id`);

ALTER TABLE `violations_employees_record` ADD FOREIGN KEY (`reported_by`) REFERENCES `employees` (`id`);

ALTER TABLE `violations_employees_record` ADD FOREIGN KEY (`offender_id`) REFERENCES `employees` (`id`);

ALTER TABLE `violations_employees_record` ADD FOREIGN KEY (`violation_id`) REFERENCES `violations` (`id`);

ALTER TABLE `late_entries` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

ALTER TABLE `late_entries` ADD FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`);

ALTER TABLE `late_entries` ADD FOREIGN KEY (`updated_by`) REFERENCES `employees` (`id`);

ALTER TABLE violations ADD COLUMN weight FLOAT GENERATED ALWAYS AS (
  CASE 
    WHEN type = 'verbal_warning' THEN 0.5
    WHEN type = 'first_warning' THEN 1
    WHEN type = 'final_warning' THEN 2
    WHEN type = 'termination' THEN 99
    ELSE NULL
  END
) STORED;

