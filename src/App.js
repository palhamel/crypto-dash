import React, { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'
import { formatData } from './utils'

import './styles.css'

function App() {
  // useState:
  const [currencies, setCurrencies] = useState([])
  const [pair, setPair] = useState('')
  const [price, setPrice] = useState('0.00')
  const [pastData, setPastData] = useState({}) // object-data
  // variables:
  const ws = useRef(null)
  let first = useRef(false)
  const url = 'https://api.pro.coinbase.com' // variable base api url:

  // useEffect hook nr 1:
  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com') // init websocket feed
    let pairsArray = [] // init empty Array

    // async API call:
    const apiCall = async () => {
      await fetch(url + '/products')
        .then((res) => res.json())
        .then((data) => (pairsArray = data))
      // console.log('pairsArray data:', pairsArray)

      const err = console.log(
        'first run - no currency - please select a currency pair'
      )

      // filter res data:
      let filteredArray = pairsArray.filter((pair) => {
        if (pair.quote_currency === 'USD') {
          return pair
        } else {
          return err
        }
        // console.log('data in pair:', pair)
      })
      // console.log('filteredArray data:', filteredArray)

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
      // console.log('currencies', currencies)

      first.current = true // to tell the first useEffect is finish
    }

    apiCall() // call the async function hook ⚠️
  }, []) // TODO: <== check dependency array

  // useEffect hook nr 2, to select additional data :
  useEffect(() => {
    //prevents this hook from running on initial render
    if (!first.current) {
      console.log('first hook didnt run')
      return
    }
    console.log('running second hook')

    let msg = {
      type: 'subscribe',
      product_ids: [pair],
      channels: ['ticker'],
    }

    let jsonMsg = JSON.stringify(msg)
    ws.current.send(jsonMsg)

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`

    let dataArr = []

    const fetchHistoricalData = async () => {
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data))

      //helper function to format data that will be implemented later TODO:
      let formattedData = formatData(dataArr)
      setPastData(formattedData)
    }
    //run async function to get historical data
    fetchHistoricalData()
    //need to update event listener for the websocket object so that it is listening for the newly updated currency pair
    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data)
      if (data.type !== 'ticker') {
        return
      }
      //every time we receive an even from the websocket for our currency pair, update the price in state
      if (data.product_id === pair) {
        setPrice(data.price)
      }
    }
    //dependency array is passed pair state, will run on any pair state change
  }, [pair])

  const handleSelect = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [pair],
      channels: ['ticker'],
    }
    let unsub = JSON.stringify(unsubMsg)

    ws.current.send(unsub)

    setPair(e.target.value)
  }
  console.log('price:', price)
  console.log('pastData obj:', pastData)

  return (
    <div>
      <div className='container'>
      <h2>Crypto/stock/currency dashboard project - in progress</h2>
        {
          <select name='currency' value={pair} onChange={handleSelect}>
            {currencies.map((cur, idx) => {
              return (
                <option key={idx} value={cur.id}>
                  {cur.display_name}
                </option>
              )
            })}
          </select>
        }
        <Dashboard price={price} data={pastData} />
        {price < 1 ? 'No data loaded' : 'Loaded data + live update'}
      </div>
    </div>
  )
}

export default App
