/// <reference types="cypress" />
const faker = require('faker');
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
           })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nome = faker.name.findName();
          let email = faker.internet.email();

          cy.cadastrarUsuario(nome, email).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          let nome = faker.name.firstName();
          cy.cadastrarUsuario(nome, 200).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser uma string')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let nome = `Usuario Editado ${Math.floor(Math.random() * 100000000)}`
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body:
                    {
                         "nome": nome,
                         "email": `usuarioediato@qa.com.br`,
                         "password": "teste",
                         "administrador": "true"
                    }
               })
          }).then(response => {
               expect(response.body.message).to.equal('Registro alterado com sucesso')
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let nome = faker.name.findName();
          let email = faker.internet.email();

          cy.cadastrarUsuario(nome, email).then((response) => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                }).then(response =>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
          })
     });
});
