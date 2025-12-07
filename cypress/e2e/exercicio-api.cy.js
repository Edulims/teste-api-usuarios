/// <reference types="cypress"/>
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let token
  beforeEach(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => {
      token = tkn
    })
  });

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
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let nomeuser = `UserTeste.${Math.floor(Math.random() * 100000000)}`
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
          "nome": nomeuser,
          "email": nomeuser + '@teste.com.br',
          "password": "teste",
          "administrador": 'true'
      },
      headers: { authorization: token }
    }).then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    let nomeuser = `UserTeste.${Math.floor(Math.random() * 100000000)}`
     cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": nomeuser,
        "email": 'fulano@qa.com' ,
        "password": "teste",
        "administrador": 'true'
      }, 
      headers: { authorization: token },
      failOnStatusCode: false
     }).then(response => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Este email já está sendo usado')
     })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    //TODO:
    let nomeuser = `UserTeste.${Math.floor(Math.random() * 100000000)}`
    let email = nomeuser + '@teste.com'
    cy.cadastrarUsuario(token, nomeuser, email, 'teste', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          body: {
            "nome": nomeuser,
            "email": email,
            "password": "SenhaTesteAlterada",
            "administrador": 'true'
          }, headers: { authorization: token }
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal("Registro alterado com sucesso")
        })
      })
         
  });

  it.only('Deve deletar um usuário previamente cadastrado', () => {
    //TODO:
    let nomeuser = `UserTeste.${Math.floor(Math.random() * 100000000)}`
    let email = nomeuser + '@teste.com'
    cy.cadastrarUsuario(token, nomeuser, email, 'teste', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          headers: {authorization: token}
        }).then(response =>{
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal("Registro excluído com sucesso")
        })
    })
  });


});
