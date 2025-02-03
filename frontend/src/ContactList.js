import React from "react";

function ContactList({ contacts, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting contact");
      }
      onDelete();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h2>Contact List</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.first_name} {contact.last_name} - {contact.email}
            <button onClick={() => onEdit(contact)}>Edit</button>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
