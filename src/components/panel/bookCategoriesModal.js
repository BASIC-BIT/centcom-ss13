import React from 'react';
import {Layout, Modal, Menu, Button, Popconfirm, Input, Affix, Icon} from "antd";
import actions from "../../actions";
import {connect} from "react-redux";
import LoadingIndicator from "../loadingIndicator";
import DB from '../../brokers/serverBroker';
import {message} from "antd/lib/index";

const db = new DB();

const { Sider, Content } = Layout;

class BookCategoriesModal extends React.Component {
  contentContainer = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      bookCategories: props.bookCategories,
    };
  }

  async handleSave() {
    const updateBookCategories = this.state.bookCategories.filter(category =>
      this.props.bookCategories.map(dbCategory => dbCategory.id).includes(category.id));
    const newBookCategories = this.state.bookCategories.filter(category =>
      !this.props.bookCategories.map(dbCategory => dbCategory.id).includes(category.id));

    const updatePromise = Promise.all(updateBookCategories.map(db.updateBookCategory.bind(db)));
    const createPromise = Promise.all(newBookCategories.map(db.createBookCategory.bind(db)));

    const updateResults = await updatePromise;
    const createResults = await createPromise;

    console.log(updateResults);
    console.log(createResults);

    this.props.fetchBooks();

    this.props.closeHandler();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.bookCategories !== this.props.bookCategories) {
      this.setState({ bookCategories: this.props.bookCategories });
    }

    if(prevProps.visible !== this.props.visible) { //becoming visible or hiding
      if(this.props.visible) {
        this.props.fetchBooks();
      }
      this.setState({
        selectedKey: undefined,
      })
    }
  }

  handleMenuSelect(item) {
    const id = parseInt(item.key);
    const category = this.state.bookCategories.find(category => category.id === id);

    this.setState({ selectedKey: id, inputName: category.name });
  }

  isLoading() {
    return !this.state.bookCategories || this.state.loading;
  }

  getMenuItems() {
    if (this.isLoading()) {
      return (null);
    }

    return this.state.bookCategories.map(bookCategory => (
      <Menu.Item key={bookCategory.id}>{bookCategory.name}</Menu.Item>));
  }

  getCurrentBookCategory() {
    return this.state.bookCategories.find(bookCategory => bookCategory.id === this.state.selectedKey);
  }

  displayCategory() {
    return (
      <React.Fragment>
        <div className="section"><span className="bold">Name: </span><Input className="inputField"
                                                                            value={this.getCurrentBookCategory().name}
                                                                            onChange={this.changeName.bind(this)}/>
        </div>
      </React.Fragment>
    );
  }

  changeName(e) {
    const selectedCategory = this.getCurrentBookCategory();
    const otherCategories = this.state.bookCategories.filter(category => category.id !== selectedCategory.id);

    this.setState({
      bookCategories: [
        {
          ...selectedCategory,
          name: e.target.value,
        },
        ...otherCategories,
      ]
    })
  }

  startDelete() {

  }

  cancelDelete() {

  }

  async delete() {
    this.setState({ loading: true });

    try {
      const response = await db.deleteBookCategory(this.state.selectedKey);

      await this.props.fetchBooks();

      this.setState({ loading: false });
    } catch (e) {
      message.error('Error deleting category.');
      this.setState({ loading: false });
    }
  }

  refresh() {
    this.props.fetchBooks();
  }

  startCreate() {
    const id = Math.random().toString().slice(2,11);
    this.setState({
      bookCategories: [
        ...this.state.bookCategories,
        {
          id: parseInt(id),
          name: '',
          color: '',
        },
      ],
      selectedKey: parseInt(id),
    });
  }

  getContent() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    return (
      <div className="bookCategoriesContentContainer" ref={this.contentContainer}>
        {(!this.state.selectedKey || !this.getCurrentBookCategory()) ?
          (<div>Select a category from the side menu.</div>) :
          this.displayCategory()}
        <div className="buttonContainer">
          {!this.state.creating && this.state.selectedKey &&
          (<React.Fragment>
            <Popconfirm title="Are you sure delete this category?" onConfirm={this.delete.bind(this)}
                        onCancel={this.cancelDelete.bind(this)} okText="Delete" cancelText="Cancel">
              <Button className="button" type="danger" onClick={this.startDelete.bind(this)}>Delete</Button>
            </Popconfirm>
          </React.Fragment>)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal
        title="Book Categories"
        visible={this.props.visible}
        confirmLoading={this.props.loadingBooks || this.props.loadingBookCategories}
        onOk={this.handleSave.bind(this)}
        onCancel={this.props.closeHandler}
        okText="Save"
        destroyOnClose={true}
        bodyStyle={{ maxHeight: 600 }}
      >
        <Layout style={{ background: '#fff', height: '100%', width: '100%', }} className="bookCategoriesMenuContainer">
          <Sider width={200} style={{ background: '#fff' }}>
            <div className="createBookCategoriesButtonContainer" style={{ height: '42px' }}>
              <Button key="create" type="primary" className="createBookCategoryButton button"
                      onClick={this.startCreate.bind(this)}>Create</Button>
              <Button key="refresh" className="refreshButton button" onClick={this.refresh.bind(this)}><Icon type="redo"/></Button>
            </div>
            <Menu
              mode="inline"
              onSelect={this.handleMenuSelect.bind(this)}
              selectedKeys={this.state.selectedKey ? [`${this.state.selectedKey}`] : []}
              style={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden', }}
            >
              {this.getMenuItems()}
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {this.getContent()}
          </Content>
        </Layout>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    books: state.app.books,
    bookCategories: state.app.bookCategories,
    loadingBooks: state.app.loadingBooks,
    loadingBookCategories: state.app.loadingBookCategories,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookCategoriesModal);