-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para bdmecanica
CREATE DATABASE IF NOT EXISTS `bdmecanica` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `bdmecanica`;

-- Copiando estrutura para tabela bdmecanica.agenda
CREATE TABLE IF NOT EXISTS `agenda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.agenda: ~1 rows (aproximadamente)
INSERT INTO `agenda` (`id`) VALUES
	(14);

-- Copiando estrutura para tabela bdmecanica.agendamento
CREATE TABLE IF NOT EXISTS `agendamento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dataHora` datetime NOT NULL,
  `servico` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `veiculo_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `veiculo_id` (`veiculo_id`),
  CONSTRAINT `agendamento_ibfk_1` FOREIGN KEY (`veiculo_id`) REFERENCES `veiculo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.agendamento: ~3 rows (aproximadamente)
INSERT INTO `agendamento` (`id`, `dataHora`, `servico`, `status`, `veiculo_id`) VALUES
	(1, '2025-09-01 17:21:40', 'Teste', 'em andamento', 5),
	(7, '2025-09-19 15:00:00', 'revisao', 'pendente', 7),
	(8, '2025-11-21 15:00:00', 'revisao', 'pendente', 5);

-- Copiando estrutura para tabela bdmecanica.cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.cliente: ~2 rows (aproximadamente)
INSERT INTO `cliente` (`id`) VALUES
	(13),
	(15);

-- Copiando estrutura para tabela bdmecanica.funcionario
CREATE TABLE IF NOT EXISTS `funcionario` (
  `id` int(11) NOT NULL,
  `funcao` varchar(100) DEFAULT NULL,
  `agenda_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agenda_id` (`agenda_id`),
  CONSTRAINT `funcionario_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `funcionario_ibfk_2` FOREIGN KEY (`agenda_id`) REFERENCES `agenda` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.funcionario: ~1 rows (aproximadamente)
INSERT INTO `funcionario` (`id`, `funcao`, `agenda_id`) VALUES
	(14, 'Mecânico geral mestre de obras', 14);

-- Copiando estrutura para tabela bdmecanica.indisponibilidade_funcionario
CREATE TABLE IF NOT EXISTS `indisponibilidade_funcionario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `funcionario_id` int(11) NOT NULL,
  `data` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funcionario_id` (`funcionario_id`,`data`),
  CONSTRAINT `indisponibilidade_funcionario_ibfk_1` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.indisponibilidade_funcionario: ~2 rows (aproximadamente)
INSERT INTO `indisponibilidade_funcionario` (`id`, `funcionario_id`, `data`) VALUES
	(6, 14, '2025-11-08'),
	(7, 14, '2025-11-15');

-- Copiando estrutura para tabela bdmecanica.mensagem
CREATE TABLE IF NOT EXISTS `mensagem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conteudo` text DEFAULT NULL,
  `dataHora` datetime NOT NULL,
  `ordemServico_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ordemServico_id` (`ordemServico_id`),
  CONSTRAINT `mensagem_ibfk_1` FOREIGN KEY (`ordemServico_id`) REFERENCES `ordemservico` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.mensagem: ~6 rows (aproximadamente)
INSERT INTO `mensagem` (`id`, `conteudo`, `dataHora`, `ordemServico_id`, `usuario_id`) VALUES
	(12, 'Bom dia. Quanto vai custar a embreagem ?', '2025-11-05 11:19:42', 6, 15),
	(13, 'Voce fez duas ordens mano. apaga ai essa', '2025-11-05 11:20:03', 5, 15),
	(14, 'Se ta muito ruim pode jogar fora', '2025-11-05 11:20:16', 2, 15),
	(15, 'ta ai na ordem', '2025-11-05 11:20:35', 6, 14),
	(16, 'logo mais apago', '2025-11-05 11:20:46', 5, 14),
	(17, 'oi. o carro esta pronto', '2025-11-05 11:20:57', 3, 14),
	(18, 'Vou chamar o ferro velho', '2025-11-05 11:21:17', 2, 14);

-- Copiando estrutura para tabela bdmecanica.notificacao
CREATE TABLE IF NOT EXISTS `notificacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  `conteudo` text DEFAULT NULL,
  `dataEnvio` datetime DEFAULT NULL,
  `statusEnvio` varchar(50) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `notificacao_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.notificacao: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela bdmecanica.ordemservico
CREATE TABLE IF NOT EXISTS `ordemservico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `diagnostico` text DEFAULT NULL,
  `tempo` float DEFAULT NULL,
  `custo` float DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `agendamento_id` int(11) DEFAULT NULL,
  `funcionario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `funcionario_id` (`funcionario_id`),
  CONSTRAINT `ordemservico_ibfk_2` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.ordemservico: ~4 rows (aproximadamente)
INSERT INTO `ordemservico` (`id`, `diagnostico`, `tempo`, `custo`, `status`, `agendamento_id`, `funcionario_id`) VALUES
	(2, 'motor fundido', 677, 7890, 'concluido', 7, 14),
	(3, 'Quebrou a rebinboca da parafuseta', 13, 537.98, 'Concluída', 8, 14),
	(5, 'Quebrou a embreagem', 6, 75, 'em_andamento', 7, 14),
	(6, 'Quebrou a embreagem denovo', 12, 75, 'Concluída', 7, 14);

-- Copiando estrutura para tabela bdmecanica.peca
CREATE TABLE IF NOT EXISTS `peca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `precoUnitario` float DEFAULT NULL,
  `ordemServico_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ordemServico_id` (`ordemServico_id`),
  CONSTRAINT `peca_ibfk_1` FOREIGN KEY (`ordemServico_id`) REFERENCES `ordemservico` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.peca: ~2 rows (aproximadamente)
INSERT INTO `peca` (`id`, `nome`, `quantidade`, `precoUnitario`, `ordemServico_id`) VALUES
	(2, 'Motor Novo', 1, 5000, 2),
	(3, 'embreagem Fx2324fs', 1, 75, 6);

-- Copiando estrutura para tabela bdmecanica.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `perfil` enum('cliente','funcionario') NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `cpf` varchar(11) NOT NULL,
  `data_criacao` date DEFAULT NULL,
  `token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.usuario: ~3 rows (aproximadamente)
INSERT INTO `usuario` (`id`, `nome`, `email`, `senha`, `telefone`, `perfil`, `endereco`, `cpf`, `data_criacao`, `token`) VALUES
	(13, 'teste 1', 'teste1@gmail.com', '$2b$10$6dVO6RsXeMX/MR7pDVSkKu7VQoPy9.chK.ghB275052Q/lMqp5j7u', '55987965435', 'cliente', 'Rua None N23 bairro Luceonteros', '11111111112', '2025-08-31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsI'),
	(14, 'teste 2', 'teste2@gmail.com', '$2b$10$0VTxpwtZh8c1Nfd8a0TA9uCdcg3MprJ18gwCJbm09nXXkQXbWVF0W', '55987965436', 'funcionario', 'Rua Abobora N23 bairro Luceonteros', '11111111111', '2025-08-31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsI'),
	(15, 'teste 3', 'teste3@gmail.com', '$2b$10$Pd6fB525OIbG1ZpiEAwXQ.Kx5HXc6KJuxm6RboBFpv1idydlVkRJi', '55987965436', 'cliente', 'Rua Abobora N23 bairro Nonino', '11111111100', '2025-09-02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsI');

-- Copiando estrutura para tabela bdmecanica.veiculo
CREATE TABLE IF NOT EXISTS `veiculo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `placa` varchar(10) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `cor` varchar(30) DEFAULT NULL,
  `cliente_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `placa` (`placa`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `veiculo_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela bdmecanica.veiculo: ~3 rows (aproximadamente)
INSERT INTO `veiculo` (`id`, `placa`, `marca`, `modelo`, `ano`, `cor`, `cliente_id`) VALUES
	(5, 'ABC1111', 'Fiat', 'Uno', 2022, 'Verde', 13),
	(7, 'MNR5677', 'Reboult', 'Yesman', 1567, 'Vermelho bosta', 15),
	(8, 'ZYX6789', 'Gol', 'Quadrado', 1957, 'Verde Canário', 13);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
