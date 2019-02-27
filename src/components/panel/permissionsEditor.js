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

  getContent(object) {
    return (
      <React.Fragment>
        <div className="section">
          <span className="bold">Key:</span>
          <pre>{object.key}</pre>
        </div>
        <div className="section">
          <span className="bold">Description:</span>
          <pre>{object.description}</pre>
        </div>
      </React.Fragment>
    );
  }

  changeKey(e, setInputHandler) {
    setInputHandler('key', e.target.value);
  }

  changeDescription(e, setInputHandler) {
    setInputHandler('description', e.target.value);
  }

  displayEditScreen(object, listState, setInputHandler) {
    return (
      <React.Fragment>
        <div className="section"><span className="bold">Key: </span><Input className="inputField"
                                                                             value={listState.input.key}
                                                                             onChange={(e) => this.changeKey(e, setInputHandler)}/>
        </div>
        <div className="section"><span className="bold">Description: </span><Input className="inputField"
                                                                           value={listState.input.description}
                                                                           onChange={(e) => this.changeDescription(e, setInputHandler)}/>
        </div>
      </React.Fragment>
    )
  }

  isLoading() {
    return !this.props.permissions;
  }

  refresh() {
    this.props.fetchPermissions();
  }

  getMenuItems() {
    return this.props.permissions
    .sort(sortAlphabeticalByKey('description'))
    .map(permission => (<Menu.Item key={permission.key}>{permission.key}</Menu.Item>));
  }

  async performEdit(object) {
    return await db.updatePermission(object);
  }

  async performCreate(object) {
    return await db.createPermission(object);
  }

  async performDelete(id) {
    return await db.deletePermission(id);
  }

  render() {
    return (
      <React.Fragment>
        <EditableList
          isLoading={this.isLoading.bind(this)}
          getObject={this.getObject.bind(this)}
          getObjects={this.getObjects.bind(this)}
          getContent={this.getContent.bind(this)}
          displayEditScreen={this.displayEditScreen.bind(this)}
          displayCreateScreen={this.displayEditScreen.bind(this)}
          getMenuItems={this.getMenuItems.bind(this)}
          performEdit={this.performEdit.bind(this)}
          performCreate={this.performCreate.bind(this)}
          performDelete={this.performDelete.bind(this)}
          displayName="permission"
          refresh={this.refresh.bind(this)}
          renderHeaderButtons={() => (null)}

        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    permissions: state.app.permissions,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PermissionsEditor);