import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import jwt_decode from 'jwt-decode'
import FacebookOAuthMixin from '../mixins/FacebookOAuthMixin'
import SetIntervalMixin from '../mixins/SetIntervalMixin'
import UserStore from '../stores/UserStore'
import UserService from '../services/UserService'
import UserActions from '../actions/UserActions'


export default React.createClass({
    mixins: [FacebookOAuthMixin, SetIntervalMixin],

    getInitialState() {
        return {
            is_authenticated: UserStore.is_authenticated,
            jwt: UserStore.jwt
        }
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

    _onChange() {
        this.setState({
            is_authenticated: UserStore.is_authenticated,
            jwt: UserStore.jwt
        })
    },

    checkToken() {
        let token_details = jwt_decode(this.state.jwt)
        if(token_details.exp < Date.now()) {
            // if token exipred
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
                    UserActions.login(res.body.jwt)
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