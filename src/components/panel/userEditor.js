import React from 'react';
import {Menu, Input} from "antd";
import {connect} from 'react-redux'
import actions from '../../actions/index';
import DB from '../../brokers/serverBroker';
import EditableList from './editableList';
import {sortAlphabeticalByKey} from "../../utils/sorters";

const db = new DB();

class UsersEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getObjects() {
    return this.props.users;
  }

  isLoading() {
    return !this.props.users || this.props.loadingUsers;
  }

  refresh() {
    this.props.fetchUsers();
  }

  getMenuItems() {
    return this.props.users
    .sort(sortAlphabeticalByKey('nickname'))
    .map(user => (<Menu.Item key={user.id}>{user.nickname}</Menu.Item>));
  }

  async performEdit(object) {
    return await db.updateUser(object);
  }

  async performCreate(object) {
    return await db.createUser(object);
  }

  async performDelete(id) {
    return await db.deleteUser(id);
  }

  getFields() {
    return {
      nickname: {
        type: 'STRING',
        name: 'Nickname',
        menuKey: true, //must be the only field with menuKey
      },
      email: {
        type: 'STRING',
        name: 'Email',
      },
      byond_key: {
        type: 'STRING',
        name: 'Byond Key',
      },
    }
  }

  render() {
    return (
      <React.Fragment>
        <EditableList
          isLoading={this.isLoading.bind(this)}
          getObjects={this.getObjects.bind(this)}
          getMenuItems={this.getMenuItems.bind(this)}
          performEdit={this.performEdit.bind(this)}
          performCreate={this.performCreate.bind(this)}
          performDelete={this.performDelete.bind(this)}
          displayName="user"
          refresh={this.refresh.bind(this)}
          renderHeaderButtons={() => (null)}
          getFields={this.getFields.bind(this)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.app.users,
    loadingUsers: state.app.loadingUsers,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersEditor);