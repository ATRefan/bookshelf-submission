const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP";

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, iscomplete){
    return{
        id,
        title,
        author,
        year,
        iscomplete
    }
}

function addBook(){
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const textYear = document.getElementById("inputBookYear").value;
    const checkBox = document.getElementById("inputBookIsComplete").checked;
    if(checkBox){
        iscomplete = true;
    }else{
        iscomplete = false;
    }
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle,textAuthor, textYear, checkBox);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function makeBook(bookObject){
    const textTitle = document.createElement("h2");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("book_shelf")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("book_item")
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.iscomplete){
        const undoButton = document.createElement("button");
        undoButton.classList.add("check_button");
        undoButton.innerText = "Belum dibaca";
        undoButton.addEventListener("click", function(){
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("remove_button");
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener("click", function(){
            removeBookFromCompleted(bookObject.id);
        });
        container.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("check_button");
        checkButton.innerText = "Sudah dibaca";
        checkButton.addEventListener("click", function(){
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("remove_button");
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener("click", function(){
            removeBookFromCompleted(bookObject.id);
        });
        container.append(checkButton, trashButton);
    }
    return container;
}

function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.iscomplete=true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}


function removeBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1)return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null)return;
    bookTarget.iscomplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for(index in books){
        if(books[index].id == bookId){
            return index
        }
    }
    return -1
}

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("browser tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);
    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function(){
   
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    uncompletedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML = "";


    for(bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.iscomplete == false)
        uncompletedBOOKList.append(bookElement);
        else
        completedBOOKList.append(bookElement);
    }
});