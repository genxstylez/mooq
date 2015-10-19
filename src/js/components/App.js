import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import FacebookOAuthMixin from '../mixins/FacebookOAuthMixin'
import UserStore from '../stores/UserStore'
import UserService from '../services/UserService'
import UserActions from '../actions/UserActions'


export default React.createClass({
    mixins: [FacebookOAuthMixin],

    getInitialState() {
        return {
            is_authenticated: UserStore.is_authenticated
        }
    },

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnMount() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({
            is_authenticated: UserStore.is_authenticated
        })
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