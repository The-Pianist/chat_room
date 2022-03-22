import React from 'react'
import Room from './Room'
import {Link } from "react-router-dom";

const RoomList = ({ rooms }) => {
    return (
        <div>
            {rooms && rooms.map(room => (
            <Link key={room._id} to={"/chat/"+room._id+"/"+room.name}>
            <Room name={room.name} />
            </Link>
            ))}
        </div>
    )
}

export default RoomList