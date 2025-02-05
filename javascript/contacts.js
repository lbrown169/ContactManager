const BASE_URL = 'http://cop4331.tech/LAMPAPI';

document.addEventListener("DOMContentLoaded", function () {
  searchContacts();
  
  // Add enter key handler for search
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchContacts();
    }
  });
});

let contacts = [];

// Add this container to hold toasts
document.addEventListener("DOMContentLoaded", function() {
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
});

function showToast(message, type = 'info') {
  const toastContainer = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Create message and close button wrapper
  const content = document.createElement('span');
  content.textContent = message;
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-toast';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  };

  // Add both elements to toast
  toast.appendChild(content);
  toast.appendChild(closeBtn);

  // Add to container
  toastContainer.appendChild(toast);

  // Remove after 6 seconds
  setTimeout(() => {
    if (toast.parentElement) { // Check if toast still exists
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentElement) { // Check again before removing
          toastContainer.removeChild(toast);
        }
      }, 300);
    }
  }, 6000);
}

function startEditContact(contactId) {
  const contact = contacts.find(c => c.id === contactId);
  if (contact) {
    document.getElementById('editFirstName').value = contact.firstName;
    document.getElementById('editLastName').value = contact.lastName;
    document.getElementById('editPhone').value = contact.phone;
    document.getElementById('editEmail').value = contact.email;
  }
  const editContact = document.getElementById('edit-contact');
  editContact.setAttribute('data-id', contactId);
  editContact.style.display = 'block';
}

function editContact() {
  event?.preventDefault();

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    showToast("User not logged in or userId not found.", "error");
    window.location.href = "login.html";
    return;
  }

  const contactId = parseInt(document.getElementById('edit-contact').getAttribute('data-id') || "0", 10);
  if (!contactId) { 
    showToast("No contact ID specified.", "error");
    return;
  }

  const firstName = document.getElementById('editFirstName').value.trim();
  const lastName = document.getElementById('editLastName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const email = document.getElementById('editEmail').value.trim();

  const payload = {
    userId: userId,
    contactId: contactId,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email
  };

  const editContact = document.getElementById('edit-contact');
  fetch(`${BASE_URL}/UpdateContact.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.error && data.error.length > 0) {
        console.error("EditContact Error:", data.error);
        showToast("Error editing contact: " + data.error, "error");
      } else {
        console.log("Contact updated:", data);
        showToast("Contact updated successfully!", "success");
        editContact.style.display = 'none';
        searchContacts(); 
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      showToast("Could not edit contact.", "error");
    }); 
}


function addContact() {
  event.preventDefault();
  
  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    showToast("User not logged in or userId not found.", "error");
    window.location.href = "login.html";
    return;
  }

  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const phone     = document.getElementById("phone").value.trim();
  const email     = document.getElementById("email").value.trim();

  const payload = {
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email
  };

  fetch(`${BASE_URL}/AddContact.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.error && data.error.length > 0) {
        console.error("AddContact Error:", data.error);
        showToast("Error adding contact: " + data.error, "error");
      } else {
        console.log("Contact added:", data);
        showToast("Contact added successfully!", "success");
        document.getElementById('add-contact').style.display = 'none';
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        searchContacts();
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      showToast("Could not add contact.", "error");
    });
}

function searchContacts(page = 1) {
  event?.preventDefault();

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    showToast("User not logged in or userId not found.", "error");
    window.location.href = "login.html";
    return;
  }


  const searchTerm = document.getElementById("search").value.trim();

  const payload = {
    userId: userId,
    query: searchTerm,
    page: page
  };

  fetch(`${BASE_URL}/SearchContacts.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.error && data.error.length > 0) {
        console.error("SearchContacts Error:", data.error);
        showToast("Error searching contacts: " + data.error, "error");
      } else {
        console.log("Search results:", data);
        contacts = data.results || [];
        const rowContainer = document.getElementById("row0");
        rowContainer.innerHTML = "";


        contacts.forEach(contact => {
          const hash = (contact.id * 423);  // Using prime numbers 31 and 199
          let imageType, imageNum;
          
          imageType = 'lego';
          imageNum = (hash * 13) % 10;  

          const cardDiv = document.createElement("div");
          cardDiv.className = "column";
          cardDiv.innerHTML = `
            <div class="card" id="card-${contact.id}">
              <img class="card_back" src="https://randomuser.me/api/portraits/${imageType}/${imageNum}.jpg" alt="Contact Image">
              <br><br>
              ${contact.firstName}<br>
              ${contact.lastName}<br>
              ${contact.email}<br>
              ${contact.phone}<br><br>
              <div class="card_back_og">
                <a href="#" class="delete-contact" style="width:auto;"
                   onclick="deleteContact(${contact.id});">
                  <img src="Pictures/delete_icon.png" width="50" height="50" alt="Delete Contact">
                </a>
                <a href="#" class="edit-contact" style="width:auto;"
                   onclick="startEditContact(${contact.id});">
                  <img src="Pictures/edit_icon.png" width="50" height="50" alt="Edit Contact">
                </a>
              </div>

            </div>
          `;
          rowContainer.appendChild(cardDiv);
        });

        // Update pagination
        updatePagination(data.page, data.pages);
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      showToast("Could not search contacts.", "error");
    });
}

function updatePagination(currentPage, totalPages) {
  const paginationDiv = document.querySelector('.pagination');
  if (!paginationDiv) return;

  let html = '';
  
  html += `<a href="#" onclick="searchContacts(${Math.max(1, currentPage - 1)})" 
    class="${currentPage <= 1 ? 'disabled' : ''}">&laquo; Previous</a>`;

  html += `<a href="#" onclick="searchContacts(1)" 
    class="${currentPage === 1 ? 'active' : ''}">1</a>`;

  if (currentPage > 3) {
    html += '<span class="ellipsis">...</span>';
  }

  // Pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    html += `<a href="#" onclick="searchContacts(${i})" 
      class="${currentPage === i ? 'active' : ''}">${i}</a>`;
  }

  if (currentPage < totalPages - 2) {
    html += '<span class="ellipsis">...</span>';
  }

  if (totalPages > 1) {
    html += `<a href="#" onclick="searchContacts(${totalPages})" 
      class="${currentPage === totalPages ? 'active' : ''}">${totalPages}</a>`;
  }

  html += `<a href="#" onclick="searchContacts(${Math.min(totalPages, currentPage + 1)})" 
    class="${currentPage >= totalPages ? 'disabled' : ''}">Next &raquo;</a>`;

  paginationDiv.innerHTML = html;
}

function deleteContact(contactId) {
  event.preventDefault();

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    showToast("User not logged in or userId not found.", "error");
    window.location.href = "login.html";
    return;
  }


  if (!contactId) {
    showToast("No contact ID specified.", "error");
    return;
  }


  const payload = {
    userId: userId,
    contactId: contactId
  };

  fetch(`${BASE_URL}/DeleteContact.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.status === 204) {
        showToast("Contact deleted successfully!", "success");
        const card = document.getElementById(`card-${contactId}`);
        if (card) {

          card.remove();
          searchContacts();
        }
      } 
      else {
        response.json()
          .then(data => {
            console.error("DeleteContact Error:", data.error);
            showToast("Error deleting contact: " + (data.error || "Unknown error"), "error");
          })

          .catch(() => {
            showToast("Error deleting contact, and could not parse error details.", "error");
          });

      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      showToast("Could not delete contact.", "error");
    });

}
