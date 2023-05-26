import './styles.sass'
import { getDay, parseISO } from 'date-fns'
import weatherCondition from './weather_conditions.json' assert { type: 'json' }

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
function getStringDates() {
  let stringDates = []
  for (let i = 0; i < APIobj.forecast.forecastday.length; i++) {
    stringDates.push(APIobj.forecast.forecastday[i].date)
  }
  return stringDates
}
function getDaysOfDates(dates) {
  for (let i = 0; i < dates.length; i++) {
    dates[i] = getDay(parseISO(dates[i]))
    switch (dates[i]) {
      case 0 : dates[i] = 'Sunday' 
      break
      case 1 : dates[i] = 'Monday' 
      break
      case 2 : dates[i] = 'Tuesday' 
      break
      case 3 : dates[i] = 'Wednesday' 
      break
      case 4 : dates[i] = 'Thursday' 
      break
      case 5 : dates[i] = 'Friday' 
      break
      case 6 : dates[i] = 'Saturday' 
      break
    }
  }
  return dates
}
function getIconUrl(weather) {
  let code = weather.day.condition.code
  let conditionObj = weatherCondition.find(e => e.code === code)
  let iconCode = conditionObj.icon
  if (APIobj.current.is_day === 1) {
    return `../src/icons/day/${iconCode}.png`
  } else {
    return `../src/icons/night/${iconCode}.png`
  }
}
function getIconUrlHourly(APIobj, time) {
  let code = APIobj.forecast.forecastday[0].hour[time].condition.code
  let conditionObj = weatherCondition.find(e => e.code === code)
  let iconCode = conditionObj.icon
  if (APIobj.current.is_day === 1) {
    return `../src/icons/day/${iconCode}.png`
  } else {
    return `../src/icons/night/${iconCode}.png`
  }
}
function updateElements() {
  const cityName = document.getElementById('cityName')
  const currentTemp = document.getElementById('currentTemp')

  cityName.textContent = `${APIobj.location.name}`
  currentTemp.textContent = `${APIobj.current.temp_c}°C`

  const days = document.querySelectorAll('.day')
  const weatherIcons = document.querySelectorAll('.weatherIcon')
  const rainChances = document.querySelectorAll('.rainChance')
  const tempsDay = document.querySelectorAll('.tempDay')
  const tempsNight = document.querySelectorAll('.tempNight')
  const precipitations = document.querySelectorAll('.precipitation')

  for (let i = 0; i < days.length; i++) {
    days[i].textContent = getDaysOfDates(getStringDates())[i]
    rainChances[i].textContent = `${APIobj.forecast.forecastday[i].day.daily_chance_of_rain}%`
    tempsDay[i].textContent = `${APIobj.forecast.forecastday[i].day.maxtemp_c}°C /`
    tempsNight[i].textContent = `${APIobj.forecast.forecastday[i].day.mintemp_c}°C`
    precipitations[i].textContent = `${APIobj.forecast.forecastday[i].day.totalprecip_mm}mm`

    weatherIcons[i].replaceChildren()
    const weatherIcon = document.createElement('img')
    weatherIcon.src = getIconUrl(APIobj.forecast.forecastday[i])
    weatherIcon.alt = 'icon representing weather'
    weatherIcons[i].appendChild(weatherIcon)
  }
}
function setTheme() {
  const body = document.querySelector('body')
  if (APIobj.current.is_day !== 1) {
    body.classList.add('night')
  } else {
    body.classList.remove('night')
  }
}
function getHourlyTemps(APIobj) {
  let temps = []
  APIobj.forecast.forecastday[0].hour.forEach(hour => temps.push(hour.temp_c))
  return temps
}
function getHours() {
  let hours = []
  for (let i = 0; i < 24; i++) {
    hours.push(`${i}:00`)
  }
  return hours
}
function getHourlyPrecipitationChance(APIobj) {
  let precipitationChance = []
  APIobj.forecast.forecastday[0].hour.forEach(hour => precipitationChance.push(hour.chance_of_rain))
  return precipitationChance
}
function makeToday(APIobj) {
  const hours = getHours()
  let temps = getHourlyTemps(APIobj)
  let precipitationChances = getHourlyPrecipitationChance(APIobj)
  const hourDivs = document.querySelector('.hourDivs')
  const todayDiv = document.querySelector('.today')

  todayDiv.replaceChildren()
  hourDivs.replaceChildren()

  for (let i = 0; i < hours.length; i++) {
    const hourDiv = document.createElement('div')
    const hour = document.createElement('div')
    const weahterIconHour = document.createElement('img')
    const tempHour = document.createElement('div')
    const chanceToRainHour = document.createElement('div')

    const rainDropIcon = document.createElement('img')
    const chanceToRainHourPercent = document.createElement('div')

    rainDropIcon.src = '../src/icons/raindrop.png'
    rainDropIcon.alt = 'raindrop symbol'

    hourDiv.classList.add('hourDiv')
    hour.classList.add('hour')
    weahterIconHour.classList.add('weatherIconHour')
    tempHour.classList.add('tempHour')
    chanceToRainHour.classList.add('chanceToRainHour')

    weahterIconHour.src = getIconUrlHourly(APIobj, i)
    hour.textContent = hours[i]
    tempHour.textContent = `${temps[i]}°C`
    chanceToRainHourPercent.textContent = `${precipitationChances[i]}%`
    chanceToRainHour.append(rainDropIcon, chanceToRainHourPercent)

    hourDiv.append(hour, weahterIconHour, tempHour, chanceToRainHour)
    hourDivs.append(hourDiv)
  }
  todayDiv.append(hourDivs)
}
function getCurrentHour(APIobj) {
  return Number(Array.from(APIobj.location.localtime).slice(-5, -3).join(''))
}
function setTodayDivScrollbar(currentHour, divToScroll) {
  const delta = 167
  divToScroll.scrollLeft = 0
  divToScroll.scrollLeft += currentHour * delta
}

const firstLoad = (async () => {
  const searchButton = document.getElementById('searchButton')
  const cityInput = document.getElementById('cityInput')
  const todayDivContainer = document.querySelector('.hourDivs')

  function horizontalScroll(e) {
    e = window.event || e
    let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
    todayDivContainer.scrollLeft -= (delta * 167)
    e.preventDefault()
  }
  todayDivContainer.addEventListener('wheel', horizontalScroll)
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchButton.click()
    }
  })
  searchButton.addEventListener('click', async () => {
    await getJson(getUserInput())
    console.log(APIobj)
    setTheme()
    updateElements()
    makeToday(APIobj)
    setTodayDivScrollbar(getCurrentHour(APIobj), todayDivContainer)
  })

  await getJson('budapest')
  updateElements()
  setTheme()
  makeToday(APIobj)
  setTodayDivScrollbar(getCurrentHour(APIobj), todayDivContainer)
})()
