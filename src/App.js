import { useEffect, useState, useRef } from "react";
import "./styles.css";

export default function App() {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(friends[0]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1001);
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef();

  async function fetchFriends() {
    try {
      const response = await fetch("/friends.json");
      const data = await response.json();
      console.log(data);
      setFriends(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  // 👇 This useEffect runs whenever `friends` changes
  useEffect(() => {
    if (friends.length > 0) {
      setSelectedEmployee(friends[0]);
      setSelectedEmployeeId(friends[0].id);
    } else {
      setSelectedEmployee(null);
      setSelectedEmployeeId(null);
    }
  }, [friends]);

  //on outside click useEffect
  useEffect(() => {
    function onOutsideClick(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setShowForm(false);
      }
    }
    if (showForm) {
      document.addEventListener("mousedown", onOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [showForm]);

  function handleDeleteItem(id) {
    const updatedFriends = friends.filter((item) => item.id !== id);
    setFriends(updatedFriends);
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    const dob = values.dob;
    const age = new Date().getFullYear() - parseInt(dob.slice(0, 4));
    const id = Date.now();
    const empData = {
      ...values,
      id,
      age,
    };
    empData.contactNumber = Number(empData.contactNumber);
    empData.salary = Number(empData.salary);
    setFriends([empData, ...friends]);
    setShowForm(false);
    e.target.reset();
  }

  return (
    <div className="App">
      <header className="header">
        <span>Employee Database Management System </span>
        <button className="createEmployee" onClick={() => setShowForm(true)}>
          Add Employee
        </button>
      </header>
      <div className="employees">
        <div className="employee__list">
          <span className="employee__list--title">Employee List</span>
          <div className="employee__list--info">
            {friends && friends.length
              ? friends.map((item, ind) => (
                  <span
                    key={item.id}
                    className={
                      selectedEmployeeId === item.id
                        ? "employee__list--item selected"
                        : "employee__list--item"
                    }
                    onClick={() => {
                      setSelectedEmployee(item);
                      setSelectedEmployeeId(item.id);
                    }}
                  >
                    <span>
                      {item.firstName} {item.lastName}
                    </span>
                    <i
                      className="deleteEmployee"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      ❌
                    </i>
                  </span>
                ))
              : null}
          </div>
        </div>
        <div className="employee__single">
          <span className="employee__single--title">Employee Information</span>
          {selectedEmployee && (
            <div className="employee__single--info">
              <img src={selectedEmployee.imageUrl} />
              <div className="employee__single--heading">
                {selectedEmployee.firstName} {selectedEmployee.lastName} (
                {selectedEmployee.age})
              </div>
              <span>{selectedEmployee.address}</span>
              <span>{selectedEmployee.email}</span>
              <span>Contact - {selectedEmployee.contactNumber}</span>
              <span>Dob - {selectedEmployee.dob}</span>
            </div>
          )}
        </div>
      </div>
      <div
        className="addEmployee"
        style={{ display: showForm ? "flex" : "none" }}
      >
        <form
          className="addEmployee_create"
          ref={formRef}
          onSubmit={handleSubmitForm}
        >
          Add Employee From
          <div>
            <input
              type="text"
              placeholder="first name"
              name="firstName"
              required
            />
            <input
              type="text"
              placeholder="last name"
              name="lastName"
              required
            />
          </div>
          <input type="text" placeholder="address" name="address" required />
          <input type="email" placeholder="email" name="email" required />
          <input type="text" placeholder="image URL" name="imageUrl" required />
          <input type="number" placeholder="salary" name="salary" required />
          <input
            type="number"
            placeholder="contact"
            name="contactNumber"
            required
          />
          <input type="date" placeholder="date of birth" name="dob" required />
          <input type="submit" value="submit" />
        </form>
      </div>
    </div>
  );
}
