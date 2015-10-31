import _ from 'lodash'
import request from 'superagent-bluebird-promise'
import UserActions from '../actions/UserActions'
import UserConstants from '../constants/UserConstants'
import ChannelStore from '../stores/ChannelStore'
import ChannelService from '../services/ChannelService'

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

    refresh_token(jwt) {
        return request
            .post(Urls['api-token-refresh']())
            .send({token: jwt})
            .promise()
    },


    get_profile(user_id) {
        return request
            .get(Urls['user-detail'](user_id))
            .promise()
    },

    authenticated(user) {
        UserActions.authenticated(user);
    },

    logout() {
        ChannelService.leave_channels(ChannelStore.joinedChannels)
        UserActions.logout()
        this.create_guest()
    },

    create_guest() {
        UserActions.create_guest()
    },

    subscribe_to_channel(token, channel_id, user_id) {
        return request
            .post(Urls['subscribers-list']())
            .set('Content-Type', 'application/json')
            .set('Authorization', 'JWT ' + token)
            .send({channel: channel_id})
            .send({user: user_id})
            .promise()
    },

}
