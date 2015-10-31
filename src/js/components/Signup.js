import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { Link, History } from 'react-router'
import {t as __} from 'i18next-client'
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
            pw_is_valid: false,
            username_is_valid: false,
            email_is_valid: false,
            new_social: false,
            is_authenticated: UserStore.is_authenticated,
            password: '',
            username: '',
            email: '',
            access_token: '',
            email_error_message: '',
            username_error_message: '',
            pw_error_message: '',
        })
    },

    componentWillMount() {
        // redirect if it's an authenticated session
        if(this.state.is_authenticated)
            this.history.pushState(null, '/channels/');
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

    handleChangePassword(e) {
        if(e.target.value) {
            let ret = ValidationService.validate_password(e.target.value)
            if(ret) {
                this.setState({
                    password: e.target.value,
                    pw_is_valid: true,
                    pw_error_message: ''
                });
            } else {
                this.setState({
                    pw_is_valid: false,
                    pw_error_message: __('Password must contain at least one uppercase, one digit and one lowercae, length must be at least 8')
                });
            }
        } else {
            this.setState({
                pw_is_valid: false,
                pw_error_message: __('Please enter your password')
            });
        }

    },

    handleChangeUsername(e) {
        if (e.target.value) {
            ValidationService.validate_username(e.target.value.toLowerCase(), () => {
                this.setState({
                    username: e.target.value,
                    username_is_valid: true,
                    username_error_message: ''
                })
            }, () => {
                this.setState({
                    username_is_valid: false,
                    username_error_message: __('This username is already taken!')
                })
            }, () => {
                 this.setState({
                    username_is_valid: false,
                    username_error_message: __('Username must be either number or characters, length must be 4-30')
                })
            })
        } else {
             this.setState({
                username_is_valid: false,
                username_error_message: __('Please enter your username')
            })
        }
    },

    handleChangeEmail(e) {
        if(e.target.value) {
            ValidationService.validate_email(e.target.value.toLowerCase(), () => {
                this.setState({
                    email: e.target.value,
                    email_is_valid: true,
                    email_error_message: ''
                })
            }, () => {
                this.setState({
                    email_is_valid: false,
                    email_error_message: __('This email is already taken!')
                })
            }, () => {
                this.setState({
                    email_is_valid: false,
                    email_error_message: __('This does not look like an email')
                })
            })
        } else {
            this.setState({
                email_is_valid: false,
                email_error_message: __('Please enter your email')
            })
        }
    },

    handleSubmit(e) {
        e.preventDefault()
        let payload = {
            email: this.state.email.toLowerCase(),
            username: this.state.username.toLowerCase(),
            password: this.state.password
        }
        if (this.state.pw_is_valid && this.state.email_is_valid && this.state.username_is_valid) {
            UserService.register({...payload})
            .then((res) => {
                UserActions.login(res.body.token)
            })
            .catch((err) => {
                alert(__('An error occured, please try again!'))
            })
        }
    },

    handleNewSocialSubmit(e) {
        e.preventDefault();
        if (this.state.pw_is_valid && this.state.email_is_valid && this.state.username_is_valid) {
            UserService.register({...this.state})
            .then(UserService.login_with_social({...this.state}))
            .then((res) => {
                UserActions.login(res.body.token)
            })
            .catch((err) => {
                alert(__('An error occured, please try again!'))
            })
        }
    },

    handleNewSocial(access_token) {
        this.setState({
            username_error_message: '',
            pw_error_message: '',
            email_error_message: '',
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
            <div className="background">
                <div className="login ui middle aligned center aligned grid ">
                    <div className={dimmable_cls} ref="dimmable">
                        <h2 className="ui image bottom aligned header white">
                            <img src={LOGO_URL} />
                            <div className="content">{__('Join us')}</div>
                        </h2>

                        <div className="ui piled segment">
                            <form className="ui large form" method="post" onSubmit={this.handleSubmit}>
                                <SemanticInput required={true} icon={true} name="email" placeholder={__('Email')} validation={true}
                                    type="email" onChange={this.handleChangeEmail} autoComplete="off"
                                    is_valid={this.state.email_is_valid} error_message={this.state.email_error_message}>
                                    <i className="mail icon" />
                                </SemanticInput>

                                <SemanticInput required={true} icon={true} name="username" placeholder={__('Username')} validation={true}
                                    type="text" onChange={this.handleChangeUsername} autoComplete="off"
                                    is_valid={this.state.username_is_valid} error_message={this.state.username_error_message}>
                                    <i className="user icon" />
                                </SemanticInput>

                                <SemanticInput required={true} icon={true} name="password" placeholder={__('Password')} validation={true}
                                    type="password" onChange={this.handleChangePassword} autoComplete="off"
                                    is_valid={this.state.pw_is_valid} error_message={this.state.pw_error_message}>
                                    <i className="lock icon" />
                                </SemanticInput>
                                <button type="submit" className="field ui fluid large basic teal button">{__('Sign Up')}</button>

                                <FacebookLoginButton className="field ui fluid large facebook button" new_social={this.handleNewSocial}>
                                    <i className="facebook icon"></i>
                                    {__('Sign up with Facebook')}
                                </FacebookLoginButton>
                            </form>
                        </div>

                        <div className="ui bottom message">
                            {__('Have an account?')} <Link to="/login/">{__('Sign in')}</Link>
                        </div>

                    </div>
                    <div className={dimmer_class} ref="dimmer">
                        <div className="content">
                            <div className="center">
                                <div style={{maxWidth: '450px', minWidth: '400px', margin: '0 auto'}}>
                                    <h2>{__('Please enter username and password')}</h2>
                                    <form className="ui large form" method="post" onSubmit={this.handleNewSocialSubmit}>

                                        <SemanticInput required={true} icon={true} name="username" placeholder={__('Username')} validation={true}
                                            type="text" onChange={this.handleChangeUsername} autoComplete="off"
                                            is_valid={this.state.username_is_valid} error_message={this.state.username_error_message}>
                                            <i className="user icon" />
                                        </SemanticInput>

                                        <SemanticInput required={true} icon={true} name="password" placeholder={__('Password')} validation={true}
                                            type="password" onChange={this.handleChangePassword} autoComplete="off"
                                            is_valid={this.state.pw_is_valid} error_message={this.state.pw_error_message}>
                                            <i className="lock icon" />
                                        </SemanticInput>

                                        <button type="submit" className="field ui fluid large teal button">{__('Sign Up')}</button>
                                        <button type="button" className="field ui fluid large button" onClick={this.handleCancelDimmer}>{__('Cancel')}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
