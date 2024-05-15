let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let clearBtn;
let searchInput;
let searchButton;
let tagsInput;
let filterButton;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');

  // Add search input and button
  searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search notes...';
  searchInput.classList.add('form-control', 'mb-2');
  document.querySelector('.list-container .card').prepend(searchInput);

  searchButton = document.createElement('button');
  searchButton.textContent = 'Search';
  searchButton.classList.add('btn', 'btn-primary', 'mb-2');
  document.querySelector('.list-container .card').insertBefore(searchButton, searchInput.nextSibling);

  // Add tags input and button
  tagsInput = document.createElement('input');
  tagsInput.type = 'text';
  tagsInput.placeholder = 'Filter by tags (comma-separated)...';
  tagsInput.classList.add('form-control', 'mb-2');
  document.querySelector('.list-container .card').insertBefore(tagsInput, searchButton.nextSibling);

  filterButton = document.createElement('button');
  filterButton.textContent = 'Filter';
  filterButton.classList.add('btn', 'btn-primary', 'mb-2');
  document.querySelector('.list-container .card').insertBefore(filterButton, tagsInput.nextSibling);

  let activeNote = {};

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

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
      tags: noteTitle.value.match(/#\w+/g) || [] // Extract tags from the title
    };
    if (newNote.title && newNote.text) {
      saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
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
      getAndRenderNotes();
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

  const renderNoteList = (notes, searchTerm = '', selectedTags = []) => {
    const filteredNotes = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => note.tags.includes(tag));
      return matchesSearch && matchesTags;
    });

    noteList.innerHTML = '';
    filteredNotes.forEach(note => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.setAttribute('data-note-id', note.id);
      li.innerHTML = `
        <span>${note.title}</span>
        <span class="float-right">${note.tags.join(', ')}</span>
      `;
      li.addEventListener('click', handleNoteView);

      const delBtn = document.createElement('i');
      delBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      delBtn.addEventListener('click', handleNoteDelete);
      li.appendChild(delBtn);

      noteList.appendChild(li);
    });
  };

  const getAndRenderNotes = (searchTerm = '', selectedTags = []) => {
    getNotes().then(notes => renderNoteList(notes, searchTerm, selectedTags));
  };

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

  // Update event listeners for search and filter buttons
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    const selectedTags = tagsInput.value.split(',').map(tag => tag.trim());
    getAndRenderNotes(searchTerm, selectedTags);
  });

  filterButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    const selectedTags = tagsInput.value.split(',').map(tag => tag.trim());
    getAndRenderNotes(searchTerm, selectedTags);
  });

  // Initial rendering of notes
  getAndRenderNotes();
}