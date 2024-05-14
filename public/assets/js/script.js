document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('note-list');
    const noteTitle = document.getElementById('note-title');
    const noteText = document.getElementById('note-text');
    const saveNoteButton = document.getElementById('save-note');
    const clearNoteButton = document.getElementById('clear-note');

    const fetchNotes = async () => {
        try {
            const response = await fetch('/api/notes');
            if (!response.ok) throw new Error('Failed to fetch notes');
            console.log(response); // Debug log
            const notes = await response.json();
            console.log('Fetched notes:', notes); // Debug log
            noteList.innerHTML = notes.map(note => `<li>${note.title}</li>`).join('');
        } catch (error) {
            console.error(error);
        }
    };

    const saveNote = async () => {
        const newNote = {
            title: noteTitle.value,
            text: noteText.value,
        };
        try {
            console.log('Saving note:', newNote); // Debug log
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            });
            if (!response.ok) throw new Error('Failed to save note');
            const savedNote = await response.json();
            console.log('Saved note:', savedNote); // Debug log
            await fetchNotes();
            clearNote();
        } catch (error) {
            console.error(error);
        }
    };

    const clearNote = () => {
        noteTitle.value = '';
        noteText.value = '';
    };

    saveNoteButton.addEventListener('click', saveNote);
    clearNoteButton.addEventListener('click', clearNote);

    fetchNotes();
});
