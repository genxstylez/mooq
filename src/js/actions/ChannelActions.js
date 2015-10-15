import _ from 'lodash';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ChannelConstants from '../constants/ChannelConstants';
import ChannelService from '../services/ChannelService';

export default {
    /*
    @param  {object} id Channel object
    */
    join(channels) {
        ChannelService.join_channels(channels, (msgObj) => {
                this.recv_new_message(msgObj);
            },
            () => {
                _.forEach(channels, (channel) => {
                    AppDispatcher.dispatch({
                        actionType: ChannelConstants.CHANNEL_JOIN,
                        channel: channel
                    });
                    ChannelService.get_history(channel.id, this.got_history); // get history upon joining channel
                });
            }
        );
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
    create_new_message(channel_id, username, msgObj) {
        ChannelService.create_message(channel_id, username, msgObj, () => {
            AppDispatcher.dispatch({
                actionType: ChannelConstants.CREATE_NEW_MESSAGE,
                msgObj: msgObj
            });
        });
    },

    /*
    @param {object} msgObj new message object that is published to the channel
    */
    recv_new_message(msgObj) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.RECV_NEW_MESSAGE,
            msgObj: msgObj
        });
    },

    got_history(channel_id, history, timetoken) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.GOT_HISTORY,
            channel_id: channel_id,
            history: history,
            timetoken: timetoken
        });
    },



    mark_as_active(channel_id) {
        AppDispatcher.dispatch({
            actionType: ChannelConstants.CHANNEL_ACTIVE,
            channel_id: channel_id
        });
    }
}