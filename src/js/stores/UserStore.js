import _ from 'lodash';
import BaseStore from './BaseStore';
import UserConstants from '../constants/UserConstants'

class UserStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = {};
        this._is_authenticated = false;
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case UserConstants.CREATE_GUEST:
                var username = pubnub.get_uuid()  // this is set from base.html
                var user = {
                    username: username,
                    uuid: username,
                    channels: []
                }
                this._user = user;
                this.emitChange();
                break;

            case UserConstants.AUTHENTICATED:
                this._user = action.user;
                this._is_authenticated = true;
                this.emitChange();
                break;

            default:
                break;
        }

    }

    get user() {
        return this._user;
    }

    get is_authenticated() {
        return this._is_authenticated;
    }
}

export default new UserStore()