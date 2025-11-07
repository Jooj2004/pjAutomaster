const express = require('express')
const mainRouter = express.Router()
const veiculoController = require('../controllers/veiculo')
const perfilController = require('../controllers/perfil')
const agendaController = require('../controllers/agenda')
const authController = require('../controllers/auth')
const historicoController = require('../controllers/historico')
const mensagemController = require('../controllers/menssagem')
const osController = require('../controllers/ordemservico')
const pecaController = require('../controllers/peca')

//Auth
mainRouter.post('/auth/registro', authController.registro);
mainRouter.post('/auth/login', authController.login);
mainRouter.get('/auth/validate', authController.validateToken);

// Perfil
mainRouter.get('/user/:id', perfilController.getUsuario)
mainRouter.put('/editar/:id', perfilController.editPerfil)

// Veículos
mainRouter.post('/veiculos', veiculoController.createVeiculo)
mainRouter.put('/veiculos/:id', veiculoController.updateVeiculo)
mainRouter.get('/veiculos/cliente/:cliente_id', veiculoController.getVeiculosByCliente);
mainRouter.delete('/veiculos/:id', veiculoController.deleteVeiculo)

// Agenda
mainRouter.get('/agenda/cliente/:cliente_id', agendaController.buscarAgendamentosPorCliente);
mainRouter.post('/agenda/agendar', agendaController.agendar)
mainRouter.get('/agenda/agendamento/:id', agendaController.buscarAgendamentoById)
mainRouter.get('/agenda/allagendamento', agendaController.listarAgendamentos)
mainRouter.get('/agenda/veiculo/:veiculo_id', agendaController.buscarAgendamentosPorVeiculo)
mainRouter.put('/agenda/update/:id', agendaController.editarAgendamento)
mainRouter.delete('/agenda/delete/:id', agendaController.deletarAgendamento)

//Histórico
mainRouter.get('/historico/:cliente_id', historicoController.getHistoricClient)
mainRouter.get('/historico', historicoController.getHistoricAllClients);

//Pegar todos os clientes 
mainRouter.get('/clientes', perfilController.getAllClientes)

// Mensagens
mainRouter.get('/mensagens/os/:osId', mensagemController.getMensagensOS);
mainRouter.post('/mensagens', mensagemController.enviarMensagem);
mainRouter.get('/verificar-acesso/:osId/:usuarioId/:perfil', mensagemController.verificarAcessoOS);

//Ordem de Serviço
mainRouter.get('/os/:funcionario_id', osController.getOSByFuncionario);
mainRouter.post('/os/create', osController.createOS)
mainRouter.put('/update/:id', osController.updateOS);
mainRouter.delete('/delete/:id', osController.deleteOS);
mainRouter.get('/os/cliente/:cliente_id', osController.getOSByCliente);

//Peca
mainRouter.post('/pecas', pecaController.createPeca);

module.exports = mainRouter;