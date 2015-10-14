import _ from 'lodash';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ChannelConstants from '../constants/ChannelConstants';

export default {
    /*
    @param  {object} id Channel object
    */
    join(channels) {
        _.forEach(channels, (channel) => {
            AppDispatcher.dispatch({
                actionType: ChannelConstants.CHANNEL_JOIN,
                channel: channel
            });
        });
    },

    /*
    @param {string} id The ID of the channel
    */
    leave(id) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_DELETE,
            id: id
        });
    },

    /*
    @param {string} id The ID of the channel
    @param {object} msgObj new message object that is published to the channel
    */
    update(channel, msgObj) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_UPDATE,
            id: id,
            msgObj: msgObj
        });
    },


    /*
    @param {object} msgObj new message object that is published to the channel
    */
    new_message(msgObj) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.NEW_MESSAGE,
            msgObj: msgObj
        });
    },

    mark_as_active(channel) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_ACTIVE,
            channel: channel
        });
    }
}