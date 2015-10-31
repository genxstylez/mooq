import _ from 'lodash';
import ChannelConstants from '../constants/ChannelConstants';
import BaseStore from './BaseStore';


class ChannelStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._joinedChannels = []
        this._channels = []
        this._active_channel = {}
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case ChannelConstants.CHANNEL_JOIN:
                _.forEach(action.channels, (channel) => {
                    // for each channel prepare runtime properties such as occupancies and messages
                    var channel = this.extend_joinedChannel(channel)
                    this._joinedChannels = _.union(this._joinedChannels.concat(channel)).sort()
                })
                this.emitChange()
                break

            case ChannelConstants.CHANNEL_LEAVE:
                this._joinedChannels = _.filter(this._joinedChannels, (channel) => {
                    return !_.findWhere(action.channels, {id: channel.id})
                })
                this.emitChange()
                break

            case ChannelConstants.RECV_HISTORY:
                var historyList = action.history[0]
                if(historyList.length > 0) {
                    var channel = this.get_joinedChannel(action.channel_id)
                    channel.messages = action.history[0].concat(channel.messages)
                    this.emitChange()
                }
                break

            case ChannelConstants.RECV_MESSAGE:
                var channel = this.get_joinedChannel(action.channel_id)
                channel.messages.push(action.msg)
                if(channel.id != this._active_channel.id)
                    channel.unread = true
                this.emitChange()
                break

            case ChannelConstants.RECV_PRESENCE:
                var channel_id = action.channel_id
                var presence = action.presence
                var channel = this.get_joinedChannel(channel_id)

                channel.occupancy = presence.occupancy
                if (presence.action == 'join')
                    channel.users = _.union(channel.users.concat(presence.uuid)).sort()

                this.emitChange()
                break

            case ChannelConstants.GOT_CHANNELS:
                this._channels = this._channels.concat(action.channels)
                this.emitChange()
                break

            case ChannelConstants.CHANNEL_ACTIVE:
                this._active_channel = this.get_joinedChannel(action.channel_id)
                this._active_channel.unread = false
                this.emitChange()
                break

            case ChannelConstants.GOT_HERE_NOW:
                var changed = false
                _.forEach(action.Obj.channels, (value, key) => {
                    if(!changed) {
                        // skip this if change is already true, an CHANGE event will fire anyway
                        changed = !_.isEqual(this.get_joinedChannel(key)['occupancy'], value['occupancy']) ||
                            !_.isEqual(this.get_joinedChannel(key)['users'], value['uuids'].sort());
                    }
                    this.get_joinedChannel(key)['occupancy'] = value['occupancy']
                    this.get_joinedChannel(key)['users'] = value['uuids'].sort()
                });
                if(changed)
                    this.emitChange()
                break

            default:
                break;
        }
    }


    extend_joinedChannel(channelObj) {
        return _.merge({}, channelObj, {occupancy: 0, users: [], unread: false, messages: [], preview: true})
    }

    get_joinedChannel(channel_id) {
        return _.findWhere(this._joinedChannels, {id: channel_id})
    }

    has_joinedChannel(channel_id) {
        return this.get_joinedChannel(channel_id) != undefined
    }

    get joinedChannels() {
        return this._joinedChannels
    }

    get channels() {
        return this._channels
    }

}
export default new ChannelStore()
