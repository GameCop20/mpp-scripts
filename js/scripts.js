document.addEventListener("DOMContentLoaded", () => {
  const skywalkerScriptsList = document.getElementById("skywalker489");
  const zeroxelScriptsList = document.getElementById("zeroxel");

  fetch("./js/JSON/scripts.json")
    .then((res) => res.json())
    .then((data) => {
      const renderScripts = (scriptsArray, container) => {
        if (!scriptsArray.length) {
          const li = document.createElement("li");
          li.textContent = "No scripts found.";
          container.appendChild(li);
          return;
        }

        scriptsArray.forEach((script) => {
          const li = document.createElement("li");
          li.classList.add("script-item");

          const title = document.createElement("h3");
          title.classList.add("script-title");
          title.textContent = script.title;

          const description = document.createElement("p");
          description.classList.add("script-description");
          description.textContent =
            script.description || "No description provided.";

          const btnContainer = document.createElement("div");
          btnContainer.classList.add("btn-container");

          if (script.view && script.view.enabled && script.view.link) {
            const viewBtn = document.createElement("button");
            viewBtn.classList.add("script-btn", "view-btn");
            viewBtn.dataset.link = script.view.link;
            viewBtn.textContent = "View Code";
            btnContainer.appendChild(viewBtn);
          }

          if (
            script.download &&
            script.download.enabled &&
            script.download.link
          ) {
            const downloadBtn = document.createElement("button");
            downloadBtn.classList.add("script-btn", "download-btn");
            downloadBtn.dataset.link = script.download.link;
            downloadBtn.textContent = "Download";
            btnContainer.appendChild(downloadBtn);
          }

          li.appendChild(title);
          li.appendChild(description);
          li.appendChild(btnContainer);

          container.appendChild(li);

          const viewBtn = document.querySelector(`.view-btn`);
          const downloadBtn = document.querySelector(`.download-btn`);

          viewBtn.addEventListener(`click`, (e) => {
            window.open(e.target.dataset.link, `_blank`);
          });

          downloadBtn.addEventListener(`click`, (e) => {
            window.open(e.target.dataset.link, `_blank`);
          });
        });
      };

      renderScripts(data.SkyWalker489, skywalkerScriptsList);
      renderScripts(data.Zeroxel, zeroxelScriptsList);
    })
    .catch((err) => console.error("Fetch error:", err));
});
