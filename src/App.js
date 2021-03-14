import React, { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'

import logo from './logo.svg'
import './App.css'

/*
1 currencies: all available currency pairs on Coinbase
2 pair: current currency pair selected by the user
3 price: price of the current currency
4 pastData: historical price data from current currency

3 variables to store:
 > ws: a useRef hook to create a persistent websocket object
 > url: a base URL to the coinbase API
 > first: another useRef hook to prevent an initial render
*/

function App() {
  // useState:
  const [currencies, setCurrencies] = useState([])
  const [pair, setPair] = useState('')
  const [price, setPrice] = useState('0.00')
  const [pastData, setPastData] = useState({}) // object-data
  // variables:
  const ws = useRef(null)
  let first = useRef(false)
  // variable base api url:
  const url = 'https://api.pro.coinbase.com'

  // useEffect hook:
  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com') // init websocket feed

    let pairsArray = [] // init empty Array

    // async API call:
    const apiCall = async () => {
      await fetch(url + '/products')
        .then((res) => res.json())
        .then((data) => (pairsArray = data))
      console.log('pairsArray data:', pairsArray)

      // filter res data:
      let filteredArray = pairsArray.filter((pair) => {
        if (pair.quote_currency === 'USD') {
          return pair
        }
      })
      console.log('filteredArray data:', filteredArray)

      // sort data alphabetically:
      filteredArray = filteredArray.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1
        }
        if (a.base_currency > b.base_currency) {
          return 1
        }
        return 0
      })

      setCurrencies(filteredArray) // set currencies to data of the filteredArray
      console.log('currencies', currencies)

      first.current = true
    }

    // apiCall() // call function
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <p>Lets do this - code.</p>
      </header>
    </div>
  )
}

export default App
