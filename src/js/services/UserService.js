import _ from 'lodash';
import request from 'superagent-bluebird-promise';
import UserActions from '../actions/UserActions';
import UserConstants from '../constants/UserConstants';

export default {

    register(credentials) {
        return request
            .post(Urls['api-register']())
            .send(credentials)
            .promise()

    },

    login(credentials) {
        return request
            .post(Urls['api-login']())
            .send(credentials)
            .promise()
    },

    login_with_social(credentials, cb) {
        return request
            .post(Urls['api-social-auth']())
            .send(credentials)
            .promise()
    },

    get_session(fn) {
        return request
            .get(Urls['me-list']())
            .end((err, res) => {
                res.ok ? this.authenticated(res.body) : this.create_guest()
                fn();
            });
    },

    async_authenticate() {
        return request
            .get(Urls['me-list']())
            .promise()
    },

    authenticated(user) {
        UserActions.authenticated(user);
    },

    logout() {
        UserActions.logout()
    },

    create_guest() {
        UserActions.create_guest()
    }

}
