import _ from 'lodash'
import request from 'superagent-bluebird-promise'
import ChannelActions from '../actions/ChannelActions'
import ChannelConstants from '../constants/ChannelConstants'
import ChannelStore from '../stores/ChannelStore'

export default {
    get_subscribed_channels(user_id) {
        return request
            .get(Urls['channels-list']())
            .query({subscribers__user__id: user_id})
            .promise()
    },

    async_get_channel_info(channel_id) {
        return request
            .get(Urls['channels-detail'](channel_id))
            .promise()
    },

    grant(token, channels) {
        return request
            .post(Urls['api-grant']())
            .send({'authKey': token})
            .send({'channels': _.pluck(channels, 'id')})
            .promise()
    },

    create_message(channel_id, username, text, cb) {
        pubnub.publish({
            channel: channel_id,
            message: {
                text: text,
                uuid: username,
                timestamp: Date.now(),
            },
            callback: cb(),
            error: (err) => {
                alert('Something went wrong!')
            }
        })
    },

    join_channels(channels) {
        channels = _.reject(channels, (channel) => {
            return ChannelStore.get_channel(channel.id) != undefined
        })
        if(channels.length > 0) {
            pubnub.subscribe({
                channel: _.pluck(channels, 'id'),
                message: (msg, ev, ch) => {
                    ChannelActions.recv_new_message(msg, ev, ch);
                },
                error: (error) => {
                    alert('error join channel, please try again!');
                },
                presence: (p, ev, ch) => {
                    ChannelActions.recv_presence(p, ev, ch)
                },
                restore: true,
                heartbeat: 30,
                connect: ChannelActions.joined_channels(channels)
            });
        }
    },

    get_history(channel_id, count, timetoken) {
        pubnub.history({
            channel: channel_id,
            start: timetoken,
            count: count || 100,
            callback: (history) => {
                ChannelActions.recv_history(channel_id, history, timetoken);
            }
        });
    },

    get_here_now() {
        pubnub.here_now({
            callback: (Obj) => {
                ChannelActions.got_here_now(Obj);
            }
        })
    },

    unsubscribe(channels) {
        pubnub.unsubscribe({
            channel: channels
        })
        ChannelActions.leave(channels)
    },
}