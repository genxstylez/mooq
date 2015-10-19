import _ from 'lodash'
import BaseStore from './BaseStore'
import UserConstants from '../constants/UserConstants'
import jwt_decode from 'jwt-decode'

class UserStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = null;
        this._jwt = null;
        this._is_authenticated = false;
        this._isGuest = true;
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case UserConstants.LOGIN:
                this._jwt = action.jwt
                this._user = jwt_decode(this._jwt)
                this._user['uuid'] = this._user.username
                this._isGuest = false
                this.emitChange()
                break

            case UserConstants.LOGOUT:
                // TODO: unsubscribe channels before setting user to null
                this._user = null;
                this.emitChange()
                break

            case UserConstants.CREATE_GUEST:
                let username = pubnub.get_uuid()  // this is set from base.html
                let user = {
                    username: username,
                    uuid: username,
                    channels: []
                }
                this._user = user
                this._isGuest = true
                this.emitChange()
                break

            case UserConstants.AUTHENTICATED:
                this._user = action.user
                this._is_authenticated = true
                this.emitChange()
                break

            default:
                break
        }

    }

    get user() {
        return this._user;
    }

    get is_authenticated() {
        console.log(!!this._user)
        console.log(this._isGuest, !this.is_Guest)
        return !!this._user && !this._isGuest
    }

    get jwt() {
        return this._jwt;
    }
}

export default new UserStore()