import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import jwt_decode from 'jwt-decode'
import FacebookOAuthMixin from '../mixins/FacebookOAuthMixin'
import SetIntervalMixin from '../mixins/SetIntervalMixin'
import UserStore from '../stores/UserStore'
import UserService from '../services/UserService'
import UserActions from '../actions/UserActions'
import ChannelService from '../services/ChannelService'


export default React.createClass({
    mixins: [FacebookOAuthMixin, SetIntervalMixin],

    getInitialState() {
        return {
            is_authenticated: UserStore.is_authenticated,
            user: UserStore.user,
            authKey: UserStore.authKey,
            jwt: UserStore.jwt
        }
    },
    componentWillMount() {
        this.initialise_PubNub()
        this.handleAuthenticatedChange()
    },

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);
        if(this.state.is_authenticated) {
            // Do a refresh token here if authenticated
            this.setInterval(this.checkToken, 36000000, true)
        }
    },

    componentWillUnMount() {
        UserStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevState.is_authenticated != this.state.is_authenticated) {
            if(this.state.is_authenticated)
                this.handleAuthenticatedChange()
        }

        if(prevState.authKey != this.state.authKey) {
            this.initialise_PubNub()
        }
    },

    initialise_PubNub() {
        window.pubnub = PUBNUB.init({
            publish_key: 'pub-c-b0729086-9a78-4ebc-b04f-f87bd208d0fe',
            subscribe_key: 'sub-c-4daa87ec-5f9d-11e5-bc11-0619f8945a4f',
            uuid: this.state.user.username,
            auth_key: this.state.authKey
        })
    },

    handleAuthenticatedChange() {
        // Get channel list and join them
        ChannelService.get_subscribed_channels(this.state.user.user_id)
        .then((res) => {
            let channels = res.body
            if (channels.length > 0) {
                ChannelService.grant(this.state.authKey, channels)
                .then(() => {
                    ChannelService.join_channels(channels)
                })
            } else {
                this.history.replaceState(null, '/search/')
            }
        })
    },

    _onChange() {
        this.setState({
            is_authenticated: UserStore.is_authenticated,
            jwt: UserStore.jwt,
            authKey: UserStore.authKey,
            user: UserStore.user
        })
    },

    checkToken() {
        let token_details = jwt_decode(this.state.jwt)
        if(token_details.exp*1000 < Date.now()) {
            // if token expired
            UserService.refresh_token(this.state.jwt)
                .then((res) => {
                    UserActions.refresh(res.body.token)
                })
                .catch((res) => {
                    UserActions.logout()
                })
        }
    },

    statusChangeCallback(response) {
        if (response.status === 'connected') {
            var access_token = response.authResponse.accessToken;
            if (!this.state.is_authenticated) {
                // only attempt authentication if user is not authenticate
                UserService.login_with_social({
                    access_token: access_token,
                    backend: 'facebook'
                })
                .then((res) => {
                    UserActions.login(res.body.token)
                })
                .catch((err) => {
                    console.log(err);
                })

            }
        }
    },

    render() {

        return(
            <div id="app-entry">
                {this.props.children}
            </div>
        )
    }
});