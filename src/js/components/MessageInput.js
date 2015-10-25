import React from 'react'
import ReactDOM from 'react-dom'
import TextArea from 'react-textarea-autosize'
import ChannelStore from '../stores/ChannelStore'
import ChannelService from '../services/ChannelService'
import UserStore from '../stores/UserStore'

export default React.createClass({
    getInitialState() {
        return {
            value: '',
            user: UserStore.user,
            is_authenticated: UserStore.is_authenticated
        }
    },

    _onMessageCreated(channel_id) {
        if(this.props.channel_id == channel_id)
            this.setState({
                value: ''
            });
    },

    handleChange(e) {
        var value = e.target.value;
        this.setState({
            value: value
        });
    },

    handleKeyPress(e) {
        if(e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if(this.state.is_authenticated){
                if(this.state.value)
                    ChannelService.create_message(
                        this.props.channel_id, this.state.user.username,  this.state.value, this.state.user.profile.avatar, () => {
                        this.setState({
                            value: ''
                        })
                    })
            } else {
                alert('Please log in')
            }
        }
    },

    render() {
        return (
            <div className="ui form">
                <div className="field">
                    <TextArea ref="TextArea"
                        rows={2}
                        maxRows={5}
                        placeholder="輸入訊息..."
                        value={this.state.value}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange}
                        onHeightChange={this.props.onHeightChange} />
                </div>
            </div>
        );
    }
});