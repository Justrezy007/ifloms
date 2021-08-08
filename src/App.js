import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import dayjs from "dayjs";
import firebase from './firebase';

export default function App() {
  const closePop = (e) => {
    setIsShowed(false);
    setIsNotSafe(false);
  }

  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [firebaseDTB,setFirebaseDTB] = useState({});
  const [espImage,setEspImage] = useState({});
  const [isCaptured,setIsCaptured] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loadFore, setLoadFore] = useState(true);
  const [isNotSafe, setIsNotSafe] = useState(true);
  const [isShowed, setIsShowed] = useState(false);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState(true);
  let date;

  useEffect(() => {
    // Mengambil data dari openweathermap api -> current
    const fecthWeatherData = async () => {
      const res = await axios(
        "https://api.openweathermap.org/data/2.5/onecall?lat=-6.9932&lon=110.4203&exclude=daily&appid=f5d314e9e3e23f5233d62b56b5c03305"
      );
      setWeatherData(res.data);
      setLoading(false);
    };
    // Mengambil data dari openweathermap api -> forecasting
    const fecthForecastData = async () => {
      const res = await axios(
        "https://api.openweathermap.org/data/2.5/forecast?lat=-6.993&lon=110.4203&appid=ac3c4242976663e9458efc271c17846b"
      );
      setForecastData(res.data);
      const sortArr = [];
      const timeArr = [];
      for (let i = 0; i < 40; i++) {
        if (i % 8 == 0) {
          sortArr.push(res.data.list[i]);
        }
      }
      setForecastData(sortArr);
      setLoadFore(false);
    };
    // Mengambil data dari realtime database firebase
    const getRDTB = async () =>{
      const dtb = firebase.database().ref('/Ifloms/1/level')
       dtb.on('value',snapshot =>{
         const data = snapshot.val();
         setFirebaseDTB(data);
         setIsDatabaseLoading(false);
         console.log(data);
         if(data >= 25){
           setIsNotSafe(true);
           setIsShowed(true);
         }
         else{
           setIsShowed(false);
           setIsNotSafe(false);
         }
       });
    };
    const getImage = async () =>{
      const dtb = firebase.database().ref('/Ifloms/1/photo')
       dtb.on('value',snapshot =>{
         const data = snapshot.val();
         setEspImage(data);
         setIsCaptured(true);
       });
    };
    getRDTB();
    getImage();
    fecthWeatherData();
    fecthForecastData();
  }, []);

  // image source + name.svg
  const link =
    "https://raw.githubusercontent.com/basmilius/weather-icons/37bef237865ce7a2961f1d1aa62b3e2fd3c1bbf3/design/fill/animation-ready/";
  return (
    <main>
      <h1 className="title">Flood Monitoring and Mitigation System</h1>
      {/* Menampilkan Cuaca Terkini Sekitar Alat */}
      <div className="currentWeather">
          <div>
             <h2>Semarang, Jawa Tengah</h2>
          </div>
          {isLoading ? (<div>Loading</div>):
          <div className="currentContent">
            <img src={
                    "http://openweathermap.org/img/wn/" +
                    weatherData.current.weather[0].icon +
                    "@2x.png"
                  } />
            <p className="weatherTitle">{weatherData.current.weather[0].main}</p>
            <p className="weatherDescription">{weatherData.current.weather[0].description}</p>
          </div>
          }
      </div>
      {/* Menampilkan data ketinggian air */}
      <div className="dataContainer">
        <div className="waterLevel">
          <div className="waterLevelCard">
            <h2>Water Level</h2><p>
            {isDatabaseLoading ? (<p>Loading</p>):(
                <span className="dataDatabase">{firebaseDTB}</span>
            )}
            </p>
          </div>
        </div>
        <div className="waterLevel">
          <div className="waterLevelCard">
            <h2>Temperature</h2>
            <p>
              {(isLoading)? (
                <span>Loading</span>
              ) : (
                <span>{Math.round(weatherData["current"]["temp"] - 273.15)}&deg;</span>
              )}
            </p>
          </div>
        </div>
        <div className="waterLevel">
          <div className="waterLevelCard">
            <h2>Humidity</h2>
            <p>
              {isLoading ? (
                <span>Loading</span>
              ) : (
                <span>{weatherData["current"]["humidity"]}</span>
              )}
            </p>
          </div>
        </div>
      </div>
      {/* Menampilkan perkiraan Cuaca */}
      <div className="weatherRow">
        {loadFore ? (
          <div>Loading...</div>
        ) : (
          forecastData.map((card, index) => (
            <div className="Weather" key={index}>
              <div className="animation">
                <img
                  src={
                    "http://openweathermap.org/img/wn/" +
                    card.weather[0].icon +
                    "@2x.png"
                  }
                  alt="Hujan"
                />
              </div>
              <div className="information">
                <p>{dayjs(card.dt_txt).format("dddd, MMMM D")}</p>
                <p>{card.weather[0].description}</p>
                <p>{Math.round(card.main.temp - 273.15)}&deg; Celcius</p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Menampilkan Gambar */}
      {isCaptured ? 
      (<div className="getImage">
      <h3>Current Condition</h3>
      <img src={espImage } />
    </div>):null
      }
      {/* Menampilkan Lokasi Alat */}
      <div className="map">
        <div className="mapouter">
          <div className="gmap_canvas">
            <iframe
              width="750"
              height="400"
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=kaligawe&t=&z=19&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Menampilkan Bahaya */}
      {isNotSafe ?
      (<div className="alertContainer">
        <div className="alert">
          <img src="https://i.ibb.co/Y7wqFXj/undraw-warning-cyit-removebg-preview.png" alt="danger" />
          <br />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
              clipRule="evenodd"
            />
          </svg>
          <strong>Warning!</strong>
          <br />
          <h4>Water Level Increase rapidly, be careful of flood!</h4>
        </div>
        <div className="closeButton"><a onClick={closePop}>&times;</a></div>
      </div>):null}

    </main>
  );
}
