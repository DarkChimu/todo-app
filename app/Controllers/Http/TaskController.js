'use strict'

/* Importamos el Modelo y destructuramos la funcion
   validate de Validator */

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
	async index({ view }) {
		//Consultamos todas las tareas que tenga el usuario
		const tasks = await Task.all()
		return view.render('tasks.index', { tasks: tasks.toJSON() })
	}

	async store({ request, response, session }) {
		
		//validamos la informacion de entrada
		const validation = await validate(request.all())
		
		//reglas de validacion fueron movidas a app/Validators/StoreTask

		//Guardamos en base de datos
		const task = new Task()
		task.title = request.input('title')
		await task.save()

		//Guardamos mensaje de exito
		session.flash({ notification: '¡Tarea agregada con exito!'})

		return response.redirect('back')
	}

	async destroy({ params, session, response }){
		const task = await Task.find(params.id)
		await task.delete()

		//Guardamos el mensaje de exito
		session.flash({ notification: '¡Tarea eliminada con éxito!' })
		response.redirect('back')
	}
}

module.exports = TaskController
