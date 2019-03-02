import React from 'react';
import {Menu, Input} from "antd";
import {connect} from 'react-redux'
import actions from '../../actions/index';
import DB from '../../brokers/serverBroker';
import EditableList from './editableList';
import {sortAlphabeticalByKey} from "../../utils/sorters";

const db = new DB();

class PermissionsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getObjects() {
    return this.props.permissions;
  }

  getObject(id) {
    return this.props.permissions.find(permission => permission.id === id);
  }

  isLoading() {
    return !this.props.permissions || this.props.loadingPermissions;
  }

  refresh() {
    this.props.fetchPermissions();
  }

  getMenuItems(permissions) {
    return permissions
    .sort(sortAlphabeticalByKey('description'))
    .map(permission => (<Menu.Item key={permission.id}>{permission.name}</Menu.Item>));
  }

  getFields() {
    return {
      name: {
        type: 'STRING',
        name: 'Name',
        menuKey: true, //must be the only field with menuKey
      },
      description: {
        type: 'STRING',
        name: 'Description',
      },
    }
  }

  render() {
    return (
      <React.Fragment>
        <EditableList
          defKey="permissions"
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
    permissions: state.app.permissions,
    loadingPermissions: state.app.loadingPermissions,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PermissionsEditor);