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

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
    alert("Data Berhasil Disimpan!")
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

//coba
document.addEventListener(RENDER_EVENT, function() {
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
    //ISI dari ARTICLE SECTION
    const textBookTitle = document.createElement("h3");
    textBookTitle.innerText = bookObject.title;

    const textBookAuthor = document.createElement("p");
    textBookAuthor.innerText = "Penulis: " + bookObject.author;

    const textYearRelease = document.createElement("p");
    textYearRelease.innerText = "Tahun: " + bookObject.year;
    
    //PARENT-nya ARTICLE SECTION
    const contArticle = document.createElement("article");
    contArticle.classList.add("book_item");
    contArticle.append(textBookTitle, textBookAuthor, textYearRelease);
    contArticle.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {
      //ISI dari BUTTON SECTION
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

      //PARENT-nya BUTTON SECTION
      const containerAction = document.createElement("div");
      containerAction.classList.add("action");
      containerAction.append(btnBelumSelesaiDibaca, btnHapusBuku);

      contArticle.append(containerAction);
    } else {
      //ISI dari BUTTON SECTION
      const btnSelesaiDibaca = document.createElement("button");
      btnSelesaiDibaca.classList.add("green");
      btnSelesaiDibaca.innerText = "Selesai dibaca";

      btnSelesaiDibaca.addEventListener("click", function() {
        addSelesaiBaca(bookObject.id);
      });

      const btnHapusBuku = document.createElement("button");
      btnHapusBuku.classList.add("red");
      btnHapusBuku.innerText = "Hapus buku";

      btnHapusBuku.addEventListener("click", function () {
        removeBacaBuku(bookObject.id);
      });

      //PARENT-nya BUTTON SECTION
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



// (() => {
//   let e = [];
//1   function t(t) {
//     t.preventDefault();
//     const n = document.querySelector("#inputBookTitle"),
//       o = document.querySelector("#inputBookAuthor"),
//       d = document.querySelector("#inputBookYear"),
//       i = document.querySelector("#inputBookIsComplete"),
//       c = {
//         id: +new Date(),
//         title: n.value,
//         author: o.value,
//         year: d.value,
//         isComplete: i.checked,
//       };
//     console.log(c), e.push(c), document.dispatchEvent(new Event("bookChanged"));
//   }
//2  function n(t) {
//     t.preventDefault();
//     const n = document.querySelector("#searchBookTitle");
//     (query = n.value),
//       query
//         ? c(
//             e.filter(function (e) {
//               return e.title.toLowerCase().includes(query.toLowerCase());
//             })
//           )
//         : c(e);
//   }
//3   function o(t) {
//     const n = Number(t.target.id),
//       o = e.findIndex(function (e) {
//         return e.id === n;
//       });
//     -1 !== o &&
//       ((e[o] = { ...e[o], isComplete: !0 }),
//       document.dispatchEvent(new Event("bookChanged")));
//   }
//4   function d(t) {
//     const n = Number(t.target.id),
//       o = e.findIndex(function (e) {
//         return e.id === n;
//       });
//     -1 !== o &&
//       ((e[o] = { ...e[o], isComplete: !1 }),
//       document.dispatchEvent(new Event("bookChanged")));
//   }
//5   function i(t) {
//     const n = Number(t.target.id),
//       o = e.findIndex(function (e) {
//         return e.id === n;
//       });
//     -1 !== o &&
//       (e.splice(o, 1), document.dispatchEvent(new Event("bookChanged")));
//   }
//6   function c(e) {
//     const t = document.querySelector("#incompleteBookshelfList"),
//       n = document.querySelector("#completeBookshelfList");
//     (t.innerHTML = ""), (n.innerHTML = "");
//     for (const c of e) {
//       const e = document.createElement("article");
//       e.classList.add("book_item");
//       const a = document.createElement("h2");
//       a.innerText = c.title;
//       const u = document.createElement("p");
//       u.innerText = "Penulis: " + c.author;
//       const r = document.createElement("p");
//       if (
//         ((r.innerText = "Tahun: " + c.year),
//         e.appendChild(a),
//         e.appendChild(u),
//         e.appendChild(r),
//         c.isComplete)
//       ) {
//         const t = document.createElement("div");
//         t.classList.add("action");
//         const o = document.createElement("button");
//         (o.id = c.id),
//           (o.innerText = "Belum Selesai dibaca"),
//           o.classList.add("green"),
//           o.addEventListener("click", d);
//         const a = document.createElement("button");
//         (a.id = c.id),
//           (a.innerText = "Hapus buku"),
//           a.classList.add("red"),
//           a.addEventListener("click", i),
//           t.appendChild(o),
//           t.appendChild(a),
//           e.appendChild(t),
//           n.appendChild(e);
//       } else {
//         const n = document.createElement("div");
//         n.classList.add("action");
//         const d = document.createElement("button");
//         (d.id = c.id),
//           (d.innerText = "Selesai dibaca"),
//           d.classList.add("green"),
//           d.addEventListener("click", o);
//         const a = document.createElement("button");
//         (a.id = c.id),
//           (a.innerText = "Hapus buku"),
//           a.classList.add("red"),
//           a.addEventListener("click", i),
//           n.appendChild(d),
//           n.appendChild(a),
//           e.appendChild(n),
//           t.appendChild(e);
//       }
//     }
//   }
//7   function a() {
//     !(function (e) {
//       localStorage.setItem("books", JSON.stringify(e));
//     })(e),
//       c(e);
//   }
//   window.addEventListener("load", function () {
//     (e = JSON.parse(localStorage.getItem("books")) || []), c(e);
//     const o = document.querySelector("#inputBook"),
//       d = document.querySelector("#searchBook");
//     o.addEventListener("submit", t),
//       d.addEventListener("submit", n),
//       document.addEventListener("bookChanged", a);
//   });
// })();