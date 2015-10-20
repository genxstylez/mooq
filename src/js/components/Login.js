import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { Link, History } from 'react-router'
import UserStore from '../stores/UserStore'
import UserActions from '../actions/UserActions'
import UserService from '../services/UserService'
import ValidationService from '../services/ValidationService'
import SemanticInput from './SemanticInput'
import classnames from 'classnames'
import FacebookOAuthMixin from '../mixins/FacebookOAuthMixin'
import FacebookLoginButton from './FacebookLoginButton'

export default React.createClass({
    mixins: [History],

    getInitialState() {
        return({
            pw_is_valid: true,
            username_is_valid: true,
            email_is_valid: true,
            new_social: false,
            password: '',
            username: '',
            email: '',
            is_authenticated: UserStore.is_authenticated,
            login_invalid_messages: [],
            new_invalid_messages: []
        })
    },

    componentWillMount() {
        // redirect if it's an authenticated session
        if(this.state.is_authenticated)
            this.history.pushState(null, '/');
    },

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.dimmer)).dimmer('setting', {
            closable: false,
            debug: false
        });
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevState.new_social != this.state.new_social) {
            $(ReactDOM.findDOMNode(this.refs.dimmer)).dimmer('toggle')
        }
    },

    handleChange(e) {
        console.log('in handleChange')
        this.setState({
            [e.target.name]: e.target.value
        });
    },

    handleChangePassword(e) {
        if(e.target.value) {
            let ret = ValidationService.validate_password(e.target.value)
            if(ret) {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'password'})
                this.setState({
                    password: e.target.value,
                    pw_is_valid: true,
                    new_invalid_messages: invalid_messages
                });
            } else {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'password'})
                invalid_messages.push({key: 'password', value: 'Password must contain at least one uppercase, one digit and one lowercae, length must be at least 8'})
                this.setState({
                    pw_is_valid: false,
                    new_invalid_messages: invalid_messages
                });
            }
        } else {
            let invalid_messages = _.reject(this.state.invalid_messages, {key: 'password'})
            invalid_messages.push({key: 'password', value: 'Password is required'})
            this.setState({
                pw_is_valid: false,
                new_invalid_messages: invalid_messages
            });
        }

    },

    handleChangeUsername(e) {
        if (e.target.value) {
            ValidationService.validate_username(e.target.value, () => {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'username'})
                this.setState({
                    username: e.target.value,
                    username_is_valid: true,
                    new_invalid_messages: invalid_messages
                })
            }, () => {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'username'})
                invalid_messages.push({key: 'username', value: 'This username is already taken!'})
                this.setState({
                    username_is_valid: false,
                    new_invalid_messages: invalid_messages
                })
            }, () => {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'username'})
                invalid_messages.push({key: 'username', value: 'Username must be either number or characters, length must be 4-30'})
                 this.setState({
                    username_is_valid: false,
                    new_invalid_messages: invalid_messages
                })
            })
        } else {
            let invalid_messages = _.reject(this.state.invalid_messages, {key: 'email'})
            invalid_messages.push({key: 'username', value: 'Username is required'})
             this.setState({
                username_is_valid: false,
                new_invalid_messages: invalid_messages
            })
        }
    },

    handleChangeEmail(e) {
        if(e.target.value) {
            ValidationService.validate_email(e.target.value, () => {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'email'})
                this.setState({
                    email: e.target.value,
                    email_is_valid: true,
                    new_invalid_messages: invalid_messages
                })
            }, () => {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'email'})
                invalid_messages.push({key: 'email', value: 'This emails is already taken!'})
                this.setState({
                    email_is_valid: false,
                    new_invalid_messages: invalid_messages
                })
            }, () => {
                let invalid_messages = _.reject(this.state.invalid_messages, {key: 'email'})
                invalid_messages.push({key: 'email', value: 'Email is invalid'})
                this.setState({
                    email_is_valid: false,
                    new_invalid_messages: invalid_messages
                })
            })
        } else {
            let invalid_messages = _.reject(this.state.invalid_messages, {key: 'email'})
            invalid_messages.push({key: 'email', value: 'Email is required'})
            this.setState({
                email_is_valid: false,
                new_invalid_messages: invalid_messages
            })
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        UserService.login({...this.state})
        .then((res) => {
            UserActions.login(res.body.token)
            // history.replaceState(null, 'channels')
        })
        .catch((err) => {
            let invalid_messages = [];
            invalid_messages.push({key: 'login', value: 'Incorrect username and password, please check it again'})
            this.setState({
                login_invalid_messages: invalid_messages
            });
        })
    },

    handleNewSocialSubmit(e) {
        e.preventDefault()
        if (this.state.pw_is_valid && this.state.email_is_valid && this.state.username_is_valid) {
            UserService.register({...this.state})
            .then(UserService.login_with_social({...this.state}))
            .then((res) => {
                UserActions.login(res.body.token)
            })
            .catch((err) => {
                alert('An error occured, please try again!')
            })
        }
    },

    handleNewSocial(access_token) {
        this.setState({
            invalid_messages: [],
            pw_is_valid: true,
            email_is_valid: true,
            username_is_valid: true,
            access_token: access_token,
            backend: 'facebook'
        });
        let that = this
        FB.api('/me?fields=email', (response) => {
            that.setState({
                email: response.email,
                new_social: true
            });
        });
    },

    handleCancelDimmer() {
        this.setState({
            new_social: false
        });
    },

    render() {
        let dimmable_cls = classnames({
            column: true,
            dimmable: true,
            blurring: true,
            dimmed: this.state.new_social,
        })
        let dimmer_class = classnames({
            ui: true,
            transition: true,
            hidden: !this.state.new_social,
            dimmer: true,
        })
        return(
            <div className="login ui middle aligned center aligned grid ">
                <div className={dimmable_cls} ref="dimmable">
                    <h2 className="ui header teal">
                        <div className="content">Log In</div>
                    </h2>

                    <form className="ui large form" onSubmit={this.handleSubmit}>
                        <div className="ui piled segment">

                            <SemanticInput required={true} icon={true} name="username" placeholder="Username" type="text" onChange={this.handleChange} validation={false}>
                                <i className="user icon" />
                            </SemanticInput>

                            <SemanticInput required={true} icon={true} name="password" placeholder="Password" type="password" onChange={this.handleChange} validation={false}>
                                <i className="lock icon" />
                            </SemanticInput>

                            <button type="submit" className="field ui fluid large basic teal button">Login</button>

                            <FacebookLoginButton className="field ui fluid large facebook button" new_social={this.handleNewSocial}>
                                <i className="facebook icon"></i>
                                Login in with Facebook
                            </FacebookLoginButton>
                        </div>
                    </form>
                    {
                        this.state.login_invalid_messages.length > 0 ?
                        <div className="ui error message">
                            <ul className="list">
                                {
                                    _.map(this.state.invalid_messages, (message) => {
                                        return (<li key={message.key}>{message.value}</li>)
                                    })
                                }
                            </ul>
                        </div>
                        : null
                    }
                    <div className="ui message">
                        New to us? <Link to="/signup/">Sign Up</Link>
                    </div>
                </div>
                <div className={dimmer_class} ref="dimmer">
                    <div className="content">
                        <div className="center">
                            <div style={{maxWidth: '450px', minWidth: '400px', margin: '0 auto'}}>
                                <h2>Please enter username and password</h2>
                                <form className="ui large form" method="post" onSubmit={this.handleNewSocialSubmit}>

                                    <SemanticInput required={true} icon={true} name="username" placeholder="Username" validation={true}
                                        type="text" onChange={this.handleChangeUsername} autoComplete="off" is_valid={this.state.username_is_valid}>
                                        <i className="user icon" />
                                    </SemanticInput>

                                    <SemanticInput required={true} icon={true} name="password" placeholder="Password" validation={true}
                                        type="password" onChange={this.handleChangePassword} autoComplete="off" is_valid={this.state.pw_is_valid}>
                                        <i className="lock icon" />
                                    </SemanticInput>
                                    <button type="submit" className="field ui fluid large teal button">Sign Up</button>
                                    <button type="button" className="field ui fluid large button" onClick={this.handleCancelDimmer}>Cancel</button>
                                </form>
                                {
                                    this.state.new_invalid_messages.length > 0 ?
                                    <div className="ui error message">
                                        <ul className="list">
                                            {
                                                _.map(this.state.invalid_messages, (message) => {
                                                    return (<li key={message.key}>{message.value}</li>)
                                                })
                                            }
                                        </ul>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
