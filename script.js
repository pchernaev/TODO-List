function createCookie(values, days) {
  let date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  let expireDate = "expires=" + date.toGMTString(),
    valuesStr = "";
  values.forEach((element) => {
    valuesStr += `${element},`;
  });
  valuesStr = valuesStr.slice(0, -1);
  document.cookie = "notes=" + valuesStr + ";" + expireDate + ";";
}

function getCookieValue(cookieName) {
  let name = cookieName + "=",
    decodedCookie = decodeURIComponent(document.cookie),
    cookieArr = decodedCookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let str = cookieArr[i];
    while (str.charAt(0) == " ") {
      str = str.substring(1);
    }
    if (str.indexOf(name) == 0) {
      return str.substring(name.length, str.length);
    }
  }
  return "";
}

function deleteCookie(cookieName) {
  let date = new Date();
  date.setTime(date.getTime() - 60 * 60 * 1000);
  let expires = "expires=" + date.toGMTString();
  document.cookie = cookieName + "=;" + expires + ";";
}

function loadData(cookieValue) {
  let valuesArr = cookieValue.split(","),
    text = [],
    priorities = [];
  valuesArr.forEach((element) => {
    text.push(element.split("-")[0]);
    priorities.push(element.split("-")[1]);
  });
  for (let i = 0; i < text.length; i++) {
    addNote(text[i], priorities[i]);
  }
}

function getNoteInfo(elements) {
  let values = [];
  elements.forEach((element) => {
    let prio = element.className;
    values.push(`${element.innerText}-${prio}`);
  });
  return values;
}

function addNote(text, priorityVal) {
  let div = document.createElement("div"),
    element = document.createElement("li"),
    delBtn = document.createElement("button"),
    priority = priorityVal; 
  div.appendChild(element);
  div.appendChild(delBtn);
  element.classList.add(priority);
  delBtn.innerHTML = "X";
  delBtn.className = "del-btn";

  delBtn.addEventListener("click", () => {
    div.remove();
    let delBtns = document.querySelectorAll(".del-btn");
    delBtns.forEach((element) => {
      element.style.display = "none";
    });
    delBtnsActive = !delBtnsActive;
    let elements = Array.from(document.getElementsByTagName("li"));
    if (elements.length != 0) {
      createCookie(getNoteInfo(elements), 365);
    } else {
      deleteCookie("notes");
    }
  });
  div.setAttribute("draggable", "true");

  delBtn.style.display = "none";
  element.innerHTML = text;
  list.appendChild(div);

  div.addEventListener("dragstart", () => {
    draggedElement = div;
  });

  div.addEventListener("dragenter", function (e) {
    e.preventDefault();
  });

  div.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  div.addEventListener("drop", () => {
    let draggedElLI = draggedElement.firstChild;
    let draggedElBtn = draggedElement.lastChild;
    let thisElLi = div.firstChild;
    let thisElBtn = div.lastChild;
    while (draggedElement.hasChildNodes()) {
      draggedElement.removeChild(draggedElement.firstChild);
    }
    while (div.hasChildNodes()) {
      div.removeChild(div.firstChild);
    }
    draggedElement.appendChild(thisElLi);
    draggedElement.appendChild(draggedElBtn);
    div.appendChild(draggedElLI);
    div.appendChild(thisElBtn);
    let elements = Array.from(document.getElementsByTagName("li"));
    createCookie(getNoteInfo(elements), 365);
  });
  let elements = Array.from(document.getElementsByTagName("li"));
  createCookie(getNoteInfo(elements), 365);
}

let addButton = document.getElementById("add"),
  deleteButton = document.getElementById("delete"),
  container = document.getElementById("container"),
  list = document.getElementById("list"),
  saveNoteBtn = document.getElementById("save-note"),
  prioritySelect = document.getElementById("priority-sel"),
  inputText = document.getElementById("add-note"),
  draggedElement = "",
  delBtnsActive = false;

document.cookie.split(";").some((item) => item.trim().startsWith("notes="))
  ? loadData(getCookieValue("notes"))
  : "";

saveNoteBtn.addEventListener("click", () => {
  let text = inputText.value,
    priorityVal = prioritySelect.value;
  addNote(text, priorityVal);
  inputText.value = "";
});

deleteButton.addEventListener("click", () => {
  let delBtns = document.querySelectorAll(".del-btn");
  if (delBtnsActive) {
    delBtns.forEach((element) => {
      element.style.display = "none";
    });
    delBtnsActive = !delBtnsActive;
  } else {
    delBtns.forEach((element) => {
      element.style.display = "";
    });
    delBtnsActive = !delBtnsActive;
  }
});
