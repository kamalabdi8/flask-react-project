import React from "react";

function ContactList({ contacts, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    const response = await fetch(`http://127.0.0.1:5000/delete_contact/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onDelete();
    } else {
      console.error("Error deleting contact");
    }
  };

  return (
    <div>
      <h2>Contact List</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.first_name} {contact.last_name} - {contact.email}
            <button onClick={() => onEdit(contact)}>Edit</button> {/* Edit button */}
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
