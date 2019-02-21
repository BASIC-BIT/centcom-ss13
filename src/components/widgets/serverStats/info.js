import React from 'react';
import {Icon, Statistic, Tabs, Row, Col} from "antd";

const MILLIS_IN_HOUR = 1000 * 60 * 60;
const MILLIS_IN_MINUTE = 1000 * 60;
const MILLIS_IN_SECOND = 1000;

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    const roundStart = Date.now() - (MILLIS_IN_HOUR * 2) + (MILLIS_IN_MINUTE * 2) + (MILLIS_IN_SECOND * 37);

    this.state = {
      roundStart,
      displayRoundTime: this.getRoundLength(roundStart)
    };

    this.displayRoundTimeInterval = setInterval(() => {
      this.setState({
        displayRoundTime: this.getRoundLength(this.state.roundStart),
      });
    }, 200);
  }

  componentWillUnmount() {
    if(this.displayRoundTimeInterval) {
      clearInterval(this.displayRoundTimeInterval);
    }
  }

  shouldComponentUpdate(prevProps, prevState) {
    return this.state.displayRoundTime !== prevState.displayRoundTime ||
      this.props.active !== prevProps.active;
  }

  getRoundLength(roundStart) {
    const delta = Date.now() - roundStart;
    const hours = Math.floor(delta / MILLIS_IN_HOUR);
    const minutes = Math.floor((delta - (hours * MILLIS_IN_HOUR)) / MILLIS_IN_MINUTE);
    const seconds = Math.floor((delta - (hours * MILLIS_IN_HOUR) - (minutes * MILLIS_IN_MINUTE)) / MILLIS_IN_SECOND);

    return `${`${hours}`.padStart(1, '0')}:${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`;
  }

  render() {
    return (
      <Tabs.TabPane
        {...this.props}
        className="server-stats-menu-item"
      >
        <Row gutter={20} type="flex" justify="space-between">
          <Col span={10}>
            <Statistic prefix={<Icon type="robot" />} title="Round Type" value={"Secret"} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="rocket" />} title="Round #" value={23623} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="hourglass" />} title="Round Length" value={this.state.displayRoundTime} />
          </Col>
        </Row>
      </Tabs.TabPane>
    );
  }
}