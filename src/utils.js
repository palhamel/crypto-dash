export const formatData = (data) => {
  let finalData = {
    labels: [],
    datasets: [
      {
        label: 'Price',
        type: 'line',
        // steppedLine: true,
        fill: true,
        lineTension: 0.1,
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  }

  let dates = data.map((val) => {
    const ts = val[0]
    let date = new Date(ts * 1000)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let final = `${month}-${day}-${year}`
    return final
  })

  let priceArr = data.map((val) => {
    return val[4]
  })

  priceArr.reverse()
  dates.reverse()
  finalData.labels = dates
  finalData.datasets[0].data = priceArr

  return finalData
}
