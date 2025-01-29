-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 28, 2025 at 10:12 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskr`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `category_user_id`) VALUES
(1, 'Work', NULL),
(2, 'Personal', NULL),
(3, 'Urgent', NULL),
(4, 'Home', NULL),
(5, 'Health', NULL),
(6, 'Shopping', NULL),
(7, 'Study', NULL),
(8, 'Hobby', NULL),
(9, 'Butt Stuff', 13);

-- --------------------------------------------------------

--
-- Table structure for table `list_item`
--

CREATE TABLE `list_item` (
  `list_item_id` int(11) NOT NULL,
  `list_item_task_id` int(11) NOT NULL,
  `list_item_name` varchar(255) NOT NULL,
  `list_item_quantity` varchar(255) NOT NULL,
  `list_item_store` varchar(255) NOT NULL,
  `list_item_complete` tinyint(1) NOT NULL DEFAULT '0',
  `list_item_created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `list_item_last_modified_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `list_item_completed_timestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `list_item`
--

INSERT INTO `list_item` (`list_item_id`, `list_item_task_id`, `list_item_name`, `list_item_quantity`, `list_item_store`, `list_item_complete`, `list_item_created_timestamp`, `list_item_last_modified_timestamp`, `list_item_completed_timestamp`) VALUES
(5, 9, 'Mixed Beans', '1', '', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(6, 9, 'Chillies', '1', '', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(7, 9, 'Cheddar cheese slices', '1', '', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(8, 9, 'Buns', '6', 'Aldi', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(9, 22, 'Bean', '1', 'Bean Shop', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(10, 22, 'Beanss', '456', 'Bean Emporium', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(11, 9, 'Beans', '1 firkin', 'Aldi', 0, '2025-01-19 14:25:16', '2025-01-19 14:25:16', NULL),
(12, 28, 'THis work?', '1', '', 0, '2025-01-28 16:44:27', '2025-01-28 16:44:27', NULL),
(13, 30, 'Apples', '6', 'Supermarket', 0, '2025-01-02 11:30:00', '2025-01-02 11:30:00', NULL),
(14, 30, 'Bananas', '12', 'Supermarket', 0, '2025-01-02 12:00:00', '2025-01-02 12:00:00', NULL),
(15, 30, 'Chicken breasts', '4', 'Butcher', 0, '2025-01-02 12:30:00', '2025-01-02 12:30:00', NULL),
(16, 30, 'Orange juice', '2', 'Supermarket', 0, '2025-01-02 13:00:00', '2025-01-02 13:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `priority`
--

CREATE TABLE `priority` (
  `priority_id` int(11) NOT NULL,
  `priority_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `priority`
--

INSERT INTO `priority` (`priority_id`, `priority_name`) VALUES
(1, 'high'),
(2, 'medium'),
(3, 'low');

-- --------------------------------------------------------

--
-- Table structure for table `subtask`
--

CREATE TABLE `subtask` (
  `subtask_id` int(11) NOT NULL,
  `subtask_task_id` int(11) NOT NULL,
  `subtask_description` varchar(255) NOT NULL,
  `subtask_due_date` date DEFAULT NULL,
  `subtask_priority_id` int(11) DEFAULT NULL,
  `subtask_complete` tinyint(1) NOT NULL DEFAULT '0',
  `subtask_created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subtask_last_modified_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subtask_completed_timestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subtask`
--

INSERT INTO `subtask` (`subtask_id`, `subtask_task_id`, `subtask_description`, `subtask_due_date`, `subtask_priority_id`, `subtask_complete`, `subtask_created_timestamp`, `subtask_last_modified_timestamp`, `subtask_completed_timestamp`) VALUES
(10, 23, 'Complete add subtask', NULL, 3, 1, '2025-01-13 16:45:35', '2025-01-13 21:10:52', NULL),
(11, 23, 'Complete add list item', NULL, 3, 1, '2025-01-13 16:45:35', '2025-01-13 21:08:44', NULL),
(12, 23, 'Get filters working', NULL, 3, 1, '2025-01-13 16:45:35', '2025-01-28 22:10:05', NULL),
(13, 23, 'Get sort working', NULL, 2, 1, '2025-01-13 16:45:35', '2025-01-28 22:10:05', NULL),
(14, 24, 'Redesign nav', NULL, 3, 1, '2025-01-13 16:55:35', '2025-01-28 16:41:41', NULL),
(15, 24, 'fix new task modal (make scroll work)', NULL, 3, 0, '2025-01-13 16:55:35', '2025-01-14 15:19:22', NULL),
(16, 24, 'Fix tables in add-task', NULL, 1, 0, '2025-01-13 16:55:35', NULL, NULL),
(17, 24, 'Redo ico image', NULL, 1, 0, '2025-01-13 16:55:35', '2025-01-20 16:14:32', NULL),
(28, 23, 'Complete delete list item', NULL, 2, 1, '2025-01-13 21:12:01', '2025-01-13 21:14:05', NULL),
(29, 23, 'Amend toggle table Item to be more generic', NULL, NULL, 0, '2025-01-14 12:15:12', '2025-01-14 12:15:12', NULL),
(30, 23, 'Login/register functionality', NULL, 3, 1, '2025-01-14 12:17:24', '2025-01-19 13:31:23', NULL),
(31, 23, 'Sessions/state persistence', NULL, NULL, 1, '2025-01-14 12:17:40', '2025-01-19 13:31:25', NULL),
(32, 23, 'Cookies/sessions', NULL, NULL, 1, '2025-01-14 20:23:48', '2025-01-19 13:31:25', NULL),
(33, 23, 'default filter (to demonstrate cookies)', NULL, NULL, 0, '2025-01-14 20:24:02', '2025-01-14 20:24:02', NULL),
(34, 23, 'refactor error res for sec (401 vs 404)', NULL, NULL, 0, '2025-01-14 20:46:07', '2025-01-14 20:46:07', NULL),
(35, 23, 'event listeners on deleted tiles', NULL, NULL, 0, '2025-01-20 21:08:19', '2025-01-20 21:08:19', NULL),
(36, 23, 'Amend so \"low\" isn\'t default priority on subtasks', NULL, NULL, 0, '2025-01-20 21:09:01', '2025-01-20 21:09:01', NULL),
(37, 23, 'fix table in modal add list', NULL, NULL, 0, '2025-01-20 21:09:21', '2025-01-20 21:09:21', NULL),
(38, 23, 'fix add list item function - not sending to DB', NULL, NULL, 0, '2025-01-20 21:10:25', '2025-01-20 21:10:25', NULL),
(39, 23, 'amend delete to include sql confirmation of incomplete status', NULL, 2, 0, '2025-01-21 10:12:19', '2025-01-21 10:12:19', NULL),
(40, 23, 'add task category to html data', NULL, NULL, 0, '2025-01-28 18:18:46', '2025-01-28 18:18:46', NULL),
(41, 23, 'add task category functionality', NULL, NULL, 0, '2025-01-28 18:18:55', '2025-01-28 18:18:55', NULL),
(42, 23, 'make sure new subtask data is included in html', NULL, NULL, 0, '2025-01-28 18:41:42', '2025-01-28 18:41:42', NULL),
(43, 29, 'Gather data', '2025-02-10', 1, 0, '2025-01-01 10:30:00', '2025-01-01 10:30:00', NULL),
(44, 29, 'Analyze results', '2025-02-12', 1, 0, '2025-01-01 11:00:00', '2025-01-01 11:00:00', NULL),
(45, 29, 'Write introduction', '2025-02-13', 2, 0, '2025-01-01 11:30:00', '2025-01-01 11:30:00', NULL),
(46, 30, 'Buy milk', '2025-02-10', 2, 0, '2025-01-02 11:30:00', '2025-01-02 11:30:00', NULL),
(47, 30, 'Buy bread', '2025-02-10', 2, 0, '2025-01-02 12:00:00', '2025-01-02 12:00:00', NULL),
(48, 30, 'Buy eggs', '2025-02-10', 2, 0, '2025-01-02 12:30:00', '2025-01-02 12:30:00', NULL),
(49, 32, 'Book flights', '2025-05-01', 1, 0, '2025-01-04 13:30:00', '2025-01-04 13:30:00', NULL),
(50, 32, 'Reserve hotel', '2025-05-10', 1, 0, '2025-01-04 14:00:00', '2025-01-04 14:00:00', NULL),
(51, 32, 'Plan activities', '2025-05-20', 2, 0, '2025-01-04 14:30:00', '2025-01-04 14:30:00', NULL),
(52, 35, 'Create outline', '2025-02-20', 1, 0, '2025-01-07 16:30:00', '2025-01-07 16:30:00', NULL),
(53, 35, 'Design slides', '2025-02-22', 1, 0, '2025-01-07 17:00:00', '2025-01-07 17:00:00', NULL),
(54, 35, 'Practice presentation', '2025-02-24', 2, 0, '2025-01-07 17:30:00', '2025-01-07 17:30:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `task_id` int(11) NOT NULL,
  `task_user_id` int(11) NOT NULL,
  `task_title` varchar(255) NOT NULL,
  `task_description` varchar(255) DEFAULT NULL,
  `task_type_id` int(11) NOT NULL,
  `task_category_id` int(11) DEFAULT NULL,
  `task_due_date` date DEFAULT NULL,
  `task_priority_id` int(11) DEFAULT NULL,
  `task_complete` tinyint(1) NOT NULL DEFAULT '0',
  `task_created_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `task_updated_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `task_completed_timestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`task_id`, `task_user_id`, `task_title`, `task_description`, `task_type_id`, `task_category_id`, `task_due_date`, `task_priority_id`, `task_complete`, `task_created_timestamp`, `task_updated_timestamp`, `task_completed_timestamp`) VALUES
(9, 1, 'Please let me have the beans - I really want them', '', 2, NULL, NULL, 1, 0, '2025-01-08 21:32:19', '2025-01-19 14:21:26', NULL),
(22, 1, 'Make me a bean', '', 2, NULL, NULL, NULL, 0, '2025-01-08 21:32:19', '2025-01-19 14:21:28', NULL),
(23, 13, 'Complete the beans', 'Time to do a new thing. Finish the beans, then no more beans.', 1, NULL, '2025-01-21', 3, 0, '2025-01-13 16:45:35', '2025-01-21 20:12:37', NULL),
(24, 13, 'Pretty-up the front-end', 'Fixes, rejigs, and tidys. It\'s definitely lower on the urgency scale.', 1, NULL, NULL, 1, 0, '2025-01-13 16:55:35', '2025-01-26 17:58:32', NULL),
(25, 12, 'Gary myself', 'Gary a bit, now and then', 1, NULL, NULL, NULL, 0, '2025-01-18 20:31:42', '2025-01-19 14:21:35', NULL),
(26, 1, 'Refactor routes.', 'As it says on the tin, bro.', 1, NULL, NULL, NULL, 0, '2025-01-19 16:45:35', '2025-01-19 16:45:35', NULL),
(27, 14, 'Fuck up America just like I like it', 'But still be really angry about everything', 3, NULL, NULL, NULL, 0, '2025-01-22 22:18:50', '2025-01-22 22:18:50', NULL),
(28, 13, 'Example Shopping List', '', 2, NULL, NULL, NULL, 1, '2025-01-28 16:44:03', '2025-01-28 22:04:48', '2025-01-28 22:04:48'),
(29, 16, 'Complete project report', 'Finish the final report for the project.', 1, 1, '2025-02-15', 1, 0, '2025-01-01 10:00:00', '2025-01-01 10:00:00', NULL),
(30, 16, 'Grocery shopping', 'Buy groceries for the week.', 2, 6, '2025-02-10', 2, 0, '2025-01-02 11:00:00', '2025-01-02 11:00:00', NULL),
(31, 16, 'Doctor appointment', 'Annual check-up with Dr. Smith.', 3, 5, '2025-03-01', 3, 0, '2025-01-03 12:00:00', '2025-01-03 12:00:00', NULL),
(32, 16, 'Plan vacation', 'Plan the itinerary for the summer vacation.', 1, 2, '2025-06-01', 2, 0, '2025-01-04 13:00:00', '2025-01-04 13:00:00', NULL),
(33, 16, 'Read a book', 'Finish reading "The Great Gatsby".', 3, 8, '2025-04-01', 3, 0, '2025-01-05 14:00:00', '2025-01-05 14:00:00', NULL),
(34, 16, 'Fix the leaky faucet', 'Repair the faucet in the kitchen.', 1, 4, '2025-02-20', 1, 0, '2025-01-06 15:00:00', '2025-01-06 15:00:00', NULL),
(35, 16, 'Prepare presentation', 'Create slides for the upcoming presentation.', 1, 1, '2025-02-25', 1, 0, '2025-01-07 16:00:00', '2025-01-07 16:00:00', NULL),
(36, 16, 'Buy birthday gift', 'Get a gift for Sarah\'s birthday.', 2, 2, '2025-03-10', 2, 0, '2025-01-08 17:00:00', '2025-01-08 17:00:00', NULL),
(37, 16, 'Exercise', 'Go for a run in the park.', 3, 5, '2025-01-10', 3, 1, '2025-01-09 18:00:00', '2025-01-09 18:00:00', '2025-01-10 18:00:00'),
(38, 16, 'Clean the house', 'Do a thorough cleaning of the house.', 1, 4, '2025-01-15', 1, 1, '2025-01-10 19:00:00', '2025-01-10 19:00:00', '2025-01-15 19:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `type`
--

CREATE TABLE `type` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `type`
--

INSERT INTO `type` (`type_id`, `type_name`) VALUES
(1, 'todo'),
(2, 'shopping list'),
(3, 'Note');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_username` varchar(255) NOT NULL,
  `user_first_name` varchar(255) NOT NULL,
  `user_last_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_dob` date NOT NULL,
  `user_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_username`, `user_first_name`, `user_last_name`, `user_email`, `user_dob`, `user_password`) VALUES
(1, 'Bobby', 'Bob', 'Varchar', 'bob@varchar.com', '2005-05-26', 'bobspassword'),
(2, 'Simmy', 'Simone', 'Varchar', 'simone@varchar.com', '1995-05-18', 'simoneisbobssister'),
(12, 'Gary', 'Gary', 'Garysson', 'gary@gary.com', '1865-02-05', '$2a$10$K5NEN6Wlkq9Lq4XweK2Uk.6FPDaKBt2X10Ygo0G/oPm2gY1g2EvcG'),
(13, 'halfers', 'Sam', 'Halfpenny', 'sam.j.halfpenny@gmail.com', '2025-01-24', '$2a$10$nmZospGr7bqmddkK7ZEZ5uNEuhwlq4hmkOXpJP7/L7Ur3ny6BNCbC'),
(14, 'AngryMeatMan', 'Steve', 'Bannon', 'BigFurry@gammon.gammon', '1956-08-14', '$2a$10$35maYeOdvj7/LEMu1E1CWO2GE1sH3cS3.Mfdqyfu7hd93jdKlt4Vm'),
(15, 'Herbie', 'Herbert', 'Herbert', 'herbie@herbie.herb', '1893-01-01', '$2a$10$RX.ApYxbRPLdklNQXgd7n.Fuw3nzrMofuTZE2q.iGkyDnijXC7ZNa'),
(16, 'dancyboi', 'Craig', 'Revell-Horwood', 'dancyboi1923@gmail.com', '1875-12-13', '$2a$10$iDR1alPkVzms7O5zMiJdw.RbHDhKXTv3q4/rLXfw/dVVVbNb3aITi');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `FK_user_user_ID` (`category_user_id`);

--
-- Indexes for table `list_item`
--
ALTER TABLE `list_item`
  ADD PRIMARY KEY (`list_item_id`),
  ADD KEY `FK_list_item_task_id` (`list_item_task_id`);

--
-- Indexes for table `priority`
--
ALTER TABLE `priority`
  ADD PRIMARY KEY (`priority_id`);

--
-- Indexes for table `subtask`
--
ALTER TABLE `subtask`
  ADD PRIMARY KEY (`subtask_id`),
  ADD KEY `FK_subtask_task_id` (`subtask_task_id`),
  ADD KEY `FK_subtask_priority_id` (`subtask_priority_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `FK_task_user_id` (`task_user_id`),
  ADD KEY `FK_task_type_id` (`task_type_id`),
  ADD KEY `FK_task_priority_id` (`task_priority_id`),
  ADD KEY `FK_task_category_id` (`task_category_id`);

--
-- Indexes for table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`type_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `list_item`
--
ALTER TABLE `list_item`
  MODIFY `list_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `priority`
--
ALTER TABLE `priority`
  MODIFY `priority_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subtask`
--
ALTER TABLE `subtask`
  MODIFY `subtask_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `type`
--
ALTER TABLE `type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `FK_user_user_ID` FOREIGN KEY (`category_user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `list_item`
--
ALTER TABLE `list_item`
  ADD CONSTRAINT `FK_list_item_task_id` FOREIGN KEY (`list_item_task_id`) REFERENCES `task` (`task_id`);

--
-- Constraints for table `subtask`
--
ALTER TABLE `subtask`
  ADD CONSTRAINT `FK_subtask_priority_id` FOREIGN KEY (`subtask_priority_id`) REFERENCES `priority` (`priority_id`),
  ADD CONSTRAINT `FK_subtask_task_id` FOREIGN KEY (`subtask_task_id`) REFERENCES `task` (`task_id`);

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `FK_task_category_id` FOREIGN KEY (`task_category_id`) REFERENCES `category` (`category_id`),
  ADD CONSTRAINT `FK_task_priority_id` FOREIGN KEY (`task_priority_id`) REFERENCES `priority` (`priority_id`),
  ADD CONSTRAINT `FK_task_type_id` FOREIGN KEY (`task_type_id`) REFERENCES `type` (`type_id`),
  ADD CONSTRAINT `FK_task_user_id` FOREIGN KEY (`task_user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `FK_user_user_ID_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
