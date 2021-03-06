import React, { useState, createContext } from "react"

export const LocationContext = createContext()

export const LocationProvider = (props) => {
    const [Locations, setLocations] = useState([])
    const [searchTerms, setSearchTerms] = useState("")

    const getLocations = () => {
        return fetch(`http://localhost:8088/locations?_expand=user`)
        .then(result => result.json())
        .then(setLocations)
    }

    const addLocation = Location => {
        return fetch("http://localhost:8088/locations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Location)
        })
    }

    const getSharedLocation = (locationId) => {
        return fetch (`http://localhost:8088/sharedLocations?locationId=${locationId}&_expand=user`)
        .then(result => result.json())
    }

    const getLocationByUser = userId => {
        return fetch(`http://localhost:8088/locations?userId=${userId}`)
        .then(result => result.json())
    }

    const getLocationById = (id) => {
        return fetch(`http://localhost:8088/locations/${id}?_expand=user`)
        .then(result => result.json())
    }

    const deleteLocation = LocationId => {
        return fetch(`http://localhost:8088/locations/${LocationId}`, {
            method: "DELETE"
        })
    }

    const shareLocationWithUser = (Location) => {
        return fetch ("http://localhost:8088/sharedLocations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Location)
        })
    }

    const updateLocation = Location => {
        return fetch(`http://localhost:8088/locations/${Location.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Location)
        })
    }

    return (
        <LocationContext.Provider value={{
            Locations, 
            getLocations, 
            addLocation, 
            getLocationById, 
            deleteLocation, 
            updateLocation, 
            setSearchTerms, 
            searchTerms, 
            getLocationByUser, 
            getSharedLocation, 
            shareLocationWithUser
        }}>
            {props.children}
        </LocationContext.Provider>
    )
}