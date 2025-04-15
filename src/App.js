import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [loadType, setLoadType] = useState("");
  const [carList, setCarList] = useState([]);
  const [truckList, setTruckList] = useState([]);
  const [allModels, setAllModels] = useState([]);

  useEffect(() => {
    const savedCars = JSON.parse(localStorage.getItem("CarList"));
    const savedTrucks = JSON.parse(localStorage.getItem("TruckList"));
  
    if (savedCars && savedCars.length > 0) setCarList(savedCars);
    if (savedTrucks && savedTrucks.length > 0) setTruckList(savedTrucks);
  }, []);
  
  
  useEffect(() => {
    if (carList.length > 0) {
      localStorage.setItem("CarList", JSON.stringify(carList));
      console.log("CarList saved to localStorage:", JSON.parse(localStorage.getItem("CarList")));
    }
  }, [carList]);
  
  useEffect(() => {
    if (truckList.length > 0) {
      localStorage.setItem("TruckList", JSON.stringify(truckList));
      console.log("TruckList saved to localStorage:", JSON.parse(localStorage.getItem("TruckList")));
    }
  }, [truckList]);
  
  

  const fetchCarDetails = async (brand, model) => {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${brand}?format=json`;
    try {
      let response = await fetch(url);
      let data = await response.json();
      let vehicle = data.Results.find((v) => v.Model_Name.toLowerCase() === model.toLowerCase());
      let models = data.Results.map((v) => v.Model_Name);
      return {
        details: vehicle ? `Vehicle Type: ${vehicle.VehicleType || "Unknown"}` : "Vehicle Type: Unknown",
        allModels: models
      };
    } catch (error) {
      console.error("API Error:", error);
      return { details: "API Error: Details not available", allModels: [] };
    }
  };

  const addCar = async () => {
    if (!brand || !model || !year) {
      alert("Please fill in all fields.");
      return;
    }
  
    let { details, allModels } = await fetchCarDetails(brand, model);
  
    setCarList((prevCarList) => {
      const updatedList = [...prevCarList, { brand, model, year, type: "Car", details }];
      console.log("Updated Car List:", updatedList);
      return updatedList;
    });
  
    setBrand("");
    setModel("");
    setYear("");
    setAllModels(allModels);
  };
  
  
  const addTruck = async () => {
    if (!brand || !model || !year || !loadType) {
      alert("Please fill in all fields.");
      return;
    }
    let { details, allModels } = await fetchCarDetails(brand, model);
  
    setTruckList((prevTruckList) => {
      const updatedList = [...prevTruckList, { brand, model, year, loadType, type: "Truck", details }];
      localStorage.setItem("TruckList", JSON.stringify(updatedList)); 
      return updatedList;
    });
  
    setBrand("");
    setModel("");
    setYear("");
    setLoadType("");
    setAllModels(allModels);
  };
  

  const deleteCar = (brand, model) => {
    setCarList((prevCarList) => {
      const updatedList = prevCarList.filter((car) => !(car.brand === brand && car.model === model));
      localStorage.setItem("CarList", JSON.stringify(updatedList)); 
      console.log("Updated CarList after delete:", updatedList);
      return updatedList;
    });
  };
  
  const deleteTruck = (brand, model) => {
    setTruckList((prevTruckList) => {
      const updatedList = prevTruckList.filter((truck) => !(truck.brand === brand && truck.model === model));
      localStorage.setItem("TruckList", JSON.stringify(updatedList));
      console.log("Updated TruckList after delete:", updatedList);
      return updatedList;
    });
  };
  

  return (
    <div className="container">
      <h1>Vehicle Inventory</h1>

      <div className="form-container">
        <h2>Add a Car</h2>
        <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <button onClick={addCar}>Add Car</button>
      </div>

      <div className="form-container">
        <h2>Add a Truck</h2>
        <input type="text" placeholder="Load Type" value={loadType} onChange={(e) => setLoadType(e.target.value)} />
        <button onClick={addTruck}>Add Truck</button>
      </div>

      <h2>Car Inventory</h2>
      <div className="inventory-list">
        {carList.length === 0 ? <p>No cars have been added.</p> : (
          <ul>
            {carList.map((car, index) => (
              <li key={index}>
                <strong>Maker:</strong> {car.brand} <br/>
                <strong>Model:</strong> {car.model} <br/>
                <strong>Year:</strong> {car.year} <br/>
                <strong>Details:</strong> {car.details} <br/>
                <button class="button delete-btn" onClick={() => deleteCar(car.brand, car.model)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Truck Inventory</h2>
      <div className="inventory-list">
        {truckList.length === 0 ? <p>No trucks have been added.</p> : (
          <ul>
            {truckList.map((truck, index) => (
              <li key={index}>
                <strong>Maker:</strong> {truck.brand} <br />
                <strong>Model:</strong> {truck.model} <br />
                <strong>Year:</strong> {truck.year} <br />
                <strong>Load Type:</strong> {truck.loadType} <br />
                <strong>Details:</strong> {truck.details} <br />
                <button class="button delete-btn" onClick={() => deleteTruck(truck.brand, truck.model)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Models for Added Car</h2>
      <div id="allModels">
        <ul>
          {allModels.map((m, index) => (
            <li key={index}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
