import _ from 'lodash'
import history from '../history'
import AppDispatcher from '../dispatchers/AppDispatcher'
import UserConstants from '../constants/UserConstants'
import RouterContainer from '../RouterContainer'

export default {
    login(jwt) {

        var savedJwt = localStorage.getItem('jwt')

        AppDispatcher.dispatch({
            actionType: UserConstants.LOGIN,
            jwt: jwt
        })

        if (savedJwt !== jwt) {
            // TODO: handle next path to transition to
            let nextPath = RouterContainer.get()
            history.pushState(null, '/channels/')
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

    got_profile(profileObj) {
        AppDispatcher.dispatch({
            actionType: UserConstants.GOT_PROFILE,
            profileObj: profileObj
        })
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
        })
    },

    authenticated(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.AUTHENTICATED,
            user: user
        })
    },

    add_channel(channel) {
        AppDispatcher.dispatch({
            actionType: UserConstants.ADD_CHANNEL,
            channel: channel
        })
    }
}