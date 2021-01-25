'use strict'

const User = use('App/Models/User')

class UserController {
    async pageShow ({ view }) {
        return view.render('auth.index')
    }

    async login ({ request, auth }) {
        const { email, password } = request.all()
        const token = auth.attempt(email, password)
        return token
    }

    async store({ request }) {
        const { email, password } = request.all()
        const user = await User.create({
            username: email,
            email,
            password
        })

        return this.login(...arguments)
    }
}

module.exports = UserController
