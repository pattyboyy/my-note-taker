document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('note-list');
    const noteTitle = document.getElementById('note-title');
    const noteText = document.getElementById('note-text');
    const saveNoteButton = document.getElementById('save-note');
    const clearNoteButton = document.getElementById('clear-note');

    const fetchNotes = async () => {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        noteList.innerHTML = notes.map(note => `<li>${note.title}</li>`).join('');
    };

    const saveNote = async () => {
        const newNote = {
            title: noteTitle.value,
            text: noteText.value,
        };
        await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote),
        });
        fetchNotes();
    };

    const clearNote = () => {
        noteTitle.value = '';
        noteText.value = '';
    };

    saveNoteButton.addEventListener('click', saveNote);
    clearNoteButton.addEventListener('click', clearNote);

    fetchNotes();
});
