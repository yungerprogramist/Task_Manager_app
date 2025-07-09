$('#add-note-btn').click(function() {
    const noteText = prompt('Введите текст заметки:');
    if (noteText) {
        $.ajax({
            url: '/notes',
            type: 'POST',
            data: { text: noteText },
            success: function(response) {
                const newNote = createNoteElement(response.id, response.text);
                $('#notes-container').append(newNote);
                showAnimation(newNote, 'fadeIn');
            }
        });
    }
});