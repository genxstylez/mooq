import _ from 'lodash';
import AppDispatcher from '../dispatchers/AppDispatcher';
import UserConstants from '../constants/UserConstants';

export default {
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