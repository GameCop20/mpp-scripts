try {
  document.addEventListener("DOMContentLoaded", () => {
    const gc20Button = document.querySelector(`.gamecop20`);
    const zlButton = document.querySelector(`.zeroxel`);

    const profButtons = [gc20Button, zlButton];

    const overlay = document.querySelector(`.overlay`);
    const modalWindow = document.querySelector(`.modal`);
    const modalWindowCloseBtn = document.querySelector(`.modal-close-btn`);
    const modalText = document.querySelector(`.modal-p`);

    const yes = document.querySelector(`.yes`);
    const no = document.querySelector(`.no`);

    let redirectUrl = null; // обязательно объяви это выше

    profButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          overlay.style.display = "block";
          modalWindow.style.display = "block";

          if (btn === gc20Button) {
            redirectUrl = "https://github.com/GameCop20";
          } else if (btn === zlButton) {
            redirectUrl = null; // отменяем редирект
          } else {
            redirectUrl = null; // по умолчанию
          }
        });
      } else {
        console.error("No buttons were found.");
      }
    });

    yes.addEventListener("click", () => {
      const existingRedirectText = document.querySelector(".redirect-text");

      if (!existingRedirectText && redirectUrl) {
        // проверяем, есть ли URL
        const duration = Math.floor(Math.random() * 5000) + 1;
        const durationInSeconds = duration / 1000;

        const newRedirectText = document.createElement("p");
        newRedirectText.classList.add("redirect-text");
        newRedirectText.textContent = `Redirecting... Please wait for ${durationInSeconds} seconds`;

        newRedirectText.style.fontSize = "25px";
        newRedirectText.style.justifySelf = "center";
        newRedirectText.style.fontFamily = "New Rocker";
        modalWindow.appendChild(newRedirectText);

        setTimeout(() => {
          window.open(redirectUrl);
          modalWindow.removeChild(newRedirectText);
          closeModal();
        }, duration);
      } else if (!redirectUrl) {
        closeModal(); // просто закрываем без редиректа
      }
    });

    no.addEventListener(`click`, closeModal);
    modalWindowCloseBtn.addEventListener(`click`, closeModal);

    function closeModal() {
      modalWindow.classList.add("fade-out");
      modalWindow.addEventListener(
        "animationend",
        () => {
          overlay.style.display = `none`;
          modalWindow.style.display = `none`;
          modalWindow.classList.remove("fade-out");
        },
        { once: true }
      );
    }
  });
} catch (err) {
  if (err) throw err;
}
