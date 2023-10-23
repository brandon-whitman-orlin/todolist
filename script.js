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

		const paragraph = document.createElement("p");
		paragraph.className = "listText";
		paragraph.setAttribute("contenteditable", "false");
		paragraph.textContent = "List Item Number 1";

		button.appendChild(clonedSVG);
		button2.appendChild(clonedSVG2);

		listItem.appendChild(button);
		listItem.appendChild(button2);
		listItem.appendChild(paragraph);

		const list = document.querySelector(".listItems");

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