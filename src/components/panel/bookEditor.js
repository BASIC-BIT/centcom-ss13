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

  getCategorySelector(inputs, setInputHandler) {
    const Option = Select.Option;

    return (
      <div key="category" className="section">
        <span className="bold">Category:</span>
        <Select className="inputField" defaultValue={inputs.category_id || 'none'}
                onChange={(e) => this.handleCategoryChange(e, setInputHandler)}>
          {this.props.bookCategories.map(category => (
            <Option value={category.id} key={category.id}>{category.name}</Option>))}
          <Option value="none">Unassigned</Option>
        </Select>
      </div>
    );
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

  getMenuItems(books, { filtered = false } = {}) {
    const categoriesWithBooks = this.props.bookCategories.map(category => ({
      ...category,
      books: books
      .filter(book => book.category_id === category.id)
      .sort(sortAlphabeticalByKey('title')),
    }));

    const filteredCategories = filtered ?
      categoriesWithBooks.filter(category => category.books.length) :
      categoriesWithBooks;

    const leftoverBooks = books.filter(book => filteredCategories.every(category => !category.books.some(testBook => testBook.id === book.id)));

    const categories = [
      ...filteredCategories,
      ...(leftoverBooks.length ? [{
        id: 'Unassigned',
        name: 'Unassigned',
        books: leftoverBooks,
      }] : []),
    ].sort(sortAlphabeticalByKey('name'));

    const displayCategories = categories
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

  getCategoryDisplay(object) {
    return (
      <div key="category" className="section">
        <span className="bold">Category:</span>
        {object.category_name || 'Unassigned'}
      </div>
    );
  }

  getFields() {
    return {
      title: {
        type: 'STRING',
        name: 'Title',
        menuKey: true, //must be the only field with menuKey
      },
      category_id: {
        type: 'CUSTOM',
        name: 'Category',
        renderEdit: this.getCategorySelector.bind(this),
        renderDisplay: this.getCategoryDisplay.bind(this),
      },
      content: {
        type: 'LONG_STRING',
        name: 'Content',
      },
      category_name: {
        type: 'NO_DISPLAY',
        name: 'Category Name',
      }
    };
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
          getObjects={this.getObjects.bind(this)}
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
          getFields={this.getFields.bind(this)}
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