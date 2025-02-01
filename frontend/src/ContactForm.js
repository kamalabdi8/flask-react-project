import { useState, useEffect } from "react";

const ContactForm = ({ existingContact = null, updateCallback }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (existingContact) {
      setFirstName(existingContact.first_name);
      setLastName(existingContact.last_name);
      setEmail(existingContact.email);
    }
  }, [existingContact]);

  const updating = existingContact !== null;

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = { first_name: firstName, last_name: lastName, email };

    const url = "http://127.0.0.1:5000/" + (updating ? `update_contact/${existingContact.id}` : "create_contact");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.ok) {
      updateCallback();
    } else {
      const errorData = await response.json();
      alert(errorData.error || "An error occurred");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button type="submit">{updating ? "Update Contact" : "Create Contact"}</button>
    </form>
  );
};

export default ContactForm;
