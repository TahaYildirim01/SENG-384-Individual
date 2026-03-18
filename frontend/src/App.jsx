import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

const API_URL = "http://localhost:5001/api";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!fullName.trim()) {
      setMessage("Full Name is required.");
      return;
    }

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Email format is invalid.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/people`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "EMAIL_ALREADY_EXISTS") {
          setMessage("This email already exists.");
        } else {
          setMessage(data.error || "An error occurred.");
        }
        return;
      }

      setMessage("Person added successfully.");
      setFullName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed.");
    }
  };

  return (
    <div className="container">
      <h1>Person Management System</h1>

      <nav className="nav">
        <Link to="/">Register</Link>
        <Link to="/people">People List</Link>
      </nav>

      <div className="card">
        <h2>Registration Form</h2>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />

          <button type="submit">Add Person</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const loadPeople = async () => {
    try {
      const response = await fetch(`${API_URL}/people`);
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not load people.");
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const startEdit = (person) => {
    setEditingId(person.id);
    setEditFullName(person.full_name);
    setEditEmail(person.email);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFullName("");
    setEditEmail("");
  };

  const saveEdit = async (id) => {
    setMessage("");

    if (!editFullName.trim()) {
      setMessage("Full Name is required.");
      return;
    }

    if (!editEmail.trim()) {
      setMessage("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setMessage("Email format is invalid.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/people/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: editFullName,
          email: editEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "EMAIL_ALREADY_EXISTS") {
          setMessage("This email already exists.");
        } else if (data.error === "NOT_FOUND") {
          setMessage("Person not found.");
        } else {
          setMessage(data.error || "Update failed.");
        }
        return;
      }

      setMessage("Person updated successfully.");
      setEditingId(null);
      loadPeople();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed.");
    }
  };

  const deletePerson = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this person?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/people/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Delete failed.");
        return;
      }

      setMessage("Person deleted successfully.");
      loadPeople();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed.");
    }
  };

  return (
    <div className="container">
      <h1>Person Management System</h1>

      <nav className="nav">
        <Link to="/">Register</Link>
        <Link to="/people">People List</Link>
      </nav>

      <div className="card">
        <h2>People List</h2>

        {message && <p className="message">{message}</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>
                  {editingId === person.id ? (
                    <input
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                    />
                  ) : (
                    person.full_name
                  )}
                </td>
                <td>
                  {editingId === person.id ? (
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    person.email
                  )}
                </td>
                <td>
                  {editingId === person.id ? (
                    <>
                      <button onClick={() => saveEdit(person.id)}>Save</button>
                      <button className="danger-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(person)}>Edit</button>
                      <button
                        className="danger-btn"
                        onClick={() => deletePerson(person.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr>
                <td colSpan="4">No people found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/people" element={<PeoplePage />} />
    </Routes>
  );
}