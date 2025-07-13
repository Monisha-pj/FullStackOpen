import { useEffect, useState } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Find countries</h1>
      <input value={search} onChange={e => {
        setSearch(e.target.value)
        setSelectedCountry(null)
      }} />

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 && (
        <CountryList countries={filtered} onShow={setSelectedCountry} />
      )}

      {filtered.length === 1 && <CountryDetails country={filtered[0]} />}

      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </div>
  )
}

export default App
