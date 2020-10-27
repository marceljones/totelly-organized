/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from "react";
import { ConnectionContext } from "./ConnectionProvider";
import { UserContext } from "../user/UserProvider";
import { Button, Card } from 'semantic-ui-react';
import Notifications, {notify} from 'react-notify-toast';

export const ConnectionRequest = () => {
    const {
        connections,
        getConnection,
        deleteConnection,
        updateConnection,
        searchTerms,
        addConnection
    } = useContext(ConnectionContext);
    const { Users, getUsers } = useContext(UserContext);
    const [filteredFriendUsers, setFriendUsers] = useState([])
    
    //delete two-way friendship from database
    const removeConnection = (UserToDelete) => {
        const currentUser = parseInt(localStorage.user)
        connections.map((connection) => {
            if (connection.userId === UserToDelete && connection.connectedUserId === currentUser) {
                console.log("deleteing user id: ", UserToDelete, "ConnectionId: ", connection.id)
                deleteConnection(connection.id)
            } else if (connection.connectedUserId === UserToDelete && connection.userId === currentUser) {
                console.log("deleteing connectedUser id: ", UserToDelete, "ConnectionId: ", connection.id)
                deleteConnection(connection.id)
            } else {
                console.log("nothing to delete?")
            }
        })
    }

    const approveConnection = (UserToapprove) => {
        const currentUser = parseInt(localStorage.user)
        connections.map((connection) => {
            if (connection.connectedUserId === UserToapprove && connection.userId === currentUser) {
                console.log("approveing connectedUser id: ", UserToapprove, "ConnectionId: ", connection.id)
                updateConnection({
                    id: connection.id,
                    userId: currentUser,
                    connectedUserId: UserToapprove,
                    status: true,
                    dateConnected: 1601409045668
                })
                addConnection({
                    userId: UserToapprove,
                    connectedUserId: currentUser,
                    status: true,
                    dateConnected: 1601409045668
                })
            } else if (connection.userId === UserToapprove && connection.connectedUserId === currentUser) {
                console.log("approveing connectedUser id: ", UserToapprove, "ConnectionId: ", connection.id)
                updateConnection({
                    id: connection.id,
                    userId: UserToapprove,
                    connectedUserId: currentUser,
                    status: true,
                    dateConnected: 1601409045668
                })
                addConnection({
                    userId: currentUser,
                    connectedUserId: UserToapprove,
                    status: true,
                    dateConnected: 1601409045668
                })
            } else {
                console.log("nothing to approve?")
            }
        })
    }


    //get friends and users from database when searchTerms or friend status changes
    useEffect(() => {
        getConnection().then(getUsers);
    }, [])

    let myColor = { background: '#2b7a78', text: "#FFFFFF" };
    let myRejectColor = { background: '#1e0001', text: "#FFFFFF" };
    //get friends and users from database on page load
    useEffect(() => {
        const currentUser = parseInt(localStorage.user);
        //get the current users connections
        const friendsOfUser = connections.filter(
            (connection) => connection.userId === currentUser && connection.status === false
        );
        // get an array of the current users connected user id's 
        const connectionId = friendsOfUser.map((friend) => friend.connectedUserId)

        //get the user objects for the current users connected users
        const friendInformation = Users.filter(
            (user) => connectionId.includes(user.id) && user.id !== currentUser
            );
        
            setFriendUsers(friendInformation)
            console.log("friend info: ", friendInformation)

        }, [connections, Users, searchTerms])

    return (
        <>
        <Card.Group>
                    {filteredFriendUsers.map((user) => {
                        return (
                            <>
                            <Card key={user.id}>
                                <Card.Content>
                                    <Card.Header>{user.firstName} {user.lastName}</Card.Header>
                                    <Card.Meta>Requested To Connect</Card.Meta>
                                    <Card.Description>
                                        
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra >
                                    <div className='ui two buttons'>
                                    <Button user={user} basic color='green' onClick={(e) => {
                                            e.preventDefault();
                                            approveConnection(user.id);
                                            notify.show('You are now connected!', "custom", 5000, myColor)
                                        }}>
                                        Approve
                                    </Button>
                                    <Button user={user} basic color='red' onClick={(e) => {
                                            e.preventDefault();
                                            removeConnection(user.id);
                                            notify.show('Request Deleted!', "custom", 5000, myRejectColor)
                                        }}>
                                        Decline
                                    </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                            </>
                        )
                    })}
                    </Card.Group>
                    <Notifications />
        </>
    )
}