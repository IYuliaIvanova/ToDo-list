const drawList = (dataType, section) => {
  section.innerHTML = "";

  dataType.forEach((item) => {
    section.innerHTML += `    
    <div id="${item.id}" class="card">
      <span>Title:</span>
      <span class="title">${item.title}</span>
      <br/>
      <span>Description:</span>
      <span class="description">${item.description}</span>
      <br/>
      <div>
      ${
        section.id === "todo" || section.id === "inProgress"
          ? ` <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
            <button class="nextBtn">Next</button>
          </div>`
          : section.id === "done"
          ? ` <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
          </div>`
          : `</div>`
      }</div>`;
  });
};

const deleteCard = (dataType, dataDelete, idCard, title, description) => {
  dataType.forEach((item, i) => {
    if (Number(item.id) === Number(idCard)) {
      dataDelete.push({ id: idCard, title: title, description: description });
      dataType.splice(i, 1);
    }
  });
};

const editCard = (dataType, idCard, title, description, section) => {
  const modalWrapper = document.querySelector(".wrapper");
  modalWrapper.style.display = "block";

  const closeBtn = document.querySelector("#closeBtn");
  closeBtn.addEventListener("click", () => {
    modalWrapper.style.display = "none";
  });

  const submitBtn = document.querySelector("#submitBtn");
  const modalTitle = document.querySelector("#modalTitle");
  const modalDescription = document.querySelector("#modalDescription");

  modalTitle.value = title;
  modalDescription.value = description;

  submitBtn.addEventListener("click", () => {
    dataType.forEach((item, i) => {
      if (Number(item.id) === Number(idCard)) {
        dataType.splice(i, 1, {
          id: idCard,
          title: modalTitle.value,
          description: modalDescription.value,
        });
      }
      modalWrapper.style.display = "none";
    });
    drawList(dataType, section);
  });
};

const nextCard = (
  dataTypePush,
  dataTypeSplice,
  card,
  section,
  idCard,
  title,
  description
) => {
  dataTypePush.push({ id: idCard, title: title, description: description });
  drawList(dataTypePush, section);

  card.remove();
  dataTypeSplice.forEach((item, i) => {
    if (Number(item.id) === Number(idCard)) {
      dataTypeSplice.splice(i, 1);
    }
  });
};

const init = () => {
  const wrapperData = document.querySelector(".wrapper-data");
  const todoList = document.querySelector(".todoList");
  const inputTitle = document.querySelector("#inputTitle");
  const inputDescription = document.querySelector("#inputDescription");
  const addCardButton = document.querySelector("#addCardButton");
  const form = document.querySelector("#form");
  const todoSection = document.querySelector("#todo");
  const inProgressSection = document.querySelector("#inProgress");
  const deleteSection = document.querySelector("#deleted");

  const data = {
    todo: [],
    inProgress: [],
    done: [],
    deleted: [],
  };

  addCardButton.addEventListener("click", (event) => {
    event.preventDefault(); //прерываение обновления формы по умолчанию !!! только с формой работает !!!

    data.todo.push({
      id: Date.now(),
      title: inputTitle.value,
      description: inputDescription.value,
    });

    form.reset();
    drawList(data.todo, todoSection);
  });

  wrapperData.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    const title = card.querySelector(".title").textContent;
    const description = card.querySelector(".description").textContent;

    let cardSection = card.closest(".dataSection");
    let idCard = card.id;
    let idNext;

    switch (event.target.classList.value) {
      case "deleteBtn":
        deleteCard(
          data[cardSection.id],
          data.deleted,
          idCard,
          title,
          description
        );
        drawList(data[cardSection.id], cardSection);
        drawList(data.deleted, deleteSection);
        break;

      case "editBtn":
        editCard(data[cardSection.id], idCard, title, description, cardSection);
        break;

      case "nextBtn":
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (Object.keys(data)[i] === cardSection.id) {
            i += 1;
            idNext = Object.keys(data)[i];
          }
        }
        let nextSection = document.getElementById(idNext);

        nextCard(
          data[idNext],
          data[cardSection.id],
          card,
          nextSection,
          idCard,
          title,
          description
        );
        break;

      default:
        break;
    }
  });
};

init();
