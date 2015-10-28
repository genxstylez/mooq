import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'


export default React.createClass({
    getInitialState() {
        return ({
            is_valid: true,
            changed: false,
            error_message: ''
        });
    },

    componentWillReceiveProps(nextProps) {
        if(this.state.is_valid != nextProps.is_valid && this.changed && this.props.validation)
            this.setState({
                is_valid: nextProps.is_valid,
                error_message: nextProps.error_message
            });
    },

    handleChange(e) {
        this.props.onChange(e)
        this.changed = true
    },

    render() {
        let outer_div_class = classnames({
            required: this.props.required,
            field: true,
            error: !this.state.is_valid
        });
        let inner_div_class = classnames({
            ui: true,
            left: true,
            icon: this.props.icon,
            input: true
        });

        let error_div_cls = classnames({
            ui: true,
            basic: true,
            red: true,
            pointing: true,
            prompt: true,
            label: true,
            transition: true,
            hidden: this.state.is_valid,
            visible: !this.state.is_valid
        })
        return(
            <div className={outer_div_class} ref="outer_div">
                <div className={inner_div_class}>
                    {this.props.children}
                    <input name={this.props.name} placeholder={this.props.placeholder}
                        type={this.props.type} onChange={this.handleChange} value={this.props.value} autoComplete={this.props.autoComplete} />
                </div>
                <div className={error_div_cls}>{this.state.error_message}</div>
            </div>
        );
    }

});
