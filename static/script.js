// Обработчик кнопки выбора файла
document.getElementById('customButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// Отображение имени выбранного файла
document.getElementById('fileInput').addEventListener('change', (e) => {
    const fileName = e.target.files[0] ? e.target.files[0].name : 'Файл не выбран';
    document.getElementById('fileName').textContent = fileName;
});

// Отправка формы
document.getElementById('docForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert("Пожалуйста, выберите файл .docx");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('topMargin', document.getElementById('topMargin').value);
    formData.append('bottomMargin', document.getElementById('bottomMargin').value);
    formData.append('leftMargin', document.getElementById('leftMargin').value);
    formData.append('rightMargin', document.getElementById('rightMargin').value);
    formData.append('fontFamily', document.getElementById('fontFamily').value);
    formData.append('fontSize', document.getElementById('fontSize').value);
    formData.append('paragraphIndent', document.getElementById('paragraphIndent').value);
    formData.append('lineHeight', document.getElementById('lineHeight').value);

    try {
        const response = await fetch('/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Ошибка при отправке файла");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.docx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        document.getElementById('response').textContent = "Файл успешно загружен!";
    } catch (err) {
        console.error(err);
        document.getElementById('response').textContent = "Ошибка: не удалось обработать файл.";
    }
});
