import _ from 'lodash';
import when from 'when';
import request from 'superagent';
import UserActions from '../actions/UserActions';
import UserConstants from '../constants/UserConstants';

class UserService {
    authenticate() {
        return when(request
            .get(Urls['me-list']())
            .end());
    }

}

export default new UserService()