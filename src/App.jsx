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
    const [countryToShow, setCountryToShow] = useState({})
    const [show, setShow] = useState(false)
    const handler = (event) => {
        setShow(true)
        axios
            .get(`${specificCountry}/${event.previousElementChild.innerText}`)
            .then(resp => setCountryToShow(resp.data))
    }
    if (countries.length === 1) {
        setCountryToShow(countries[0])
    }
    if (show) {
        return (<><Country country={countryToShow} /></>)
    } else if (countries.length < 10 && countries.length !== 1) {
        return (<>{countries.map(x => {return(<CountryName country={x} handler={handler} />)})}</>)
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

