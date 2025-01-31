import React from "react";

const ContactList = ({ contacts, updateContact, updateCallback }) => {
  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE"
      };
      const response = await fetch(`http://127.0.0.1:5000/delete_contact/${id}`, options);
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      alert(error);
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Contacts"),
    React.createElement(
      "table",
      null,
      React.createElement(
        "thead",
        null,
        React.createElement("tr", null,
          React.createElement("th", null, "First Name"),
          React.createElement("th", null, "Last Name"),
          React.createElement("th", null, "Email"),
          React.createElement("th", null, "Actions")
        )
      ),
      React.createElement(
        "tbody",
        null,
        contacts.map((contact) =>
          React.createElement(
            "tr",
            { key: contact.id },
            React.createElement("td", null, contact.firstName),
            React.createElement("td", null, contact.lastName),
            React.createElement("td", null, contact.email),
            React.createElement(
              "td",
              null,
              React.createElement("button", { onClick: () => updateContact(contact) }, "Update"),
              React.createElement("button", { onClick: () => onDelete(contact.id) }, "Delete")
            )
          )
        )
      )
    )
  );
};

export default ContactList;
