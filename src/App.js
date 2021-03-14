import React, { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'
import { formatData } from "./utils";

// import './App.css'
import './styles.css'
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

      // filter res data:
      let filteredArray = pairsArray.filter((pair) => {
        if (pair.quote_currency === 'USD') {
          return pair;
        }
      });
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
  // useEffect(() => {
  //   // prevent this hook to run  before the first hook:
  //   if (!first.current) {
  //     console.log('first hook didnt run')
  //     return
  //   }
  //   // Websocket feed - subscribe:
  //   let msg = {
  //     type: "subscribe",
  //     product_ids: [pair],
  //     channels: ["ticker"]
  //   }
  //   let msgAsJson = JSON.stringify(msg)
  //   ws.current.send(msgAsJson)
  // }, [])

  useEffect(() => {
    //prevents this hook from running on initial render
    if (!first.current) {
      return
    }

    console.log('running on pair change')

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
      let formattedData = formatData(dataArr);
      setPastData(formattedData);
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
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setPair(e.target.value);
  };


  return (
    <div className="container">
      {
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
            return (
              <option key={idx} value={cur.id}>
                {cur.display_name}
              </option>
            );
          })}
        </select>
      }
      <Dashboard price={price} data={pastData} />
    </div>
  )
}

export default App
