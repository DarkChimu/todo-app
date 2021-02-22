'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { flashAndRedirect } = use('App/Helpers')
const Mail = use('Mail')
const Env = use('Env')
const jwt = require('jsonwebtoken')

class UserController {
    async login ({ request, auth }) {
        const { email, password } = request.all()
        const token = auth.attempt(email, password)
        return token
    }

    async store({ session, request, response }) {
        const { email, password, first_name, last_name } = request.all()
        // Validamos la información de entrada
        const validation = await validate(request.all())

        // Reglas de validacion fueron movidas a app/Validators/StoreUser

        const exist = await User.findBy('email', email)
        if (exist) {
            return flashAndRedirect(
                'danger',
                'Ya existe un usuario con ese email',
                'back',{
                    session,
                    response
                })
        }

        const user = await User.create({
            email,
            password,
            first_name,
            last_name,
            email_verified: false
        })

        const token = jwt.sign({ email: user.email }, Env.get('SECRET'), {
            expiresIn: 60 * 60 * 24 * 3
        })

        const params = {
            ...user.toJSON(),
            token,
            appUrl: Env.get('APP_URL')
        }

        await Mail.send('emails.confirm_account', params, (message) => {
            message
            .to(user.email)
            .from(Env.get('FROM_EMAIL'))
            .subject('Confirm your Account!')
        })
        return flashAndRedirect(
            'success',
            'please check your email to confirm account',
            '/login',
            {
                session,
                response
            }
        )
    }

    async confirmAccount({ response, params, session }) {
        const { token } = params

        let payload

        // Verificamos el token si es correcto o sigue vigente
        try {
            payload = await jwt.verify(token, Env.get('SECRET'))
        } catch (err) {
            return flashAndRedirect(
                'danger',
                'Link is invalid or it has expired!',
                '/login',
                {
                    session,
                    response
                })
        }

        // Verificamos si existe el usuario
        const user = await User.findBy('email', payload.email)
        if (!user) {
            return flashAndRedirect(
                'danger',
                'User not found',
                '/login',
                {
                    session,
                    response
                })
        }

        // Verificamos si el email ya ha sido verificado
        if (user.email_verified) {
            return response.redirect('/login')
        }

        // En Cuyo caso que no esté verificado lo verificamos y guardamos el nuevo registro
        user.email_verified = true;
        await user.save();

        return flashAndRedirect(
            'success',
            'Account confirmed successfully',
            '/login',
            {
                session,
                response
            }
        )
    }
}

module.exports = UserController
