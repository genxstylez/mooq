import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { History } from 'react-router'
import jwt_decode from 'jwt-decode'
import FacebookOAuthMixin from '../mixins/FacebookOAuthMixin'
import SetIntervalMixin from '../mixins/SetIntervalMixin'
import UserStore from '../stores/UserStore'
import UserService from '../services/UserService'
import UserActions from '../actions/UserActions'
import ChannelService from '../services/ChannelService'
import ChannelActions from '../actions/ChannelActions'


export default React.createClass({
    mixins: [FacebookOAuthMixin, SetIntervalMixin, History],

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
        this.get_top_channels()
        if(this.state.is_authenticated) {
            this.get_profile(this.state.user.user_id)
        }
    },

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);
        if(this.state.is_authenticated) {
            // Do a refresh token here if authenticated
            this.setInterval(this.checkToken, 36000000, true)
        }
    },

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevState.is_authenticated != this.state.is_authenticated) {
            if(this.state.is_authenticated) {
                this.get_profile(this.state.user.user_id)
            }
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

    get_profile(user_id) {
        UserService.get_profile(this.state.user.user_id)
            .then((res) => {
                UserActions.got_profile(res.body)
            })
            .catch((err) => {
                console.log(err)
            })
    },

    get_top_channels() {
        // Get top 10 channels
        ChannelService.get_channels(0, 50)
            .then((res)=> {
                ChannelActions.got_channels(res.body.results)
            })
            .catch((err) => {
                console.log(err)
                alert('App: get top channels: Something went wrong')
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