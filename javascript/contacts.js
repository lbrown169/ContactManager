const BASE_URL = 'http://cop4331.tech/LAMPAPI';

function addContact() {
  event.preventDefault();
  
  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    alert("User not logged in or userId not found.");
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
        alert("Error adding contact: " + data.error);
      } else {
        console.log("Contact added:", data);
        alert("Contact added successfully!");
        document.getElementById('add-contact').style.display = 'none';
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Could not add contact.");
    });
}

function searchContacts() {
  event.preventDefault();

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    alert("User not logged in or userId not found.");
    return;
  }

  const searchTerm = document.getElementById("search").value.trim();

  const payload = {
    userId: userId,
    query: searchTerm,
    page: 1
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
        alert("Error searching contacts: " + data.error);
      } else {
        console.log("Search results:", data);
        const contacts = data.results || [];
        const rowContainer = document.getElementById("row0");
        rowContainer.innerHTML = "";

        contacts.forEach(contact => {
          const cardDiv = document.createElement("div");
          cardDiv.className = "column";
          cardDiv.innerHTML = `
            <div class="card" id="card-${contact.id}">
              <img class="card_back" style="width:100%" src="Pictures/user_photo.png">
              <br><br>
              ${contact.firstName}<br>
              ${contact.lastName}<br>
              ${contact.email}<br>
              ${contact.phone}<br><br>
              <div class="card_back">
                <a href="#" class="delete-contact" style="width:auto;"
                   onclick="deleteContact(${contact.id});">
                  <img src="Pictures/delete_icon.png" width="50" height="50">
                </a>
                <a href="#" class="edit-contact" style="width:auto;"
                   onclick="document.getElementById('edit-contact').style.display='block'">
                  <img src="Pictures/edit_icon.png" width="50" height="50">
                </a>
              </div>
            </div>
          `;
          rowContainer.appendChild(cardDiv);
        });
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Could not search contacts.");
    });
}

function deleteContact(contactId) {
  event.preventDefault();

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  if (!userId) {
    alert("User not logged in or userId not found.");
    return;
  }

  if (!contactId) {
    alert("No contact ID specified.");
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
        alert("Contact deleted successfully!");
        const card = document.getElementById(`card-${contactId}`);
        if (card) {
          card.remove();
        }
      } 
      else {
        response.json()
          .then(data => {
            console.error("DeleteContact Error:", data.error);
            alert("Error deleting contact: " + (data.error || "Unknown error"));
          })
          .catch(() => {
            alert("Error deleting contact, and could not parse error details.");
          });
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Could not delete contact.");
    });
}
