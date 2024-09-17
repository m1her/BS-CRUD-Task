// Default Data
const priceData = { Free: 0, VIP: 20.99, Diamond: 20.99, Golden: 15.99 };

// Store Localstorage to local variable members
const members = [];
const membersData = JSON.parse(localStorage.getItem("CrableData"));
members.push(...membersData);

// DOM Elements
const tableBody = document.getElementById("tableBody");
const totalResults = document.getElementById("totalResults");
const myModalElement = document.getElementById("addModal");
const myModal = new bootstrap.Modal(myModalElement);

// Add records to the table
const displayRecords = (filtered = members) => {
  tableBody.innerHTML = "";

  if (filtered.length == 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="9" class="id col-12 text-muted">There Are No Members...</td>`;
    tableBody.appendChild(row);
  } else {
    filtered.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="id">${index + 1}</td>

        <td>
        <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addModal" 
        onclick="editHandler(${user.id})">
        <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="deleteHandler(${
          user.id
        })">
        <i class="fa-solid fa-trash"></i>
        </button>
        </td>

        <td>${user.name}</td>
        <td>${user.email}</td>

        <td>
        <div class="tier px-4 rounded-pill bg-opacity-10 d-flex align-items-center justify-content-center pb-1">
        ${user.tier}
        </div>
        </td>
        
        <td>
        <div class="rounded-pill bg-opacity-10 d-flex align-items-center justify-content-center pb-1
        ${user.isActive ? "text-success bg-success" : "text-danger bg-danger"}">
        ${user.isActive ? "Active" : "Inactive"}
        </div>
        </td>

        <td>${user.paymentMethod}</td>
        <td>
        <div class="rounded-pill bg-opacity-10 d-flex align-items-center justify-content-center pb-1
        ${user.renewal ? "text-success bg-success" : "text-danger bg-danger"}">
        ${user.renewal ? "Yes" : "No"}
        </div>
        </td>

        <td>$${user.price}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  // Add tiers classes for style
  const tiers = document.querySelectorAll(".tier");
  tiers.forEach((tierElement) => {
    const tierText = tierElement.textContent.trim();
    switch (tierText) {
      case "Free":
        tierElement.classList.add("free");
        break;
      case "VIP":
        tierElement.classList.add("vip");
        break;
      case "Golden":
        tierElement.classList.add("golden");
        break;
      case "Diamond":
        tierElement.classList.add("diamond");
        break;
    }
  });
  totalResults.innerText = members.length;
};

displayRecords();

(function () {
  "use strict";

  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          event.stopPropagation();
        } else {
          const formData = new FormData(form);

          const formObject = {};
          formData.forEach((value, key) => {
            formObject[key] = value;
          });

          members.push({
            id: Math.random(),
            ...formObject,
            price: priceData[formObject.tier],
          });
          displayRecords();
          localStorage.setItem("CrableData", JSON.stringify(members));
          myModal.hide();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const deleteHandler = (id) => {
  const index = members.findIndex((user) => user.id === id);

  if (index !== -1) {
    members.splice(index, 1);
    displayRecords();
    localStorage.setItem("CrableData", JSON.stringify(members));
  }
};

const sortByTier = () => {
  members.sort((a, b) => {
    const tierOrder = ["Free", "Golden", "Diamond", "VIP"];
    const tierComparison =
      tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);

    return tierComparison;
  });

  displayRecords();
};

const sortByName = () => {
  members.sort((a, b) => a.name.localeCompare(b.name));

  displayRecords();
};

function sortMembers(method) {
  if (method === "2") {
    sortByName();
  } else if (method === "3") {
    sortByTier();
  } else {
    members.length = 0;
    members.push(...membersData);
    displayRecords();
  }
}

const selectElement = document.getElementById("sortingSelect");
selectElement.addEventListener("change", (event) => {
  const selectedMethod = event.target.value;
  sortMembers(selectedMethod);
});

const editHandler = (memberId) => {
  const index = members.findIndex((member) => member.id === memberId);

  const form = document.getElementById("addForm");

  Array.from(form.elements).forEach((input) => {
    const { name, type } = input;

    if (members[index][name] !== undefined) {
      if (type === "checkbox") {
        input.checked = members[index][name];
      } else {
        input.value = members[index][name];
      }
    }
  });

  const btn = document.getElementById("modalAddBtn");
  const title = document.getElementById("exampleModalLabel");
  title.innerText = "Edit Member";
  btn.innerText = "Save";
  btn.type = "button";
  btn.onclick = function () {
    const formData = new FormData(form);

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    members[index].name = formObject.name;
    members[index].email = formObject.email;
    members[index].tier = formObject.tier;
    members[index].isActive = formObject.isActive;
    members[index].paymentMethod = formObject.paymentMethod;
    members[index].renewal = formObject.renewal;
    members[index].price = priceData[formObject.tier];
    displayRecords();
    myModal.hide();
    localStorage.setItem("CrableData", JSON.stringify(members));
  };
};

const addMemberBtn = document.getElementById("AddMemberBtn");
addMemberBtn.onclick = function () {
  const btn = document.getElementById("modalAddBtn");
  const title = document.getElementById("exampleModalLabel");
  title.innerText = "Add Member";
  btn.innerText = "Add Member";
  btn.type = "submit";
};

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function (event) {
  const currentValue = event.target.value;
  searchHandler(currentValue);
});

const searchHandler = (text) => {
  console.log(text);

  const filteredMembers = members.filter((user) =>
    user.name.toLowerCase().includes(text.toLowerCase())
  );
  displayRecords(filteredMembers);
};
