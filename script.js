document.addEventListener('DOMContentLoaded', function() {
	// Theme selection
	var storedColorMode = localStorage.getItem("colorMode");
	presetTheme(storedColorMode);
	var colorMode = document.getElementById("colorMode");
	colorMode.addEventListener("click", changeTheme);

	// Set up checkbox functionalty
	var checkboxes = document.querySelectorAll(".checkBox");
	checkboxClickDetector(checkboxes);

	// Set up addNew functionalty
	var addNew = document.querySelector(".addNewButton");
	addnewClickDetector(addNew);

	// Set up contentEditable functionalty
	var contentEditableElements = document.querySelectorAll("[contenteditable]");
	contentEditableClickDetector(contentEditableElements);

	// Save the content every 30 seconds
	saveList();
});

function presetTheme(theme) {
	if (theme === "dark") {
		document.documentElement.setAttribute('data-theme', "dark");
	} else {
		document.documentElement.setAttribute('data-theme', "light");
	}
}

function changeTheme() {
	if (document.documentElement.getAttribute('data-theme') == "dark") {
		document.documentElement.setAttribute('data-theme', "light");
		localStorage.setItem("colorMode", "light");
	} else {
		document.documentElement.setAttribute('data-theme', "dark");
		localStorage.setItem("colorMode", "dark");
	}
}

function checkboxClickDetector(checkboxes) {
	checkboxes.forEach(function(checkbox) {
		checkbox.addEventListener("click", function() {
			if (checkbox.getAttribute("data-status") === "unchecked") {
				checkbox.setAttribute("data-status", "checked");
			} else {
				checkbox.setAttribute("data-status", "unchecked");
			}
		});
	});
}

function addnewClickDetector(addNew) {
	addNew.addEventListener("click", function() {
		const listItem = document.createElement("li");
		listItem.className = "listItem";

		const button = document.createElement("button");
		button.className = "checkBox";
		button.setAttribute("data-status", "unchecked");

		const existingSVG = document.querySelector('#checkMarkClone');
		const clonedSVG = existingSVG.cloneNode(true);
		clonedSVG.removeAttribute('id');

		button.addEventListener("click", function() {
			if (button.getAttribute("data-status") === "unchecked") {
				button.setAttribute("data-status", "checked");
			} else {
				button.setAttribute("data-status", "unchecked");
			}
		});

		const button2 = document.createElement("button");
		button2.className = "contentEditButton";

		const existingSVG2 = document.querySelector('#contentEditButtonClone');
		const clonedSVG2 = existingSVG2.cloneNode(true);
		clonedSVG2.removeAttribute('id');

		button2.addEventListener("click", function(event) {
			event.stopPropagation();
			contentEditable = button.parentElement.querySelector("p");
			contentEditable.setAttribute("contenteditable", "true");
			contentEditable.focus();

			const clickOutsideListener = function(event) {
				if (!contentEditable.contains(event.target)) {
					contentEditable.setAttribute("contenteditable", "false");
					document.removeEventListener("click", clickOutsideListener);
				}
			};

			document.addEventListener("click", clickOutsideListener);
		});

		const list = document.querySelector(".listItems");
		const numberOfItems = list.childElementCount;

		const paragraph = document.createElement("p");
		paragraph.className = "listText";
		paragraph.setAttribute("contenteditable", "false");
		paragraph.textContent = `Item ${numberOfItems}`;

		button.appendChild(clonedSVG);
		button2.appendChild(clonedSVG2);

		listItem.appendChild(button);
		listItem.appendChild(button2);
		listItem.appendChild(paragraph);

		const lastItem = list.lastElementChild;

		list.insertBefore(listItem, lastItem);
	});
}

function contentEditableClickDetector(contentEditableElements) {
	contentEditableElements.forEach(function(contentEditable) {
		const contentEditButton = contentEditable.parentElement.querySelector(".contentEditButton");
		if (contentEditButton) {
			contentEditButton.addEventListener("click", function(event) {
				event.stopPropagation();

				contentEditable.setAttribute("contenteditable", "true");
				contentEditable.focus();

				const clickOutsideListener = function(event) {
					if (!contentEditable.contains(event.target)) {
						contentEditable.setAttribute("contenteditable", "false");
						document.removeEventListener("click", clickOutsideListener);
					}
				};

				document.addEventListener("click", clickOutsideListener);
			});
		}
	});
}

function saveList() {
	function saveStateToLocalStorage() {
		const currentList = document.querySelector('.currentList');
		const listItems = currentList.querySelectorAll('.listItem');

		const listState = [];

		listState.push({
			name: currentList.querySelector(".listTitle").textContent
		});

		listItems.forEach((item) => {
			const checkBox = item.querySelector('.checkBox');
			const listText = item.querySelector('.listText');

			if (checkBox && listText) {
				listState.push({
					checked: checkBox.getAttribute('data-status'),
					text: listText.textContent
				});
			}
		});

		localStorage.setItem('todoList', JSON.stringify(listState));
		console.log("List has been saved");
	}

	function loadStateFromLocalStorage() {
		const currentList = document.querySelector('.currentList');
		const listItemsContainer = currentList.querySelector('.listItems');

		const todoListString = localStorage.getItem('todoList');

		if (todoListString) {
			const todoList = JSON.parse(todoListString);

			currentList.querySelector(".listTitle").textContent = todoList[0].name;

			const listItems = listItemsContainer.querySelectorAll('.listItem');
			listItems.forEach(item => {
				if (!item.classList.contains('addNewItem')) {
					listItemsContainer.removeChild(item);
				}
			});

			for (let i = 1; i < todoList.length; i++) {
				const existingListItem = document.querySelector('#listItemClone');
				const existingListItem2 = existingListItem.cloneNode(true);
				existingListItem2.removeAttribute('id');

				const checkBoxButton = existingListItem2.querySelector(".checkBox");
				checkBoxButton.setAttribute("data-status", todoList[i].checked);
				checkBoxButton.addEventListener("click", () => {
					checkBoxButton.setAttribute("data-status", checkBoxButton.getAttribute("data-status") === "unchecked" ? "checked" : "unchecked");
				});

				const contentEditButton = existingListItem2.querySelector(".contentEditButton");
				contentEditButton.addEventListener("click", (event) => {
					event.stopPropagation();
					const contentEditable = contentEditButton.parentElement.querySelector("p");
					contentEditable.setAttribute("contenteditable", "true");
					contentEditable.focus();

					const clickOutsideListener = (event) => {
						if (!contentEditable.contains(event.target)) {
							contentEditable.setAttribute("contenteditable", "false");
							document.removeEventListener("click", clickOutsideListener);
						}
					};

					document.addEventListener("click", clickOutsideListener);
				});

				existingListItem2.querySelector(".listText").textContent = todoList[i].text;
				const lastItem = listItemsContainer.lastElementChild;
				listItemsContainer.insertBefore(existingListItem2, lastItem);
			}

			// console.log("List has been loaded");
		}
	}



	setInterval(() => {
		saveStateToLocalStorage();
	}, 5000);

	loadStateFromLocalStorage();
}