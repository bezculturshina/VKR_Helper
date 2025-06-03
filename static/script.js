document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const customButton = document.getElementById("customButton");
    const fileNameDisplay = document.getElementById("fileName");
    const submitBtn = document.getElementById("submitBtn");
    const responseBox = document.getElementById("response");

    const backendUrl = `http://${window.location.hostname}:5000/process`;

    // Обновление названия файла
    customButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        fileNameDisplay.textContent = file ? file.name : "Файл не выбран";
    });

    submitBtn.addEventListener("click", async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("Пожалуйста, выберите файл .docx.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Сбор значений из полей формы
        formData.append("fontFamily", document.getElementById("fontFamily").value);
        formData.append("fontSize", document.getElementById("fontSize").value);
        formData.append("paragraphIndent", document.getElementById("paragraphIndent").value);
        formData.append("lineHeight", document.getElementById("lineHeight").value);
        formData.append("topMargin", document.getElementById("topMargin").value);
        formData.append("bottomMargin", document.getElementById("bottomMargin").value);
        formData.append("leftMargin", document.getElementById("leftMargin").value);
        formData.append("rightMargin", document.getElementById("rightMargin").value);

        try {
            responseBox.innerText = "Отправка запроса на сервер...";
            const response = await fetch(backendUrl, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "formatted.docx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(downloadUrl);

            responseBox.innerText = "Документ успешно отформатирован и загружен.";
        } catch (error) {
            console.error("Ошибка:", error);
            responseBox.innerText = "Ошибка при отправке или получении ответа от сервера. Убедитесь, что Flask-сервер запущен.";
            alert(error.message);
        }
    });
});
