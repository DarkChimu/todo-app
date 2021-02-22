'use strict'

class Login {
  get rules () {
    return {
      email: 'required|email',
      password: 'required|min:4'
    }
  }
  
  get messages () {
    return {
      'email.required': 'Debe ingresar un correo',
      'email.email': 'Debe ingresar un formato de correo valido',
      'password.required': 'Debe ingresar una contraseña',
      'password.min': 'Su contraseña debe contener un minimo de 4 carácteres'
    }
  }
}

module.exports = Login
