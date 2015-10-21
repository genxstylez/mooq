import _ from 'lodash'
import history from '../history'
import AppDispatcher from '../dispatchers/AppDispatcher'
import UserConstants from '../constants/UserConstants'

export default {
    login(jwt) {
        var savedJwt = localStorage.getItem('jwt')

        AppDispatcher.dispatch({
            actionType: UserConstants.LOGIN,
            jwt: jwt
        })

        if (savedJwt !== jwt) {
            // TODO: handle next path to transition to
            history.replaceState(null, '/')
            localStorage.setItem('jwt', jwt)
        }
    },

    refresh(jwt) {
        AppDispatcher.dispatch({
            actionType: UserConstants.LOGIN,
            jwt: jwt
        })
        localStorage.setItem('jwt', jwt)
    },


    unsubscribe() {
        pubnub.unsubscribe({
            channel: UserStore.user.channels
        });
    },

    logout() {
        history.replaceState(null, '/')
        localStorage.removeItem('jwt');
        AppDispatcher.dispatch({
            actionType: UserConstants.LOGOUT
        });
    },

    create_guest() {
        AppDispatcher.dispatch({
            actionType: UserConstants.CREATE_GUEST,
        });
    },

    /*
    @param  {object}  User object
    */

    authenticated(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.AUTHENTICATED,
            user: user
        });
    }
}