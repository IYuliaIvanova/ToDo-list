const drawList = (dataType, section) => {
  section.innerHTML = "";

  dataType.forEach((item) => {
    section.innerHTML += `    
    <div class="card">
      <span>Title:</span>
      <span class="title">${item.title}</span>
      <br/>
      <span>Description:</span>
      <span class="description">${item.description}</span>
      <br/>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
      <button class="nextBtn">Next</button>
    </div>`;
  });
};

const deleteCard = (dataType, title, description) => {
  dataType.forEach((item, i) => {
    if (item.title === title && item.description === description) {
      dataType.splice(i, 1);
    }
  });
};

const editCard = (dataType, title, description, section) => {
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
      if (item.title === title && item.description === description) {
        dataType.splice(i, 1, {
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
  title,
  description
) => {
  dataTypePush.push({ title: title, description: description });
  drawList(dataTypePush, section);

  card.remove();
  dataTypeSplice.forEach((item, i) => {
    if (item.title === title && item.description === description) {
      dataTypeSplice.splice(i, 1);
    }
  });
};

const init = () => {
  const todoList = document.querySelector(".todoList");
  const inputTitle = document.querySelector("#inputTitle");
  const inputDescription = document.querySelector("#inputDescription");
  const addCardButton = document.querySelector("#addCardButton");
  const form = document.querySelector("#form");
  const todoSection = document.querySelector("#todo");
  const inProgressSection = document.querySelector("#inProgress");

  const data = {
    todo: [],
    inProgress: [],
    done: [],
  };

  addCardButton.addEventListener("click", (event) => {
    event.preventDefault(); //прерываение обновления формы по умолчанию !!! только с формой работает !!!

    data.todo.push({
      title: inputTitle.value,
      description: inputDescription.value,
    });

    form.reset();
    drawList(data.todo, todoSection);
  });

  todoList.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    const title = card.querySelector(".title").textContent;
    const description = card.querySelector(".description").textContent;

    switch (event.target.classList.value) {
      case "deleteBtn":
        deleteCard(data.todo, title, description);
        drawList(data.todo, todoSection);
        break;

      case "editBtn":
        editCard(data.todo, title, description, todoSection);
        break;

      case "nextBtn":
        nextCard(
          data.inProgress,
          data.todo,
          card,
          inProgressSection,
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
