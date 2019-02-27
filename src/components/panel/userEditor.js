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

  getObject(id) {
    return this.props.users.find(user => user.id === id);
  }

  getContent(object) {
    return (
      <React.Fragment>
        <div className="section">
          <span className="bold">Nickname:</span>
          <pre>{object.nickname}</pre>
        </div>  
        <div className="section">
          <span className="bold">Email:</span>
          <pre>{object.email}</pre>
        </div>
        <div className="section">
          <span className="bold">Byond Key:</span>
          <pre>{object.byond_key}</pre>
        </div>
      </React.Fragment>
    );
  }

  changeNickname(e, setInputHandler) {
    setInputHandler('nickname', e.target.value);
  }

  changeEmail(e, setInputHandler) {
    setInputHandler('email', e.target.value);
  }

  changeByondKey(e, setInputHandler) {
    setInputHandler('byond_key', e.target.value);
  }

  displayEditScreen(object, listState, setInputHandler) {
    return (
      <React.Fragment>
        <div className="section"><span className="bold">Nickname: </span><Input className="inputField"
                                                                             value={listState.input.nickname}
                                                                             onChange={(e) => this.changeNickname(e, setInputHandler)}/>
        </div>
        <div className="section"><span className="bold">Email: </span><Input className="inputField"
                                                                           value={listState.input.email}
                                                                           onChange={(e) => this.changeEmail(e, setInputHandler)}/>
        </div>
        <div className="section"><span className="bold">Byond Key: </span><Input className="inputField"
                                                                             value={listState.input.byond_key}
                                                                             onChange={(e) => this.changeByondKey(e, setInputHandler)}/>
        </div>
      </React.Fragment>
    )
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
          displayName="user"
          refresh={this.refresh.bind(this)}
          renderHeaderButtons={() => (null)}

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