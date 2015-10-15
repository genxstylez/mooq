import React from 'react';
import ReactDOM from 'react-dom';
import TextArea from 'react-textarea-autosize'
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import UserStore from '../stores/UserStore';

let user = UserStore.user;

export default React.createClass({
    getInitialState() {
        return {
            value: ''
        }
    },

    componentDidMount() {
        ChannelStore.addMessageCreatedListener(this._onMessageCreated);
    },

    ComponentWillUnmount() {
         ChannelStore.removeMessageCreatedListener(this._onMessageCreated);
    },

    _onMessageCreated(channel_id) {
        if(this.props.id == channel_id)
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
            e.preventDefault();
            if(this.state.value)
                ChannelActions.create_new_message(this.props.id, user.username, this.state.value);
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