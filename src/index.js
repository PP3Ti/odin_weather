import './styles.sass'

const searchButton = document.getElementById('searchButton')

let APIobj

function getUserInput() {
  return document.getElementById('cityInput').value
}
async function getJson(city) {
  await fetch (`https://api.weatherapi.com/v1/forecast.json?key=6af6b71308c846c582175142232105&q=${city}&days=7&aqi=no&alerts=no`, {mode: 'cors'})
  .then (response => {
    return response.json()
  })
  .then (response => {
    APIobj = response
  })
}
function updateElements() {
  const cityName = document.getElementById('cityName')
  const currentTemp = document.getElementById('currentTemp')

  cityName.textContent = `${APIobj.location.name}`
  currentTemp.textContent = `${APIobj.current.temp_c}°C`
}
searchButton.addEventListener('click', async () => {
  await getJson(getUserInput())
  updateElements()
  console.log(APIobj)
})

await getJson('budapest')
updateElements()