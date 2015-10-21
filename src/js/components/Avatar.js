import React from 'react'
import ReactDOM from 'react-dom'
import UserService from '../services/UserService'

export default React.createClass({
    getInitialState() {
        return {
            is_authenticated: this.props.is_authenticated,
            user: this.props.user
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps != this.state) {
            this.setState({...nextProps})
        }

    },

    handleSignout() {
        UserService.logout()
    },

    render() {
        return (
                <div id="avatar">
                    {this.state.is_authenticated ?
                        <div>
                            <img className="ui avatar image" src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                            <span>{this.props.username}</span>
                            <i className="sign out icon link" onClick={this.handleSignout}></i>
                        </div>
                    : null
                    }

                </div>
            )
    }
})