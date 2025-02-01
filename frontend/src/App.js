import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm.js";
import ContactList from "./ContactList.js";

function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  return (
    <div>
      <h1>Contact Management</h1>
      <ContactForm
        existingContact={editingContact}
        updateCallback={() => {
          fetchContacts();
          setEditingContact(null);
        }}
      />
      <ContactList
        contacts={contacts}
        onDelete={fetchContacts}
        onEdit={setEditingContact} // Pass setEditingContact to edit
      />
    </div>
  );
}

export default App;
