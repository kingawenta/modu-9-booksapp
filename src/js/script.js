{
  'use strict';

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    booksCover: {
      images: '.book__image',
    }
  };


  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class Bookslist {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.renderInBooks();
      thisBooksList.initActions();
    }
    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    getElements() {
      const thisBooksList = this;
      thisBooksList.booksContainer = document.querySelector(select.containerOf.booksList);
      thisBooksList.booksFiltered = document.querySelector(select.containerOf.filters);

    }

    renderInBooks() {
      const thisBooksList = this;

      for (let book of thisBooksList.data) {
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        const generatedHTML = templates.bookTemplate({
          id: book.id,
          name: book.name,
          price: book.price,
          image: book.image,
          rating: book.rating,
          ratingBgc,
          ratingWidth,
        });

        const element = utils.createDOMFromHTML(generatedHTML);

        thisBooksList.booksContainer.appendChild(element);
      }
    }

    initActions() {
      const thisBooksList = this;

      thisBooksList.booksContainer.addEventListener('click', function (event) {
        event.preventDefault();
        const image = event.target.offsetParent;
        const idBook = image.getAttribute('data-id');
        if (!thisBooksList.favoriteBooks.includes(idBook)) {
          image.classList.add('favorite');
          thisBooksList.favoriteBooks.push(idBook);
        } else {
          image.classList.remove('favorite');
          thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(idBook), 1);
        }
      });

      thisBooksList.booksFiltered.addEventListener('change', function (event) {
        event.preventDefault();
        const clickedForm = event.target;
        if (clickedForm.type === 'checkbox' && clickedForm.tagName === 'INPUT' && clickedForm.name === 'filter') {
          if (clickedForm.checked == true) {
            thisBooksList.filters.push(clickedForm.value);
          } else {
            thisBooksList.filters.splice(thisBooksList.filters.indexOf(clickedForm.value), 1);
          }
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks() {
      const thisBooksList = this;

      for (let book of thisBooksList.data) {
        let shouldBeHidden = false;
        for (const filter of thisBooksList.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          const bookCover = document.querySelector('.book__image[data-id="' + book.id + '"]');
          bookCover.classList.add('hidden');
        } else {
          const bookCover = document.querySelector('.book__image[data-id="' + book.id + '"]');
          bookCover.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {

      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
  }

  const app = new Bookslist();
  app;
}
