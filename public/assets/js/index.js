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
    noteList = document.querySelector('.list-group');

    let activeNote = {}; // Object to keep track of the note in the textarea

    // Show an element
    const show = (elem) => {
        elem.style.display = 'inline';
    };

    // Hide an element
    const hide = (elem) => {
        elem.style.display = 'none';
    };

    // Function to get all notes from the server
    const getNotes = () =>
        fetch('/api/notes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());

    // Function to save a new note to the server
    const saveNote = (note) =>
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        }).then(response => response.json());

    // Function to delete a note from the server
    const deleteNote = (id) =>
        fetch(`/api/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

    // Function to render the currently active note
    const renderActiveNote = () => {
        if (activeNote.id) {
            noteTitle.setAttribute('readonly', true);
            noteText.setAttribute('readonly', true);
            noteTitle.value = activeNote.title;
            noteText.value = activeNote.text;
            show(newNoteBtn);
            hide(saveNoteBtn);
            hide(clearBtn);
        } else {
            noteTitle.removeAttribute('readonly');
            noteText.removeAttribute('readonly');
            noteTitle.value = '';
            noteText.value = '';
            hide(newNoteBtn);
            hide(saveNoteBtn);
            hide(clearBtn);
        }
    };

    // Function to handle saving of the note
    const handleNoteSave = () => {
        const newNote = {
            title: noteTitle.value,
            text: noteText.value
        };
        if (newNote.title && newNote.text) {
            saveNote(newNote).then(() => {
                getAndRenderNotes();
                renderActiveNote();
            });
        }
    };

    // Function to handle the deletion of a note
    const handleNoteDelete = (e) => {
        e.stopPropagation();
        const noteId = e.target.parentElement.getAttribute('data-note-id');

        if (activeNote.id === noteId) {
            activeNote = {};
        }

        deleteNote(noteId).then(() => {
            getAndRenderNotes();
            renderActiveNote();
        });
    };

    // Function to set the active note and display it
    const handleNoteView = (e) => {
        e.preventDefault();
        const noteId = e.target.closest('.list-group-item').getAttribute('data-note-id');
        activeNote = notes.find(note => note.id === noteId);
        renderActiveNote();
    };

    // Function to render the list of note titles
    const renderNoteList = (notes) => {
        noteList.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.setAttribute('data-note-id', note.id);
            li.innerHTML = `<span>${note.title}</span>`;
            li.addEventListener('click', handleNoteView);

            const delBtn = document.createElement('i');
            delBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
            delBtn.addEventListener('click', handleNoteDelete);
            li.appendChild(delBtn);

            noteList.appendChild(li);
        });
    };

    // Function to get and render notes
    const getAndRenderNotes = () => {
        getNotes().then(renderNoteList);
    };

    // Setup event listeners
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', () => {
        activeNote = {};
        renderActiveNote();
    });
    clearBtn.addEventListener('click', () => {
        activeNote = {};
        renderActiveNote();
    });
    noteForm.addEventListener('input', () => {
        if (!noteTitle.value.trim() && !noteText.value.trim()) {
          hide(saveNoteBtn);
          hide(clearBtn);
          } else {
          show(saveNoteBtn);
          show(clearBtn);
          }
          });

          // Initial fetch and render of notes
getAndRenderNotes();
        }