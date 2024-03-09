const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "LIST_BOOKS";
const inputBook = document.getElementById("inputBook");
const listBook = [];
const RENDER_EVENT = "render-book";

// Input data buku
function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const checkbox = document.getElementById("inputBookIsComplete");
  let complete = false;

  if (checkbox.checked) {
    complete = true;
  }

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    complete
  );

  listBook.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Generate Id Buku
function generateId() {
  return +new Date();
}

// Generate Object Buku
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// Render Buku
function inputListBook(bookObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookObject.title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = bookObject.author;

  const textBookYear = document.createElement("p");
  textBookYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_item");
  textContainer.append(textBookTitle, textBookAuthor, textBookYear);

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(textContainer);
  container.setAttribute("id", `${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai";

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus";

    undoButton.addEventListener("click", function () {
      undoBookCompleted(bookObject.id);
    });

    trashButton.addEventListener("click", function () {
      removeBookCompleted(bookObject.id);
    });

    const actionButton = document.createElement("div");
    actionButton.classList.add("action");
    actionButton.append(undoButton, trashButton);
    container.append(actionButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai";

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus";

    checkButton.addEventListener("click", function () {
      addBookCompleted(bookObject.id);
    });

    trashButton.addEventListener("click", function () {
      removeBookCompleted(bookObject.id);
    });

    const actionButton = document.createElement("div");
    actionButton.classList.add("action");
    actionButton.append(checkButton, trashButton);
    container.append(actionButton);
  }

  return container;
}

// Cari Buku berdasarkan index
function findBookIndex(bookId) {
  for (const index in listBook) {
    if (listBook[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// Ubah Status Buku menjadi selesai
function addBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Ubah status buku menjadi belom selesai 
function undoBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Ubah status buku terhapus
function removeBookCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  listBook.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Menari Buku berdasarkan Id Buku
function findBook(bookId) {
  for (const bookItem of listBook) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

// Searching atau Cari buku
const searchInput = document.getElementById("searchBookTitle");
const searchButton = document.getElementById("searchSubmit");

searchButton.addEventListener("click", function (event) {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredBooks = listBook.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm);
  });

  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBookList = document.getElementById("completeBookshelfList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookElement = inputListBook(book);
    if (!book.isComplete) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }

  event.preventDefault();
});

// Menyimpan Buku
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(listBook);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

// Load Data Buku
function loadDataBook() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      listBook.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Cek Dukungan localStorage 
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// Render Event
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completedBookList = document.getElementById("completeBookshelfList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const book of listBook) {
    const bookElement = inputListBook(book);
    if (!book.isComplete) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

// Save Event 
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// Load Content
document.addEventListener("DOMContentLoaded", function () {
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist) {
    loadDataBook();
  }
});
