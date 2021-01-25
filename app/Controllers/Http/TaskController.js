'use strict'

/* Importamos el Modelo y destructuramos la funcion
   validate de Validator */

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
	async index({ auth, view }) {
		const user = await auth.getUser()
		// Consultamos todas las tareas que tenga el usuario
		const tasks = await user.tasks().fetch()
		return view.render('tasks.index', { tasks: tasks.toJSON() })
	}

	async store({ auth, request, response, session }) {
		// Consultamos al usuario autentificado
		const user = await auth.getUser()
		
		// Validamos la informacion de entrada
		const validation = await validate(request.all())
		
		// Reglas de validacion fueron movidas a app/Validators/StoreTask

		// Guardamos en base de datos
		const task = new Task()
		task.title = request.input('title')
		await user.tasks().save(task)

		// Guardamos mensaje de exito
		session.flash({ notification: '¡Tarea agregada con exito!'})

		return response.redirect('back')
	}

	async destroy({ auth, params, session, response }) {
		const user = await auth.getUser()

		const task = await Task.find(params.id)
		await task.delete()

		// Guardamos el mensaje de exito
		session.flash({ notification: '¡Tarea eliminada con éxito!' })
		response.redirect('back')
	}
}

module.exports = TaskController
