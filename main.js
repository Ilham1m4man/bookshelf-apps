const tumpukanBuku = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle");
  const bookAuthor = document.getElementById("inputBookAuthor");
  const yearRelease = document.getElementById("inputBookYear");
  const selesaiDibaca = document.getElementById("inputBookIsComplete");

  const bookObject = {
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: yearRelease.value,
    isComplete: selesaiDibaca.checked,
  };
  tumpukanBuku.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  const unreadBook = document.getElementById("incompleteBookshelfList");
  unreadBook.innerHTML = "";

  const sudahReadBook = document.getElementById("completeBookshelfList");
  sudahReadBook.innerHTML = "";

  for (const incompBook of tumpukanBuku) {
    const bookElement = makeBookshelf(incompBook);
    if (!incompBook.isComplete) {
      unreadBook.append(bookElement);
    } else {
      sudahReadBook.append(bookElement);
    }
  }
});

function makeBookshelf(bookObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookObject.title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = "Penulis: " + bookObject.author;

  const textYearRelease = document.createElement("p");
  textYearRelease.innerText = "Tahun: " + bookObject.year;

  const contArticle = document.createElement("article");
  contArticle.classList.add("book_item");
  contArticle.append(textBookTitle, textBookAuthor, textYearRelease);
  contArticle.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const btnBelumSelesaiDibaca = document.createElement("button");
    btnBelumSelesaiDibaca.classList.add("green");
    btnBelumSelesaiDibaca.innerText = "Belum selesai dibaca";

    btnBelumSelesaiDibaca.addEventListener("click", function () {
      undoBacaBuku(bookObject.id);
    });

    const btnHapusBuku = document.createElement("button");
    btnHapusBuku.classList.add("red");
    btnHapusBuku.innerText = "Hapus buku";

    btnHapusBuku.addEventListener("click", function () {
      removeBacaBuku(bookObject.id);
    });

    const containerAction = document.createElement("div");
    containerAction.classList.add("action");
    containerAction.append(btnBelumSelesaiDibaca, btnHapusBuku);

    contArticle.append(containerAction);
  } else {
    const btnSelesaiDibaca = document.createElement("button");
    btnSelesaiDibaca.classList.add("green");
    btnSelesaiDibaca.innerText = "Selesai dibaca";

    btnSelesaiDibaca.addEventListener("click", function () {
      addSelesaiBaca(bookObject.id);
    });

    const btnHapusBuku = document.createElement("button");
    btnHapusBuku.classList.add("red");
    btnHapusBuku.innerText = "Hapus buku";

    btnHapusBuku.addEventListener("click", function () {
      removeBacaBuku(bookObject.id);
    });

    const containerAction = document.createElement("div");
    containerAction.classList.add("action");
    containerAction.append(btnSelesaiDibaca, btnHapusBuku);

    contArticle.append(containerAction);
  }

  return contArticle;
}

function addSelesaiBaca(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of tumpukanBuku) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBacaBuku(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  tumpukanBuku.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBacaBuku(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in tumpukanBuku) {
    if (tumpukanBuku[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(tumpukanBuku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      tumpukanBuku.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
