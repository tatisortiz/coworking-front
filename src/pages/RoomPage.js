import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse, ListGroup } from 'react-bootstrap';
import RoomModal from '../components/RoomModal';
import decodeJWT from '../utils/JWTDecode';

const RoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [history, setHistory] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState({});
    const [inside, setInside] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const payload = decodeJWT(token);
                const responseRooms = await axios.get(`${process.env.REACT_APP_API_URL}/rooms/get-rooms`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseCurrentRoom = await axios.get(`${process.env.REACT_APP_API_URL}/persons/${payload.id}/current-access`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseHistory = await axios.get(`${process.env.REACT_APP_API_URL}/persons/${payload.id}/access-history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setInside(!!responseCurrentRoom.data?.Room.id);
                const rooms = responseRooms.data.map(item => {
                    return { ...item, inside: responseCurrentRoom.data?.Room.id === item.id}
                });

                setRooms(rooms);
                setHistory(responseHistory.data)
            } catch (err) {
                console.log(err)
                setError('Error fetching rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const toggleCollapse = (id) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [id]: !prevOpen[id],
        }));
    };

    const getAssistants = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms/${id}/current-status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAssistants(response.data.personsPresent)
        } catch (err) {
            console.log(err);
        } finally {
            setOpenModal(true);
        }
    };

    const assist = async(id) => {
        try {
            const token = localStorage.getItem('token');
            const payload = decodeJWT(token);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/accesses/entry`, { roomId: id, personId: payload.id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.personsPresent)
            setAssistants(response.data.personsPresent)
        } catch (err) {
            console.log(err);
        } finally {
            window.location.reload();
        }
    };

    const exit = async(id) => {
        try {
            const token = localStorage.getItem('token');
            const payload = decodeJWT(token);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/accesses/exit`, { roomId: id, personId: payload.id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.personsPresent)
            setAssistants(response.data.personsPresent)
        } catch (err) {
            console.log(err);
        } finally {
            window.location.reload();
        }
    };

    const handleClose = () => setOpenModal(false);

    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'America/Los_Angeles' // Zona horaria
      };

    const formatDate = (date) => {
        const fecha = new Date(date);
        const formateador = new Intl.DateTimeFormat('es-ES', opciones);
        return formateador.format(fecha);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-5">
            <RoomModal open={openModal} assistants={assistants} handleClose={handleClose} />
            <h1>Lista de salas</h1>
            {rooms.map(room => (
                <div key={room.id}>
                    <div className="card mb-3">
                        <div className={`card-header ${room.inside && 'bg-success'}`}>
                            <h5 className="mb-0">
                                <button
                                    className={`btn btn-link ${room.inside && 'text-white'}`}
                                    onClick={() => toggleCollapse(room.id)}
                                >
                                    {room.roomName} (Capacidad: {room.capacity})
                                </button>
                            </h5>
                        </div>
                        <Collapse in={open[room.id]}>
                            <div className="card-body">
                                <p>Detalles de la sala {room.roomName}</p>
                                <p>Tipo: {room.roomType}</p>
                                {!inside &&
                                    <button className="btn btn-primary" onClick={() => assist(room.id)}>Asistir</button>
                                }
                                {room.inside &&
                                    <button className="btn btn-danger" onClick={() => exit(room.id)}>Salir</button>
                                }
                                <button className="btn btn-success ms-2" onClick={() => getAssistants(room.id)}>Ver asistentes</button>
                            </div>
                        </Collapse>
                    </div>
                </div>
            ))}
            <h1>Historial</h1>
            <ListGroup>
                {history.map((item, index) => (
                    <ListGroup.Item key={index}>
                    {item.Room.roomName} ({formatDate(item.entryTime)} / {formatDate(item.exitTime)})
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default RoomPage;