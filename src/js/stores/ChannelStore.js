import _ from 'lodash';
import ChannelConstants from '../constants/ChannelConstants';
import BaseStore from './BaseStore';


class ChannelStore extends BaseStore {

    constructor() {
        super()
        this.subscribe(() => this._registerToActions.bind(this));
        this._channels = [];
        this._active_channel = {};
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case ChannelConstants.CHANNEL_JOIN:
                this._channels.push(action.channel);
                this._channels = _.union(this._channels);
                this.emitChange();
                break;

            case ChannelConstants.GOT_HISTORY:
                var channel = _.filter(this._channels, {id: action.channel_id})[0];
                if(_.has(channel, 'messages'))
                    channel.messages.unshift(action.history[0])
                else
                    channel['messages'] = action.history[0]
                this.emitChange();
                break;

            case ChannelConstants.RECV_NEW_MESSAGE:
                var channel = _.filter(this._channels, {id: action.msgObj.channel})[0];
                if(_.has(channel, 'messages'))
                    channel.messages.push(action.msgObj)
                else
                    channel['messages'] = [action.msgObj];
                if(channel.id != this._active_channel.id) {
                    channel['unread'] = true;
                }
                this.emitChange();
                break;

            case ChannelConstants.CHANNEL_ACTIVE:
                this._active_channel = this.get_channel(action.channel_id);
                this._active_channel.unread = false;
                this.emitChange();
                break;

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
                    this.emitChange();
                break;

            case ChannelConstants.CREATE_NEW_MESSAGE:
                this.emitMessageCreated(this._active_channel.id);
                break;
            default:
                break;
        }
    }

    emitMessageCreated(channel_id) {
        this.emit('MESSAGE_CREATED', channel_id);
    }

    addMessageCreatedListener(cb) {
        this.on('MESSAGE_CREATED', cb)
    }

    removeMessageCreatedListener(cb) {
        this.removeListener('MESSAGE_CREATED', cb);
    }

    get_channel(id) {
        return _.filter(this._channels, {'id': id})[0]
    }

    get channels() {
        return this._channels;
    }

    get active_channel()  {
        return this._active_channel;
    }

}
export default new ChannelStore()
