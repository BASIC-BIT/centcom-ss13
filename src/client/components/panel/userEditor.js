import React from 'react';
import {Menu, Input, Select, List} from "antd";
import {connect} from 'react-redux'
import actions from '../../actions/index';
import DB from '../../brokers/serverBroker';
import EditableList from './editableList';
import {sortAlphabeticalByKey} from "../../utils/sorters";
import LoadingIndicator from "../loadingIndicator";
import UserPermissionsEditor from './userPermissions/editor';

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
    return !this.props.users || this.props.loadingUsers || !this.props.userPermissions || this.props.loadingUserPermissions;
  }

  refresh() {
    this.props.fetch('users');
    this.props.fetch('userPermissions');
  }

  getMenuItems(users) {
    return users
    .sort(sortAlphabeticalByKey('nickname'))
    .map(user => (<Menu.Item key={user.id}>{user.nickname}</Menu.Item>));
  }

  renderEditPermissions(input, setInputHandler) {
    if(this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    return (<UserPermissionsEditor user_id={input.id} setInputHandler={setInputHandler} />);
  }

  renderDisplayPermissions(object) {
    if(this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    const userPermissionItems = this.props.userPermissions
    .filter(userPermission => userPermission.user_id === object.id);

    return (
      <List
        header={<div>Permissions:</div>}
        key="userPermissions"
        bordered
        dataSource={userPermissionItems}
        locale={{	emptyText: 'No Permissions' }}
        renderItem={({ permission_id, description }) => (<List.Item key={permission_id} value={permission_id}>{description}</List.Item>)}
      />
    );
  }

  getFields() {
    return {
      permissions: {
        renderEdit: this.renderEditPermissions.bind(this),
        renderDisplay: this.renderDisplayPermissions.bind(this),
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <EditableList
          defKey="users"
          isLoading={this.isLoading.bind(this)}
          getObjects={this.getObjects.bind(this)}
          getMenuItems={this.getMenuItems.bind(this)}
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
    loadingUsers: state.app.loading.users,
    userPermissions: state.app.userPermissions,
    loadingUserPermissions: state.app.loading.userPermissions,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersEditor);