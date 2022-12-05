
import React, {useState, useEffect} from "react";
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCar from "./AddCar";
import EditCar from "./EditCar";


export default function Carlist(){

const [cars, setCars] = useState([])
const [columnDefs] = useState([
    {field:'brand'},
    {field:'model'},
    {field:'color'},
    {field:'fuel'},
    {field:'year'},
    {field:'price'},
    { width:120,
    cellRenderer: params => <EditCar data={params.data} updateCar={updateCar}/>
    },
    {headerName:'', field:'_links.self.href' , cellRenderer:params => <Button color='error' size='small'
    onClick={()=> deleteCar(params.data)}>Delete</Button>}
])

useEffect(()=> getCars(),[])

const getCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
}

const deleteCar = (id) => {
    if (window.confirm('Are you sure?')) {
        fetch('https://carstockrest.herokuapp.com/cars' + {id}, {method: 'DELETE'})
        .then (response => getCars() )
        .catch(err => console.error(err))
        
      }
    }
const addCar = (car) => {
    fetch('https://carstockrest.herokuapp.com/cars', {method:'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(car) 
})
    .then(response => {
        if(response.ok)
        getCars()    })

}

const updateCar = (car, url) => {
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(car) 
    })
        .then(response => {
            if(response.ok)
            getCars()
            else
            alert('Something went wrong in edit')
        })
        .catch(err=> console.error(err))
}

    return(
      <>

        <AddCar addCar={addCar}/>
        <div className='ag-theme-material' style={{width:'60%', height:500, margin:'auto'}}>
        <AgGridReact
            rowSelection='single'
            rowData={cars}
            columnDefs={columnDefs}
            animateRows={true}>
       </AgGridReact>
    </div>
    </> 
    )
}