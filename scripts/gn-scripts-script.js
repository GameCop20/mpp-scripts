try {
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(`.overlay`);
    const modalWindow = document.querySelector(`.modal`);
    const modalCloseBtn = document.querySelector(`.modal-close-btn`);
    const modalPre = document.querySelector(`.modal-pre`);
    const modalTitle = document.querySelector(`.modal-title`);
    const viewCodeBtns = document.querySelectorAll(`.view-btn`);
    const downloadBtns = document.querySelectorAll(`.download-btn`);

    const viewScript = (url) => {
      fetch(url)
        .then((response) => response.text())
        .then((code) => {
          const lines = code.split("\n");
          const numberedCode = lines
            .map((line, index) => `${index + 1}. ${line}`)
            .join("\n");

          modalPre.textContent = numberedCode;
          const scriptName = url.split("/").pop().split(".")[0];
          modalTitle.textContent = scriptName;

          overlay.style.display = `block`;
          modalWindow.style.display = `block`;
        })
        .catch((error) => alert("Ошибка загрузки кода: " + error));
    };

    const downloadScript = (url, fileName) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Ошибка при загрузке файла.`);
          }
          return response.text();
        })
        .then((data) => {
          const blob = new Blob([data], { type: "application/javascript" });
          const link = document.createElement(`a`);

          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        })
        .catch((err) => {
          console.error(`Ошибка при загрузке файла: ${err.message}`);
        });
    };

    downloadBtns.forEach((button) => {
      button.addEventListener("click", () => {
        const scriptUrl = button.getAttribute("data-script-url");
        const scriptName = button
          .closest(".script-card")
          .querySelector(".script-title")
          .getAttribute("data-script-name");
        if (scriptUrl && scriptName) {
          downloadScript(scriptUrl, `${scriptName}.js`);
        } else {
          alert("URL или имя файла для скрипта не найдено.");
        }
      });
    });

    viewCodeBtns.forEach((button) => {
      button.addEventListener("click", () => {
        const scriptUrl = button.getAttribute("data-script-url");
        if (scriptUrl) {
          viewScript(scriptUrl);
        } else {
          alert("URL для скрипта не найден.");
        }
      });
    });

    modalCloseBtn.addEventListener(`click`, () => {
      overlay.style.display = `none`;
      modalWindow.style.display = `none`;
    });
  });
} catch (err) {
  if (err) throw err;
}
