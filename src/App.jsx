import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'
const allCountries = `${baseUrl}/api/all`
const specificCountry = `${baseUrl}/name`

const CountryName = ({country, handler}) => {
    return (
        <>
            <p>{country.name.common}</p><button onClick={handler}>show</button>
        </>
    )
}

const Country = ({ country }) => {
    return (
        <>
            <p>{country.name.common}</p>
            <p>capital: {country.capital}</p>
            <p>area: {country.area}</p>
            <p>languages:</p>
            <ul>{Object.values(country.languages).map(x => { return (<li>{x}</li>) })}</ul>
            <img src={country.flags.png} />
        </>
    )
}

const Countries = ({ countries }) => {
    const [show, setShow] = useState(false)
    const [country, setCountry] = useState({})
    const handleShowClick = ({country}) => {
        setShow(true)
        setCountry(country)
    }
    if (countries.length > 10) {
        return(<p>Please make your query more specific. Too many matches found.</p>)
    } else if (countries.length === 1) {
        return(<Country country={countries[0]} />)
    } else if (show) {
        return(<Country country={country} />)
    } else {
        countries.map((country) => {
            return (
                <div key={country.ccn3}>
                    <span>{country.name.common}</span>
                    <button onClick={handleShowClick(country)}>show</button>
                </div>
            )
        })
    }
}

export default function App() {
    const [query, setQuery] = useState('')
    const [countries, setCountries] = useState([])
    useEffect(() => {
        axios
            .get(allCountries)
            .then(resp => setCountries(resp.data))
    }, [])
    const handleQueryChange = (event) => setQuery(event.target.value)
    return (
        <>
            <form>
                <div>
                    find countries <input value={query} onChange={handleQueryChange} />
                </div>
            </form>
            <Countries countries={countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()))} />
        </>
    )
}

