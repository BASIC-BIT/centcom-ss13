import React from 'react';
import {Button, Menu, Input, Select} from "antd";
import {connect} from 'react-redux'
import actions from '../../actions/index';
import DB from '../../brokers/serverBroker';
import BookCategoriesModal from './bookCategoriesModal';
import EditableList from './editableList';
import {sortAlphabeticalByKey} from "../../utils/sorters";

const db = new DB();
const SubMenu = Menu.SubMenu;

const { TextArea } = Input;

class BookEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getObjects() {
    return this.props.books;
  }

  getObject(id) {
    return this.props.books.find(book => book.id === id);
  }

  handleCategoryChange(e, setInputHandler) {
    if (e === 'none') {
      setInputHandler('category_id', undefined);
    } else {
      setInputHandler('category_id', e);
    }
  }

  getContent(object) {
    return (
      <React.Fragment>
        <div className="section">
          <span className="bold">Title:</span>
          <pre>{object.title}</pre>
        </div>
        <div className="section">
          <span className="bold">Category:</span>
          {object.category_id ? this.props.bookCategories.find(category => category.id === object.category_id).name : 'Unassigned'}
        </div>
        <div className="content section">
          <span className="bold">Content:</span>
          <pre>
            {object.content}
          </pre>
        </div>
      </React.Fragment>
    );
  }

  changeTitle(e, setInputHandler) {
    setInputHandler('title', e.target.value);
  }

  changeContent(e, setInputHandler) {
    setInputHandler('content', e.target.value);
  }

  getCategorySelector(listState, setInputHandler) {
    const Option = Select.Option;

    const categoryOptions = (
      <Select className="inputField" defaultValue={listState.input.category_id || 'none'}
              onChange={(e) => this.handleCategoryChange(e, setInputHandler)}>
        {this.props.bookCategories.map(category => (
          <Option value={category.id} key={category.id}>{category.name}</Option>))}
        <Option value="none">Unassigned</Option>
      </Select>
    );

    return categoryOptions;
  }

  displayEditScreen(object, listState, setInputHandler) {
    return (
      <React.Fragment>
        <div className="section"><span className="bold">Title: </span><Input className="inputField"
                                                                             value={listState.input.title}
                                                                             onChange={(e) => this.changeTitle(e, setInputHandler)}/>
        </div>
        <div className="section">
          <span className="bold">Category:</span>
          {this.getCategorySelector(listState, setInputHandler)}
        </div>
        <div className="content section"><span className="bold">Content:</span><TextArea className="inputField" rows={7}
                                                                                         value={listState.input.content}
                                                                                         onChange={(e) => this.changeContent(e, setInputHandler)}/>
        </div>
      </React.Fragment>
    )
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
    const categories = this.props.bookCategories.map(category => ({
      ...category,
      books: this.props.books
      .filter(book => book.category_id === category.id)
      .sort(sortAlphabeticalByKey('title')),
    }));

    const leftoverBooks = this.props.books.filter(book => categories.every(category => !category.books.some(testBook => testBook.id === book.id)));

    const finalCategories = [
      ...categories,
      {
        id: 'Unassigned',
        name: 'Unassigned',
        books: leftoverBooks,
      },
    ].sort(sortAlphabeticalByKey('name'));

    const displayCategories = finalCategories
    .map(category => (
      <SubMenu key={category.id} title={category.name}>
        {category.books.map(book => (<Menu.Item key={book.id}>{book.title}</Menu.Item>))}
      </SubMenu>
    ));

    return displayCategories;
  }

  async performEdit(object) {
    return await db.updateBook(object);
  }

  async performCreate(object) {
    return await db.createBook(object);
  }

  async performDelete(id) {
    return await db.deleteBook(id);
  }

  render() {
    return (
      <React.Fragment>
        <BookCategoriesModal
          visible={this.state.bookCategoriesModalVisible}
          closeHandler={this.hideBookCategoriesModal.bind(this)}
        />
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
          displayName="book"
          refresh={this.refresh.bind(this)}
          renderHeaderButtons={() => (
            <Button key="editCategories" className="editCategoriesButton"
                    onClick={this.showBookCategoriesModal.bind(this)}>Categories</Button>
          )}

        />
      </React.Fragment>
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