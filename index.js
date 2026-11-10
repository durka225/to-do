let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const storageKey = "tasks";
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const itemTemplate = document.querySelector("#to-do__item-template");
const itemElement = itemTemplate.content.querySelector(".to-do__item");

function loadTasks() {
  const savedTasks = localStorage.getItem(storageKey);
  return savedTasks === null ? items : JSON.parse(savedTasks);
}

function createItem(item) {
  const clone = itemElement.cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  let itemName = item;

  textElement.textContent = itemName;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    saveTasks(getTasksFromDOM());
  });

  duplicateButton.addEventListener("click", () => {
    const newItem = createItem(textElement.textContent);
    listElement.prepend(newItem);
    saveTasks(getTasksFromDOM());
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      textElement.blur();
    }
  });

  textElement.addEventListener("blur", () => {
    itemName = textElement.textContent.trim() || itemName;
    textElement.textContent = itemName;
    textElement.setAttribute("contenteditable", "false");
    saveTasks(getTasksFromDOM());
  });

  return clone;
}

function getTasksFromDOM() {
  const textElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];

  textElements.forEach((textElement) => {
    tasks.push(textElement.textContent);
  });

  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function handleFormSubmit(event) {
  event.preventDefault();

  const itemName = inputElement.value.trim();
  if (itemName === "") {
    return;
  }

  listElement.prepend(createItem(itemName));
  items = getTasksFromDOM();
  saveTasks(items);
  formElement.reset();
}

items = loadTasks();
items.forEach((item) => {
  listElement.append(createItem(item));
});

formElement.addEventListener("submit", handleFormSubmit);

