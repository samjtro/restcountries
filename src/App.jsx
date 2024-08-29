import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'
const allCountries = `${baseUrl}/api/all`

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
    if (countries.length < 10 && countries.length !== 1) {
        return (<>{countries.map(x => { return (<p>{x.name.common}</p>) })}</>)
    } else if (countries.length === 1) {
        return (<><Country country={countries[0]} /></>)
    }
    return (<><p>too many matches, narrow your search!</p></>)
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

