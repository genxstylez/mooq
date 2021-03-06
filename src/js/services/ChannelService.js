import _ from 'lodash'
import request from 'superagent-bluebird-promise'
import ChannelActions from '../actions/ChannelActions'
import ChannelConstants from '../constants/ChannelConstants'
import ChannelStore from '../stores/ChannelStore'

export default {
    get_channels(offset, limit, search_kw, asc) {
        return request
            .get(Urls['channel-list']())
            .query({offset: offset || 0})
            .query({limit: limit || 50})
            .query({fields: 'id,name,subscribers_count'})
            .query({search: search_kw})
            .query({ordering: asc ? 'subscribers_count' : '-subscribers_count'})
            .promise()
    },

    get_subscribed_channels(user_id) {
        return request
            .get(Urls['channel-list']())
            .query({subscribers__user__id: user_id})
            .query({fields: 'id,name,subscribers_count'})
            .query({ordering: 'subscribers_count'})
            .promise()
    },

    get_channel_info(channel_id) {
        return request
            .get(Urls['channel-detail'](channel_id))
            .promise()
    },

    grant(token, channels) {
        return request
            .post(Urls['api-grant']())
            .send({'authKey': token})
            .send({'channels': _.pluck(channels, 'id')})
            .promise()
    },


    get_subscriber_id(channel_id, user_id) {
        return request
            .get(Urls['subscribers-list']())
            .query({channel__id: channel_id})
            .query({user__id: user_id})
            .promise()
    },

    unsubscribe_channel(token, subscriber_id) {
        return request
            .del(Urls['subscribers-detail'](subscriber_id))
            .set('Content-Type', 'application/json')
            .set('Authorization', 'JWT ' + token)
            .promise()
    },


    create_message(channel_id, username, text, avatar, cb) {
        pubnub.publish({
            channel: channel_id,
            message: {
                text: text,
                uuid: username,
                timestamp: Date.now(),
                avatar: avatar
            },
            callback: cb(),
            error: (err) => {
                alert('Something went wrong!')
            }
        })
    },

    join_channels(channels) {
        channels = _.reject(channels, (channel) => {
            return ChannelStore.has_joinedChannel(channel.id)
        })
        if(channels.length > 0) {
            pubnub.subscribe({
                channel: _.pluck(channels, 'id'),
                message: (msg, ev, ch) => {
                    ChannelActions.recv_new_message(msg, ev, ch);
                },
                error: (error) => {
                    if(error.status == 403) {
                        console.log('403')
                        this.grant(ChannelStore.authKey, channels)
                    }
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

    leave_channels(channels) {
        pubnub.unsubscribe({
            channel: _.pluck(channels, 'id'),
        })
        ChannelActions.leave(channels)
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


}