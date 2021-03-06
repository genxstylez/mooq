import React from 'react'
import { Link, History } from 'react-router'
import classnames from 'classnames'
import ChannelService from '../services/ChannelService'
import ChannelStore from '../stores/ChannelStore'
import UserStore from '../stores/UserStore'

export default React.createClass({
    mixins: [History],

    handleClickRemove() {
        if(UserStore.is_authenticated) {
            ChannelService.get_subscriber_id(this.props.channel.id, UserStore.user.user_id)
                .then((res) => {
                   ChannelService.unsubscribe_channel(UserStore.jwt, res.body[0].id)
                })
                .then(() => {
                    ChannelService.leave_channels([this.props.channel])
                })
        } else  {
            ChannelService.leave_channels([this.props.channel])
        }
    },

    render() {
        let cls = classnames({
            unread: this.props.channel.unread,
            item: true,
            active: this.history.isActive(`/channels/${this.props.channel.id}/`)
        })

        return (
                <div className={cls}>
                    <Link to={`/channels/${this.props.channel.id}/`}>
                        <i className="minus icon channel-icon" />{this.props.channel.name}
                    </Link>
                    <i className="remove icon remove_icon link" onClick={this.handleClickRemove} />
                </div>
        )
    }
});