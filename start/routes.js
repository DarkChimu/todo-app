'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
// Route.on('/').render('welcome')

Route.group(() => {
    Route.get('/', 'TaskController.index') // -> Ruta de Indexado de tareas
    Route.post('tasks', 'TaskController.store').validator('StoreTask') // -> Ruta para guardar Tareas
    Route.delete('tasks/:id', 'TaskController.destroy') // -> Ruta para Borrar tareas
}).prefix('/user').middleware('auth')

Route.get('/', 'UserController.pageShow')
Route.post('users/register', 'UserController.store')
Route.post('users/login', 'UserController.store')
