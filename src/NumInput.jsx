import React from 'react';
import PropTypes from 'prop-types';

export default class NumInput extends React.Component {
  static format(num) {
    return num != null ? num.toString() : '';
  }

  static unformat(str) {
    const val = parseInt(str, 10);
    return Number.isNaN(val) ? null : val;
  }

  constructor(props) {
    super(props);
    this.state = { value: NumInput.format(props.value) };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ value: NumInput.format(newProps.value) });
  }

  onBlur(e) {
    this.props.onChange(e, NumInput.unformat(this.state.value));
  }

  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  render() {
    return (
      <input
        type="text"
        {...this.props}
        value={this.state.value}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

NumInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

NumInput.defaultProps = {
  value: null,
};
