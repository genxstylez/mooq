import _ from 'lodash';
import ChannelConstants from '../constants/ChannelConstants';
import BaseStore from './BaseStore';


class ChannelStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._channels = []
        this._top_channels = []
        this._active_channel = {}
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case ChannelConstants.CHANNEL_JOIN:
                var changed = false
                _.forEach(action.channels, (channel) => {
                    // for each channel prepare runtime properties such as occupancies and messages
                    if(!this.get_channel(channel.id)) {
                        var channel = this.extend_channel(channel)
                        this._channels = _.union(this._channels.concat(channel)).sort()
                        changed = true
                    }
                })
                if (changed)
                    this.emitChange()
                break

            case ChannelConstants.CHANNEL_LEAVE:
                this._channels = _.filter(this._channels, (channel) => {
                    return !_.findWhere(action.channels, {id: channel.id})
                })
                if(this._channels.length == 0)
                    this._active_channel = {}
                this.emitChange()
                break

            case ChannelConstants.RECV_HISTORY:
                var historyList = action.history[0]
                if(historyList.length > 0) {
                    var channel = this.get_channel(action.channel_id)
                    channel.messages = action.history[0].concat(channel.messages)
                    this.emitChange()
                }
                break

            case ChannelConstants.RECV_MESSAGE:
                var channel = this.get_channel(action.channel_id)
                channel.messages.push(action.msg)
                if(channel.id != this._active_channel.id)
                    channel.unread = true
                this.emitChange()
                break

            case ChannelConstants.RECV_PRESENCE:
                var channel_id = action.channel_id
                var presence = action.presence
                var channel = this.get_channel(channel_id)

                channel.occupancy = presence.occupancy
                if (presence.action == 'join')
                    channel.users = _.union(channel.users.concat(presence.uuid)).sort()

                this.emitChange()
                break

            case ChannelConstants.GOT_TOP_CHANNELS:
                this._top_channels = action.channels
                this.emitChange()
                break

            case ChannelConstants.CHANNEL_ACTIVE:
                this._active_channel = this.get_channel(action.channel_id)
                this._active_channel.unread = false
                this.emitChange()
                break

            case ChannelConstants.GOT_HERE_NOW:
                var changed = false
                _.forEach(action.Obj.channels, (value, key) => {
                    if(!changed) {
                        // skip this if change is already true, an CHANGE event will fire anyway
                        changed = !_.isEqual(this.get_channel(key)['occupancy'], value['occupancy']) ||
                            !_.isEqual(this.get_channel(key)['users'], value['uuids'].sort());
                    }
                    this.get_channel(key)['occupancy'] = value['occupancy']
                    this.get_channel(key)['users'] = value['uuids'].sort()
                });
                if(changed)
                    this.emitChange()
                break

            default:
                break;
        }
    }


    extend_channel(channelObj) {
        return _.merge({}, channelObj, {'occupancy': 0, 'users': [], 'unread': false, 'messages': []})
    }

    get_channel(id) {
        return _.findWhere(this._channels, {'id': id})
    }

    get channels() {
        return this._channels
    }

    get top_channels() {
        return this._top_channels
    }

    get active_channel()  {
        return this._active_channel
    }

}
export default new ChannelStore()
