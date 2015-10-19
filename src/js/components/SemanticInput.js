import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';


export default React.createClass({
    changed: false,

    getInitialState() {
        return ({
            is_valid: true,
            changed: false
        });
    },

    componentWillReceiveProps(nextProps) {
        if(this.state.is_valid != nextProps.is_valid && this.changed && this.props.validation)
            this.setState({
                is_valid: nextProps.is_valid
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
        return(
            <div className={outer_div_class} ref="outer_div">
                <div className={inner_div_class}>
                    {this.props.children}
                    <input name={this.props.name} placeholder={this.props.placeholder}
                        type={this.props.type} onChange={this.handleChange} value={this.props.value} autoComplete={this.props.autoComplete} />
                </div>
            </div>
        );
    }

});
