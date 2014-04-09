CREATE DATABASE IF NOT EXISTS `kitjss`
USE `kitjss`;

-- Дамп структуры для таблица kitjss.session
CREATE TABLE IF NOT EXISTS `session` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `sid` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `expire` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица kitjss.user_role
CREATE TABLE IF NOT EXISTS `user_role` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `role` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;