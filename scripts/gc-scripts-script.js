function installScript(url, fileName) {
    try {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке файла');
                }
                return response.text();
            })
            .then(data => {
                const blob = new Blob([data], { type: 'application/javascript' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();  // Симуляция скачивания файла
            })
            .catch(err => {
                console.error('Ошибка загрузки файла:', err.message);
            });
    } catch (err) {
        console.error('Ошибка обработки файла:', err.message);
    }
}
function viewScript(scriptUrl) {
    fetch(scriptUrl)  // Загружаем содержимое файла скрипта по URL
        .then(response => response.text())  // Преобразуем в текст
        .then(code => {
            // Здесь мы устанавливаем полученный текст (код) в элемент с id="script-code"
            document.getElementById('script-code').textContent = code;

            // Устанавливаем заголовок для модального окна
            const scriptName = scriptUrl.split('/').pop().split('.')[0]; // Используем имя файла без расширения
            document.getElementById('modal-title').textContent = `${scriptName}'s Source Code`;  // Меняем заголовок

            // Показываем модальное окно
            document.getElementById('modal').style.display = 'block';
        })
        .catch(error => alert("Ошибка загрузки кода: " + error));
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';  // Закрытие модального окна
}

// Эта строка автоматически добавит обработчик для клика по кнопке закрытия.
document.querySelector('.close').addEventListener('click', closeModal);

