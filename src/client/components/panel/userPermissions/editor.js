import React from 'react';
import {Transfer} from "antd";
import {connect} from "react-redux";
import actions from "../../../actions";

class UserPermissionsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      chosenKeys: [],
    };
  }

  componentDidMount() {
    this.setState({
      chosenKeys: this.props.userPermissions.map(({ permission_id }) => permission_id),
    })
  }

  onChange(chosenKeys) {
    console.log(chosenKeys);
    this.setState({ chosenKeys });
    this.props.setInputHandler('permissions', chosenKeys.map(key => parseInt(key)));
  }

  handleSelectChange(sourceKeys, targetKeys) {
    console.log(sourceKeys, targetKeys);
    this.setState({
      selectedKeys: [
        ...sourceKeys,
        ...targetKeys,
      ],
    });
  }

  getAvailableKeys() {
    return Object.keys(this.props.permissions)
    .filter(key => this.state.chosenKeys.includes(key.toString()));
  }

  isLoading() {
    return !this.props.permissions || this.props.loadingPermissions || !this.props.userPermissions || this.props.loadingUserPermissions || !this.props.user_id;
  }

  render() {
    const userPermissions = this.props.userPermissions
    .filter(userPermission => userPermission.user_id === this.props.user_id);

    const allPermissions = Object.entries(this.props.permissions)
    .map(([key, value]) => ({ ...value, key }));


    return (
      <div className="userPermissionsEditorContainer">
        <Transfer
          dataSource={allPermissions}
          key="userPermissions"
          titles={['User', 'Available']}
          targetKeys={this.getAvailableKeys()}
          selectedKeys={this.state.selectedKeys}
          onChange={this.onChange.bind(this)}
          onSelectChange={this.handleSelectChange.bind(this)}
          render={item => item.description}
          disabled={this.isLoading()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.app.users,
    loadingUsers: state.app.loading.users,
    userPermissions: state.app.userPermissions,
    loadingUserPermissions: state.app.loading.userPermissions,
    permissions: state.app.permissions,
    loadingPermissions: state.app.loading.permissions,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPermissionsEditor);