import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './Notification' // <-- ✅ import Notification

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null) // ✅ for notifications

  useEffect(() => {
    personService.getAll().then(setPersons)
  }, [])

  // ✅ Show notification helper
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleAdd = (event) => {
    event.preventDefault()

    const existing = persons.find(p => p.name === newName)
    const newPerson = { name: newName, number: newNumber }

    if (existing) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number?`
      )
      if (confirmUpdate) {
        personService
          .update(existing.id, newPerson)
          .then(updated => {
            setPersons(persons.map(p => p.id !== existing.id ? p : updated))
            showMessage(`Updated ${newName}'s number`)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showMessage(
              `${newName}'s info was already removed from the server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(added => {
          setPersons(persons.concat(added))
          showMessage(`Added ${newName}`)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${name}`)
        })
        .catch(() => {
          showMessage(
            `${name}'s info was already removed from the server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} /> {/* ✅ Show notification */}

      <Filter value={filter} onChange={e => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleAdd}
        newName={newName}
        handleNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={e => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}

export default App
