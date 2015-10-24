import React from 'react'
import { Link, History } from 'react-router'
import classnames from 'classnames'
import ChannelService from '../services/ChannelService'
import ChannelStore from '../stores/ChannelStore'

export default React.createClass({
    mixins: [History],

    handleClickRemove() {
        ChannelService.leave_channels([this.props.channel])
    },

    render() {
        let cls = classnames({
            unread: this.props.channel.unread,
            item: true,
            active: this.history.isActive(`/channels/${this.props.channel.id}/`) || ChannelStore.active_channel == this.props.channel
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