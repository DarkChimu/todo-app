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

Route.on('/').render('home.index')
Route.on('/login').render('auth.index')
Route.on('/signup').render('auth.signup')
Route.on('/resend_confirm').render('auth.resend_confirm')

Route.group(() => {
    Route.post('register', 'UserController.store').validator('StoreUser') // -> Ruta para guardar Usuarios
    Route.post('login', 'UserController.login').validator('Login')
    Route.post('logout', 'UserController.logout')
    Route.get('confirm/:token', 'UserController.confirmAccount')
    Route.post('confirm/resend', 'UserController.resendConfirmationEmail')
}).prefix('/api')

Route.group(() => {
    Route.get('/', 'TaskController.index') // -> Ruta de Indexado de tareas
    Route.post('tasks', 'TaskController.store').validator('StoreTask') // -> Ruta para guardar Tareas
    Route.delete('tasks/:id', 'TaskController.destroy') // -> Ruta para Borrar tareas
}).prefix('/user').middleware('auth')

