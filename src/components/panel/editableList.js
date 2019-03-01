import React from 'react';
import {Button, Layout, Menu, Affix, Popconfirm, message, Icon, Input } from "antd";

import LoadingIndicator from "../loadingIndicator";

const { TextArea } = Input;
const { Sider, Content } = Layout;

export default class EditableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {},
    };
  }

  contentContainer = React.createRef();

  getObject(id) {
    return this.props.getObjects().find(user => user.id === id);
  }

  handleMenuSelect({ key }) {
    this.setState({ selectedKey: parseInt(key), editing: false, deleting: false, creating: false, });
  }

  getContent() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    if (!this.state.creating && (!this.state.selectedKey || !this.getObject(this.state.selectedKey))) {
      return (
        <div>Select an item from the side menu.</div>
      );
    }

    return (
      <div className="editableListContentContainer" ref={this.contentContainer}>
        <Affix
          className="buttonContainer"
          target={() => this.contentContainer && this.contentContainer.current}
          offsetTop={-30}
        >
          {this.state.editing && <Button className="button" type="primary" onClick={this.edit.bind(this)}>Save</Button>}
          {this.state.creating &&
          <Button className="button" type="primary" onClick={this.create.bind(this)}>Create</Button>}
          {(this.state.editing || this.state.creating) &&
          <Button className="button" onClick={this.cancel.bind(this)}>Cancel</Button>}
          {!this.state.editing && !this.state.creating &&
          <Button className="button" type="primary" onClick={this.startEdit.bind(this)}>Edit</Button>}
          {!this.state.creating && this.state.selectedKey &&
          <Popconfirm title={`Are you sure delete this ${this.props.displayName}?`} onConfirm={this.delete.bind(this)}
                      onCancel={this.cancelDelete.bind(this)} okText="Delete" cancelText="Cancel">
            <Button className="button" type="danger" onClick={this.startDelete.bind(this)}>Delete</Button>
          </Popconfirm>}
        </Affix>
        {(this.state.editing || this.state.creating) && this.displayEditScreen()}
        {!this.state.editing && !this.state.creating && this.displayContent()}
      </div>
    );
  }

  setInput(key, value) {
    this.setState({
      input: {
        ...this.state.input,
        [key]: value,
      }
    });
  }

  setInputs(input) {
    this.setState({ input });
  }

  displayEditScreen() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    const fields = this.props.getFields();

    const displayFields = Object.entries(fields).map(([key, { type, name, renderEdit }]) => {
      if(type === 'STRING') {
        return (
          <div className="section">
          <span className="bold">
            {name}:
          </span>
            <Input
              className="inputField"
              value={this.state.input[key]}
              onChange={(e) => this.setInput(key, e.target.value)}
            />
          </div>
        );
      }

      if(type === 'LONG_STRING') {
        return (
          <div className="content section">
            <span className="bold">
              {name}:
            </span>
            <TextArea
              className="inputField"
              rows={7}
              value={this.state.input[key]}
              onChange={(e) => this.setInput(key, e.target.value)}
            />
          </div>
        );
      }

      if(type === 'CUSTOM') {
        return renderEdit(this.state.input, this.setInput.bind(this));
      }

      if(type === 'NO_DISPLAY') {
        return null;
      }

      return `ERROR: Display type not found for key ${key}`;
    });

    return (
      <React.Fragment>
        {displayFields}
      </React.Fragment>
    );
  }

  displayContent() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    const object = this.getObject(this.state.selectedKey);

    const fields = this.props.getFields();

    const displayFields = Object.entries(fields).map(([key, { type, name, renderDisplay }]) => {
      if(type === 'STRING' || type === 'LONG_STRING') {
        return (
          <div className="section">
            <span className="bold">{name}:</span>
            <pre>{object[key]}</pre>
          </div>
        );
      }

      if(type === 'CUSTOM') {
        return renderDisplay(object);
      }

      if(type === 'NO_DISPLAY') {
        return null;
      }

      return `ERROR: Display type not found for key ${key}`;
    });

    return (
      <React.Fragment>
        {displayFields}
      </React.Fragment>
    );
  }

  getMenuItems() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    return this.props.getMenuItems();

  }

  startEdit() {
    const object = this.getObject(this.state.selectedKey);

    this.setState({
      editing: true,
      input: {
        ...object,
      },
    });
  }

  async edit() {
    this.setState({ loading: true });
    const newObject = {
      ...this.state.input,
      id: this.state.selectedKey,
    };

    try {
      const response = await this.props.performEdit(newObject);

      await this.props.refresh();

      this.setState({ loading: false, editing: false, deleting: false });
    } catch (e) {
      message.error(`Error editing ${this.props.displayName}`);
      this.setState({ loading: false });
    }
  }

  isLoading() {
    return this.props.isLoading() || this.state.loading;
  }

  async create() {
    this.setState({ loading: true });
    const newObject = {
      ...this.state.input,
    };

    try {
      const response = await this.props.performCreate(newObject);

      await this.props.refresh();

      this.setState({ loading: false, creating: false });
    } catch (e) {
      message.error(`Error editing ${this.props.displayName}`);
      this.setState({ loading: false });
    }
  }

  startDelete() {
    this.setState({ deleting: true });
  }

  cancelDelete() {
    this.setState({ deleting: false });
  }

  startCreate() {
    this.setState({
      creating: true,
      input: {},
      editing: false,
      deleting: false,
      selectedKey: undefined
    });
  }

  cancel() {
    this.setState({ deleting: false, editing: false, creating: false, });
  }

  async delete() {
    this.setState({ loading: true });

    try {
      const response = await this.props.performDelete(this.state.selectedKey);

      await this.props.refresh();

      this.setState({ loading: false, deleting: false, editing: false, selectedKey: undefined });
    } catch (e) {
      message.error(`Error deleting ${this.props.displayName}.`);
      this.setState({ loading: false, deleting: false, error: true });
    }
  }

  render() {
    return (
      <Layout style={{ padding: '24px 0 0 0', background: '#fff' }} className="editableListMenuContainer">
        <Sider width={250} style={{ background: '#fff', overflowY: 'auto', }}>
          <div className="editableListCreateButtonContainer">
            <Button key="create" type="primary" className="editableListCreateButton"
                    onClick={this.startCreate.bind(this)}>Create</Button>
            {this.props.renderHeaderButtons()}
            <Button key="refresh" className="refreshButton" onClick={this.props.refresh.bind(this)}><Icon type="redo"/></Button>
          </div>
          <Menu
            mode="inline"
            onSelect={this.handleMenuSelect.bind(this)}
            selectedKeys={this.state.selectedKey ? [`${this.state.selectedKey}`] : []}
          >
            {this.getMenuItems()}
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          {this.getContent()}
        </Content>
      </Layout>
    );
  }
}