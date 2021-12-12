const commonVariable = (eventTarget, data) => {
  const card = eventTarget.closest(".card");
  const cardId = +card.id;
  const listSection = card.closest(".dataSection");
  const listId = card.closest(".dataSection").id;

  const deletedCard = data[listId].filter((card) => card.id === cardId)[0];
  const deletedCardIndex = data[listId].findIndex(
    (card) => card.id === deletedCard.id
  );

  return { listSection, listId, deletedCard, deletedCardIndex };
};

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
      <div class="wrapper-cardBtn">
      ${
        section.id === "todo" || section.id === "inProgress"
          ? ` 
            <div class="editBtn"></div>
            <div class="deleteBtn"></div>
            <div class="nextBtn"></div>
          </div>`
          : section.id === "done"
          ? ` <div class="editBtn"></div>
            <div class="deleteBtn"></div>
          </div>`
          : `<div class="restoreBtn"></div></div>`
      }</div>`;
  });
};

const createCard = (data, todoSection) => {
  const form = document.querySelector("#form");
  const inputTitle = document.querySelector("#inputTitle");
  const inputDescription = document.querySelector("#inputDescription");

  data.todo.push({
    id: Date.now(),
    title: inputTitle.value,
    description: inputDescription.value,
  });

  form.reset();
  drawList(data.todo, todoSection);
};

const deleteCard = (eventTarget, data, deleteSection) => {
  const { listSection, listId, deletedCard, deletedCardIndex } = commonVariable(
    eventTarget,
    data
  );

  data.deleted.push(deletedCard);
  data[listId].splice(deletedCardIndex, 1);

  drawList(data[listId], listSection);
  drawList(data.deleted, deleteSection);
};

const editCard = (eventTarget, data) => {
  const { listSection, listId, deletedCard, deletedCardIndex } = commonVariable(
    eventTarget,
    data
  );

  const modalWrapper = document.querySelector(".wrapper");
  modalWrapper.style.display = "block";

  const closeBtn = document.querySelector("#closeBtn");
  closeBtn.addEventListener("click", () => {
    modalWrapper.style.display = "none";
  });

  const editBtn = document.querySelector("#editBtn");
  const modalTitle = document.querySelector("#modalTitle");
  const modalDescription = document.querySelector("#modalDescription");

  modalTitle.value = deletedCard.title;
  modalDescription.value = deletedCard.description;

  const edit = (event) => {
    event.preventDefault();
    data[listId].splice(deletedCardIndex, 1, {
      id: deletedCard.id,
      title: modalTitle.value,
      description: modalDescription.value,
    });

    editBtn.removeEventListener("click", edit); //удаление события
    modalWrapper.style.display = "none";
    drawList(data[listId], listSection);
  };

  editBtn.addEventListener("click", edit);
};

const nextCard = (eventTarget, data) => {
  const { listSection, listId, deletedCard, deletedCardIndex } = commonVariable(
    eventTarget,
    data
  );

  const nextListIndex = Object.keys(data).findIndex((id) => id === listId) + 1;

  const nextSection = document.querySelector(
    `#${Object.keys(data)[nextListIndex]}`
  );

  data[Object.keys(data)[nextListIndex]].push(deletedCard);
  data[listId].splice(deletedCardIndex, 1);

  drawList(data[listId], listSection);
  drawList(data[Object.keys(data)[nextListIndex]], nextSection);
};

const restoreCard = (eventTarget, data, todoSection, deleteSection) => {
  const { listSection, listId, deletedCard, deletedCardIndex } = commonVariable(
    eventTarget,
    data
  );

  data.todo.push(deletedCard);
  data.deleted.splice(deletedCardIndex, 1);

  drawList(data.deleted, deleteSection);
  drawList(data.todo, todoSection);
};

const deleteAllCard = (data, deleteSection) => {
  data.deleted = [];
  drawList(data.deleted, deleteSection);
};

const init = () => {
  const todoSection = document.querySelector("#todo");
  const deleteSection = document.querySelector("#deleted");
  const wrapperData = document.querySelector(".wrapper-data");
  const addCardButton = document.querySelector("#addCardButton");

  const data = {
    todo: [],
    inProgress: [],
    done: [],
    deleted: [],
  };

  addCardButton.addEventListener("click", (event) => {
    event.preventDefault(); //прерываение обновления формы по умолчанию !!! только с формой работает !!!
    createCard(data, todoSection);
  });

  wrapperData.addEventListener("click", (event) => {
    switch (true) {
      case [...event.target.classList].includes("deleteBtn"): // из коллекции классов получаем массив и ищем нужный
        deleteCard(event.target, data, deleteSection);
        break;

      case [...event.target.classList].includes("editBtn"):
        editCard(event.target, data);
        break;

      case [...event.target.classList].includes("nextBtn"):
        nextCard(event.target, data);
        break;

      case [...event.target.classList].includes("restoreBtn"):
        restoreCard(event.target, data, todoSection, deleteSection);
        break;

      case [...event.target.classList].includes("deletedAllBtn"):
        deleteAllCard(data, deleteSection);
        break;

      default:
        break;
    }
  });
};

init();
