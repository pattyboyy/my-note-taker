let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let activeNote = {};

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-group');

  const tagButtons = document.querySelectorAll('.tag-btn');

  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  const getNotes = () =>
    fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());

  const saveNote = (note) =>
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    }).then(response => response.json());

  const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

  const renderActiveNote = () => {
    if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
      tagButtons.forEach(button => {
        button.classList.toggle('active', activeNote.tags.includes(button.getAttribute('data-tag')));
      });
      show(newNoteBtn);
      hide(saveNoteBtn);
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
      tagButtons.forEach(button => {
        button.classList.remove('active');
      });
      hide(newNoteBtn);
      show(saveNoteBtn);
    }
  };

  const handleNoteSave = (event) => {
    event.preventDefault();
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
      tags: Array.from(document.querySelectorAll('.tag-btn.active')).map(btn => btn.getAttribute('data-tag'))
    };
    if (newNote.title && newNote.text) {
      saveNote(newNote).then(() => {
        getNotes().then(notes => renderNoteList(notes));
        activeNote = {};
        renderActiveNote();
        show(newNoteBtn);
        hide(saveNoteBtn);
      });
    }
  };

  const handleNoteDelete = (e) => {
    e.stopPropagation();
    const noteId = e.target.parentElement.getAttribute('data-note-id');

    if (activeNote.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId).then(() => {
      getNotes().then(notes => renderNoteList(notes));
      renderActiveNote();
    });
  };

  const handleNoteView = (e) => {
    e.preventDefault();
    const noteId = e.target.closest('.list-group-item').getAttribute('data-note-id');

    fetch(`/api/notes/${noteId}`)
      .then(response => response.json())
      .then(note => {
        activeNote = note;
        renderActiveNote();
      });
  };

  const renderNoteList = (notes) => {
    noteList.innerHTML = '';

    if (notes.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No notes found.';
      noteList.appendChild(emptyMessage);
    } else {
      notes.forEach(note => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.setAttribute('data-note-id', note.id);
        li.innerHTML = `
          <span class="list-item-title">${note.title}</span>
          <span class="float-right">${note.tags.join(', ')}</span>
        `;
        li.addEventListener('click', handleNoteView);

        const delBtn = document.createElement('i');
        delBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
        delBtn.addEventListener('click', handleNoteDelete);
        li.appendChild(delBtn);

        noteList.appendChild(li);
      });
    }
  };

  const getAndRenderNotes = () => {
    getNotes().then(notes => renderNoteList(notes));
  };

  newNoteBtn.addEventListener('click', () => {
    activeNote = {};
    renderActiveNote();
  });

  noteForm.addEventListener('input', () => {
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  });

  getAndRenderNotes();
}