import _ from 'lodash';
import request from 'superagent-bluebird-promise';
import UserActions from '../actions/UserActions';
import UserConstants from '../constants/UserConstants';

class UserService {
    get_session(fn) {
        return request
            .get(Urls['me-list']())
            .end((err, res) => {
                res.ok ? this.authenticated(res.body) : this.create_guest()
                fn();
            });
    }

    async_authenticate() {
        return request
            .get(Urls['me-list']())
            .promise()
    }

    authenticated(user) {
        UserActions.authenticated(user);
    }

    logout() {
        return request
            .get(Urls['logout'])
            .end()
    }

    create_guest() {
        UserActions.create_guest()
    }

}

export default new UserService()