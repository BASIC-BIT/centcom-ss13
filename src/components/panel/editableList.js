import React from 'react';
import {Button, Layout, Menu, Affix, Popconfirm, message, Icon} from "antd";

import LoadingIndicator from "../loadingIndicator";

const { Sider, Content } = Layout;

export default class EditableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {},
    };
  }

  contentContainer = React.createRef();

  handleMenuSelect({ key }) {
    this.setState({ selectedKey: parseInt(key), editing: false, deleting: false, creating: false, });
  }

  getContent() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    if (!this.state.creating && (!this.state.selectedKey || !this.props.getObject(this.state.selectedKey))) {
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
        {this.state.editing && this.displayEditScreen()}
        {this.state.creating && this.displayCreateScreen()}
        {!this.state.editing && !this.state.creating && this.displayObjectContent()}
      </div>
    );
  }

  displayObjectContent() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    const object = this.props.getObject(this.state.selectedKey);

    return this.props.getContent(object);
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

    const object = this.props.getObject(this.state.selectedKey);

    return this.props.displayEditScreen(object, this.state, this.setInput.bind(this));
  }

  displayCreateScreen() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    const object = this.props.getObject(this.state.selectedKey);

    return this.props.displayCreateScreen(object, this.state, this.setInput.bind(this));
  }

  getMenuItems() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    return this.props.getMenuItems();

  }

  startEdit() {
    const object = this.props.getObject(this.state.selectedKey);

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