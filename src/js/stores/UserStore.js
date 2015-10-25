import _ from 'lodash'
import BaseStore from './BaseStore'
import UserConstants from '../constants/UserConstants'
import jwt_decode from 'jwt-decode'

class UserStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = null
        this._jwt = null
        this._authKey = null
        this._is_authenticated = false
        this._isGuest = true
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case UserConstants.LOGIN:
                this._jwt = action.jwt
                this._authKey = this._jwt
                this._user = jwt_decode(this._jwt)
                this._user = this.extend_user(this._user)
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
                let username = 'Guest' + Math.floor((Math.random() * 9999999) + 1)
                this._user = {
                    username: username,
                    uuid: username,
                    channels: []
                }
                this._isGuest = true
                this._authKey = username
                this.emitChange()
                break

            case UserConstants.AUTHENTICATED:
                this._user = action.user
                this._is_authenticated = true
                this.emitChange()
                break

            case UserConstants.GOT_PROFILE:
                this._user.profile.is_verified = action.profileObj.profile.is_verified
                this._user.profile.follows = action.profileObj.profile.follows
                if(action.profileObj.profile.avatar)
                this._user.profile.avatar = action.profileObj.profile.avatar
                this.emitChange()
                break

            default:
                break
        }

    }

    extend_user(userObj) {
        return _.merge({}, userObj, {
            uuid: null,
            profile: {
                is_verified: false,
                avatar: STATIC_URL + 'img/avatar.png',
                follows: []
            }
        })
    }

    get user() {
        return this._user
    }

    get is_authenticated() {
        return !!this._user && !this._isGuest
    }

    get jwt() {
        return this._jwt
    }

    get authKey() {
        return this._authKey
    }
}

export default new UserStore()