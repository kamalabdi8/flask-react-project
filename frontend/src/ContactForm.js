import { useState, useEffect } from "react";

const ContactForm = ({ existingContact = null, updateCallback }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    setError("");

    const data = { first_name: firstName, last_name: lastName, email };

    const url = `http://127.0.0.1:5001/${updating ? `update-contact/${existingContact.id}` : "create-contact"}`;
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }
      updateCallback();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button type="submit">{updating ? "Update Contact" : "Create Contact"}</button>
    </form>
  );
};

export default ContactForm;
