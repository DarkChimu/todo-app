'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { flashAndRedirect } = use('App/Helpers')
const Mail = use('Mail')
const Env = use('Env')
const Hash = use('Hash')
const jwt = require('jsonwebtoken')

const APP_URL = `http://${process.env.HOST}:${process.env.PORT}`

class UserController {
    async login ({ request, session, auth, response }) {
        const { email, password } = request.all()
        const validation = await validate({ email, password })

        const userExist = await User.findBy('email', email)

        if (!userExist) {
            return flashAndRedirect(
                'danger',
                'no user account found with this email',
                'back', {
                session,
                response
            })
        }

        if (!userExist.email_verified) {
            return flashAndRedirect(
                'danger',
                'please verify your email first',
                'back', {
                session,
                response
            })
        }

        const isSame = await Hash.verify(password, userExist.password)
        if (!isSame) {
            return flashAndRedirect(
                'danger',
                'incorrect credentials',
                'back', {
                session,
                response
            })
        }

        await auth.login(userExist)

        return response.redirect('/user')
    }

    async logout ({ auth, response }) {
        await auth.logout()

        return response.redirect('/')
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

        const token = jwt.sign({ email: user.email }, process.env.SECRET, {
            expiresIn: 60 * 60 * 24 * 3
        })

        const params = {
            ...user.toJSON(),
            token,
            appUrl: APP_URL
        }

        await Mail.send('emails.confirm_account', params, (message) => {
            message
            .to(user.email)
            .from(process.env.FROM_EMAIL)
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
            payload = await jwt.verify(token, process.env.SECRET)
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

    async resendConfirmationEmail({ request, response, session }) {
        const validation = await validate(request.all(), {
          email: 'required|email',
        });
    
        if (validation.fails()) {
          session.withErrors(validation.messages()).flashAll();
          return response.redirect('back');
        }
    
        const user = await User.findBy('email', request.input('email'));
        if (!user) {
          return flashAndRedirect(
            'success',
            'if the email is valid, you should receive an email!',
            '/login',
            {
              session,
              response,
            }
          );
        }
    
        if (user.email_verified) {
          return flashAndRedirect(
            'danger',
            'account already verified!',
            '/login',
            {
              session,
              response,
            }
          );
        }
    
        const token = jwt.sign({ email: user.email }, process.env.SECRET, {
          expiresIn: 60 * 60 * 24 * 3,
        });
    
        const params = {
          ...user.toJSON(),
          token,
          appUrl: APP_URL
        };
    
        await Mail.send('emails.confirm_account', params, (message) => {
          message
            .to(user.email)
            .from(process.env.FROM_EMAIL)
            .subject('Confirm your Account!')
        });
    
        return flashAndRedirect(
          'success',
          'if the email is valid, you should receive an email!',
          '/login',
          {
            session,
            response,
          }
        );
      }
}

module.exports = UserController
