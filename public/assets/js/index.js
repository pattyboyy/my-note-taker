let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let clearBtn;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');  // Update to select single element for simplified handling
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};
let notesCache = [];

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()).then(data => {
      notesCache = data;
      return data;
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteView = (e) => {
    e.preventDefault();
    const noteId = e.target.closest('.list-group-item').dataset.noteId;
    activeNote = notesCache.find(note => note.id === noteId);
    renderActiveNote();
};

const renderNoteList = (notes) => {
  noteList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.dataset.noteId = note.id;
    li.classList.add('list-group-item');
    li.innerHTML = `<span>${note.title}</span>`;
    li.addEventListener('click', handleNoteView);

    const delBtn = document.createElement('i');
    delBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtn.addEventListener('click', handleNoteDelete);
    li.appendChild(delBtn);

    noteList.appendChild(li);
  });
};

const getAndRenderNotes = () => {
  getNotes().then(renderNoteList);
};

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
      hide(clearBtn);
    } else {
      show(saveNoteBtn);
      show(clearBtn);
    }
  });
}

getAndRenderNotes();