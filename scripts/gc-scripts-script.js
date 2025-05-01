try {
  const overlay = document.querySelector(`.overlay`);
  const modalWindow = document.querySelector(`.modal`);
  const modalCloseBtn = document.querySelector(`.modal-close-btn`);

  const modalPre = document.querySelector(`.modal-pre`);
  const modalTitle = document.querySelector(`.modal-title`);

  const viewCodeBtns = document.querySelectorAll(`.view-btn`);
  const downloadBtns = document.querySelectorAll(`.download-btn`);

  // Function to view the script based on the URL
  const viewScript = (url) => {
    fetch(url)
      .then((response) => response.text())
      .then((code) => {
        // Split the code into lines and add line numbers
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

  // Function to download the script based on the URL and filename
  const downloadScript = (url, fileName) => {
    try {
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
    } catch (err) {
      if (err) throw err;
    }
  };

  // Add event listeners to download buttons with data attributes
  // Add event listeners to download buttons with data attributes
downloadBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const scriptUrl = button.getAttribute("data-script-url");
    const scriptCard = button.closest(".script-card");
    if (scriptCard) {
      const scriptTitle = scriptCard.querySelector(".script-title");
      if (scriptTitle) {
        const scriptName = scriptTitle.getAttribute("data-script-name");
        if (scriptUrl && scriptName) {
          downloadScript(scriptUrl, `${scriptName}.js`);
        } else {
          alert("URL или имя файла для скрипта не найдено.");
        }
      } else {
        console.error("Element with class '.script-title' not found.");
      }
    } else {
      console.error("Element with class '.script-card' not found.");
    }
  });
});

// Add event listeners to buttons with data attributes
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
} catch (err) {
  if (err) throw err;
}
