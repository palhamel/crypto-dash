import React, { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'

import logo from './logo.svg'
import './App.css'


/*
 > currencies- all available currency pairs on Coinbase
 > pair- current currency pair selected by the user
 > price- price of the current currency
 > pastData- historical price data from current currency

3 variables to store:
 > ws- a useRef hook to create a persistent websocket object
 > url- a base URL to the coinbase API
 > first- another useRef hook to prevent an initial render
*/

function App() {
  // useState:
  const [currencies, setCurrencies] = useState([])
  const [pair, setPair] = useState("")
  const [price, setPrice] = useState("0.00")
  const [pastData, setPastData] = useState({}) // object-data
  // variables:
  const ws = useRef(null)
  let first = useRef(false)
  const url = 'https://api.pro.coinbase.com'

  // useEffect hook: 
  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com') // init websocket feed

    let pairsArray = [] // empty Array 

    // async API call: 
    const apiCall = async () => {
      await fetch(url + "/products")
      .then((res) => res.json())
      .then((data) => (pairsArray = data))
      console.log('pairsarray data:', pairsArray)
      
    }

    apiCall() // call function
  }, [])






  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Lets do this - code.
        </p>

      </header>
    </div>
  )
}

export default App
