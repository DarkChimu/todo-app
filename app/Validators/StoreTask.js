'use strict'

class StoreTask {
  get rules () {
    return {
      title: 'required|min:3|max:255'
    }
  }
  
  get messages(){
    return {
      'title.required': 'Debes ingresar algún título',
      'title.min': 'El titulo debe ser mayor a 3 carácteres'
    }
  }
}

module.exports = StoreTask
