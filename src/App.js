import React, { useState, useEffect, useRef } from 'react'

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
  const apiUrl= 'https://api.pro.coinbase.com'

  // useEffect hook: 

  useEffect(() => {

  }, [])






  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and saasdfasdfasdfve to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
