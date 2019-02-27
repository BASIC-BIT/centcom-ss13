import React from 'react';
import {Button, Layout, Menu, Affix, Input, Popconfirm, message, Icon, Select} from "antd";
import {connect} from 'react-redux'
import actions from '../../actions/index';
import LoadingIndicator from "../loadingIndicator";
import DB from '../../brokers/serverBroker';
import BookCategoriesModal from './bookCategoriesModal';

const db = new DB();
const SubMenu = Menu.SubMenu;

const { TextArea } = Input;

const { Sider, Content } = Layout;

class BookEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      titleInput: '',
      contentInput: '',
    };
  }

  contentContainer = React.createRef();

  handleMenuSelect({ key }) {
    this.setState({ selectedKey: parseInt(key), editing: false, deleting: false, creating: false, });
  }

  getBooks() {
    return this.props.books;
  }

  getContent() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    if (!this.state.creating && (!this.state.selectedKey || !this.getCurrentBook())) {
      return (
        <div>Select a book from the side menu.</div>
      );
    }

    return (
      <div className="bookContentContainer" ref={this.contentContainer}>
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
          <Popconfirm title="Are you sure delete this book?" onConfirm={this.delete.bind(this)}
                      onCancel={this.cancelDelete.bind(this)} okText="Delete" cancelText="Cancel">
            <Button className="button" type="danger" onClick={this.startDelete.bind(this)}>Delete</Button>
          </Popconfirm>}
        </Affix>
        {this.state.editing && this.displayEditScreen()}
        {this.state.creating && this.displayCreateScreen()}
        {!this.state.editing && !this.state.creating && this.displayBookContent()}
      </div>
    );
  }

  handleCategoryChange(e) {
    if(e === 'none') {
      this.setState({ categoryIdInput: undefined });
    } else {
      this.setState({ categoryIdInput: e });
    }
  }

  displayBookContent() {
    const book = this.getCurrentBook();

    return (
      <React.Fragment>
        <div className="section">
          <span className="bold">Title:</span>
          <pre>{book.title}</pre>
        </div>
        <div className="section">
          <span className="bold">Category:</span>
          {book.category_id ? this.props.bookCategories.find(category => category.id === book.category_id).name : 'Unassigned'}
        </div>
        <div className="content section">
          <span className="bold">Content:</span>
          <pre>
            {book.content}
          </pre>
        </div>
      </React.Fragment>
    );
  }

  changeTitle(e) {
    this.setState({ titleInput: e.target.value });
  }

  changeContent(e) {
    this.setState({ contentInput: e.target.value });
  }

  getCategorySelector() {
    const Option = Select.Option;

    const categoryOptions = (
      <Select className="inputField" defaultValue={this.state.categoryIdInput || 'none'} onChange={this.handleCategoryChange.bind(this)}>
        {this.props.bookCategories.map(category => (<Option value={category.id} key={category.id}>{category.name}</Option>))}
        <Option value="none">Unassigned</Option>
      </Select>
    );

    return categoryOptions;
  }

  displayEditScreen() {
    return (
      <React.Fragment>
        <div className="section"><span className="bold">Title: </span><Input className="inputField"
                                                                             value={this.state.titleInput}
                                                                             onChange={this.changeTitle.bind(this)}/>
        </div>
        <div className="section">
          <span className="bold">Category:</span>
          {this.getCategorySelector()}
        </div>
        <div className="content section"><span className="bold">Content:</span><TextArea className="inputField" rows={7}
                                                                                         value={this.state.contentInput}
                                                                                         onChange={this.changeContent.bind(this)}/>
        </div>
      </React.Fragment>
    )
  }

  displayCreateScreen() {
    return (
      <React.Fragment>
        <div className="section"><span className="bold">Title: </span><Input className="inputField"
                                                                             value={this.state.titleInput}
                                                                             onChange={this.changeTitle.bind(this)}/>
        </div>
        <div className="section">
          <span className="bold">Category:</span>
          {this.getCategorySelector()}
        </div>
        <div className="content section"><span className="bold">Content:</span><TextArea className="inputField" rows={7}
                                                                                         value={this.state.contentInput}
                                                                                         onChange={this.changeContent.bind(this)}/>
        </div>
      </React.Fragment>
    )
  }

  getCurrentBook() {
    return this.getBooks().find(book => book.id === this.state.selectedKey);
  }

  isLoading() {
    return !this.props.books || !this.props.bookCategories;
  }

  refresh() {
    this.props.fetchBooks();
  }

  showBookCategoriesModal() {
    this.setState({ bookCategoriesModalVisible: true });
  }

  hideBookCategoriesModal() {
    this.setState({ bookCategoriesModalVisible: false });
  }

  getMenuItems() {
    if (this.isLoading()) {
      return (<LoadingIndicator center/>);
    }

    const categories = this.props.bookCategories.map(category => ({
      ...category,
      books: this.props.books.filter(book => book.category_id === category.id),
    }));

    const leftoverBooks = this.props.books.filter(book => categories.every(category => !category.books.some(testBook => testBook.id === book.id)));

    const finalCategories = [
      ...categories,
      {
        id: 'Unassigned',
        name: 'Unassigned',
        books: leftoverBooks,
      },
    ];

    const displayCategories = finalCategories
    .map(category => (
      <SubMenu title={category.name}>
        {category.books.map(book => (<Menu.Item key={book.id}>{book.title}</Menu.Item>))}
      </SubMenu>
    ));

    return displayCategories;
  }

  startEdit() {
    const book = this.getCurrentBook();

    this.setState({
      editing: true,
      titleInput: book.title,
      contentInput: book.content,
      categoryIdInput: book.category_id,
    });
  }

  async edit() {
    const book = {
      id: this.state.selectedKey,
      title: this.state.titleInput,
      content: this.state.contentInput,
      category_id: this.state.categoryIdInput,
    };

    try {
      const response = await db.updateBook(book);

      this.props.fetchBooks();

      this.setState({ loading: false, editing: false, deleting: false });
    } catch (e) {
      message.error('Error editing book.');
      this.setState({ loading: false });
    }
  }

  async create() {
    const book = {
      title: this.state.titleInput,
      content: this.state.contentInput,
      category_id: this.state.categoryIdInput,
    };

    try {
      const response = await db.createBook(book);

      this.props.fetchBooks();

      this.setState({ loading: false, creating: false });
    } catch (e) {
      message.error('Error creating book.');
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
      titleInput: '',
      contentInput: '',
      categoryIdInput: undefined,
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
      const response = await db.deleteBook(this.state.selectedKey);

      await this.props.fetchBooks();

      this.setState({ loading: false, deleting: false, editing: false });
    } catch (e) {
      message.error('Error deleting book.');
      this.setState({ loading: false, deleting: false, error: true });
    }
  }

  render() {
    return (
      <Layout style={{ padding: '24px 0 0 0', background: '#fff' }} className="bookMenuContainer">
        <Sider width={250} style={{ background: '#fff' }}>
          <div className="createBookButtonContainer">
            <Button key="create" type="primary" className="createBookButton"
                    onClick={this.startCreate.bind(this)}>Create</Button>
            <Button key="editCategories" className="editCategoriesButton"
                    onClick={this.showBookCategoriesModal.bind(this)}>Categories</Button>
            <Button key="refresh" className="refreshButton" onClick={this.refresh.bind(this)}><Icon type="redo"/></Button>
          </div>
          <Menu
            mode="inline"
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
            onSelect={this.handleMenuSelect.bind(this)}
            selectedKeys={this.state.selectedKey ? [`${this.state.selectedKey}`] : []}
          >
            {this.getMenuItems()}
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          {this.getContent()}
          <BookCategoriesModal
            visible={this.state.bookCategoriesModalVisible}
            closeHandler={this.hideBookCategoriesModal.bind(this)}
          />
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    books: state.app.books,
    bookCategories: state.app.bookCategories,
  }
};

const mapDispatchToProps = { ...actions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookEditor);