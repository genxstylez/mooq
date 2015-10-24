import _ from 'lodash';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ChannelConstants from '../constants/ChannelConstants';
import ChannelService from '../services/ChannelService';

export default {
    /*
    @param  {Array}  an array Channel objects
    */
    joined_channels(channels) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_JOIN,
            channels: channels
        })
    },

    /*
    @param {string} id The ID of the channel
    */
    leave(channels) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_LEAVE,
            channels: channels
        })
    },

    got_top_channels(channels) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.GOT_TOP_CHANNELS,
            channels: channels
        })
    },

    /*
    @param {object} msgObj new message object that is published to the channel
    */
    recv_new_message(msg, event, channel_id) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.RECV_MESSAGE,
            msg: msg,
            event: event,
            channel_id: channel_id
        })
    },

    recv_presence(presence, event, channel_id) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.RECV_PRESENCE,
            presence: presence,
            channel_id: channel_id
        })
    },

    recv_history(channel_id, history, timetoken) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.RECV_HISTORY,
            channel_id: channel_id,
            history: history,
            timetoken: timetoken
        })
    },

    got_here_now(Obj) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.GOT_HERE_NOW,
            Obj: Obj
        })
    },

    mark_as_active(channel_id) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_ACTIVE,
            channel_id: channel_id
        })
    }
}