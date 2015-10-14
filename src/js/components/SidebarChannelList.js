import ChannelList from './ChannelList';
import ChannelStore from '../stores/ChannelStore';

export default class SidebarChannelList extends ChannelList {
    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    }
}
