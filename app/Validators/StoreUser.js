'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email',
      first_name: 'required',
      last_name: 'required',
      password: 'required|min:4'
    }
  }

  get messages () {
    return {
      'email.required': 'Debe ingresar un correo',
      'email.email': 'Debe ingresar un formato de correo valido',
      'first_name.required': 'Debe ingresar su Nombre',
      'last_name.required': 'Debe ingresar su Apellido',
      'password.required': 'Debe ingresar una contraseña',
      'password.min': 'Su contraseña debe contener un minimo de 4 carácteres'
    }
  }
}

module.exports = StoreUser
