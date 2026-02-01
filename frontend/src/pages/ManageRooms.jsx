import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ManageRooms = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLayoutModal, setShowLayoutModal] = useState(false);

    // Data
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomFormData, setRoomFormData] = useState({ name: '', status: 'AVAILABLE' });
    const [layoutData, setLayoutData] = useState({ rows: 10, cols: 10 });
    const [currentSeats, setCurrentSeats] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch rooms error:", error);
            setLoading(false);
        }
    };

    // --- Room CRUD ---
    const handleAddNew = () => {
        setEditingRoom(null);
        setRoomFormData({ name: '', status: 'AVAILABLE' });
        setShowEditModal(true);
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setRoomFormData({ name: room.name, status: room.status || 'AVAILABLE' });
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa phòng này sẽ xóa toàn bộ ghế. Bạn có chắc không?")) {
            try {
                await api.delete(`/rooms/${id}`);
                fetchRooms();
            } catch (error) {
                alert("Xóa thất bại");
            }
        }
    };

    const handleSubmitRoom = async (e) => {
        e.preventDefault();
        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom.room_id}`, roomFormData);
            } else {
                await api.post('/rooms', { ...roomFormData, cinema_id: 1 }); // Default Cinema 1
            }
            setShowEditModal(false);
            fetchRooms();
        } catch (error) {
            alert("Lưu thất bại");
        }
    };

    // --- Layout Editor ---
    const openLayoutEditor = async (room) => {
        setEditingRoom(room);
        try {
            // Fetch seats
            const res = await api.get(`/rooms/${room.room_id}/seats`);
            setCurrentSeats(res.data);
            if (res.data.length > 0) {
                // Try to infer dimensions from last seat
                const lastSeat = res.data[res.data.length - 1];
                setLayoutData({ rows: lastSeat.row_index, cols: lastSeat.column_index });
            } else {
                setLayoutData({ rows: 10, cols: 10 });
            }
            setShowLayoutModal(true);
        } catch (error) {
            console.error("Fetch seats error", error);
        }
    };

    const handleGenerateLayout = async () => {
        if (!window.confirm("Hành động này sẽ XÓA toàn bộ cấu hình ghế hiện tại của phòng này.\nBạn có chắc chắn muốn tiếp tục không?")) return;
        try {
            const res = await api.post(`/rooms/${editingRoom.room_id}/layout`, layoutData);
            alert(`Đã tạo ${res.data.seat_count} ghế thành công!`);
            // Refresh seats
            const seatRes = await api.get(`/rooms/${editingRoom.room_id}/seats`);
            setCurrentSeats(seatRes.data);
            fetchRooms(); // Update seat count in list
        } catch (error) {
            alert("Tạo sơ đồ thất bại");
        }
    };

    const toggleSeatType = async (seat) => {
        try {
            // Cycle: STANDARD -> VIP -> MAINTENANCE -> STANDARD
            let newType = seat.seat_type;
            let newStatus = seat.status || 'AVAILABLE';

            if (seat.status === 'MAINTENANCE') {
                // Maintenance -> Standard
                newStatus = 'AVAILABLE';
                newType = 'STANDARD';
            } else if (seat.seat_type === 'STANDARD') {
                // Standard -> VIP
                newType = 'VIP';
            } else if (seat.seat_type === 'VIP') {
                // VIP -> Maintenance
                newStatus = 'MAINTENANCE';
            }

            // Sync with backend
            await api.put(`/rooms/seats/${seat.seat_id}`, { type: newType, status: newStatus });

            // Update local state
            setCurrentSeats(prev => prev.map(s =>
                s.seat_id === seat.seat_id ? { ...s, seat_type: newType, status: newStatus } : s
            ));
        } catch (error) {
            console.error("Update seat error", error);
        }
    };

    return (
        <div style={{ padding: '20px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/admin')}
                        style={{
                            background: 'none',
                            border: '1px solid #555',
                            color: '#ccc',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        ⬅ Quay lại
                    </button>
                    <h1 style={{ margin: 0 }}>Quản lý Phòng & Ghế</h1>
                </div>
                <button onClick={handleAddNew} className="btn-primary">
                    + Thêm Phòng
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#333', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Tên Phòng</th>
                            <th style={{ padding: '15px' }}>Số Ghế</th>
                            <th style={{ padding: '15px' }}>Trạng Thái</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.room_id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '15px' }}>{room.room_id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{room.name}</td>
                                <td style={{ padding: '15px' }}>{room.seat_count}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        backgroundColor: room.status === 'AVAILABLE' ? '#1b5e20' : '#b71c1c',
                                        fontSize: '0.8rem'
                                    }}>
                                        {room.status === 'AVAILABLE' ? 'Sẵn sàng' : 'Bảo trì'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <button onClick={() => openLayoutEditor(room)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sơ đồ Ghế</button>
                                    <button onClick={() => handleEdit(room)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Sửa Info</button>
                                    <button onClick={() => handleDelete(room.room_id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Edit Room Modal */}
            {showEditModal && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2>{editingRoom ? 'Cập nhật Phòng' : 'Thêm Phòng Mới'}</h2>
                        <form onSubmit={handleSubmitRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                placeholder="Tên phòng (VD: Phòng 1)"
                                value={roomFormData.name}
                                onChange={e => setRoomFormData({ ...roomFormData, name: e.target.value })}
                                style={inputStyle}
                                required
                            />
                            <select
                                value={roomFormData.status}
                                onChange={e => setRoomFormData({ ...roomFormData, status: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="AVAILABLE">Sẵn sàng (Available)</option>
                                <option value="MAINTENANCE">Bảo trì (Maintenance)</option>
                            </select>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">Hủy</button>
                                <button type="submit" className="btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Layout Editor Modal */}
            {showLayoutModal && (
                <div style={modalStyle}>
                    <div style={{ ...modalContentStyle, width: '900px', maxWidth: '95vw' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>Sơ đồ Ghế: {editingRoom?.name}</h2>
                            <button onClick={() => setShowLayoutModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-end' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Hàng</label>
                                <input type="number" value={layoutData.rows} onChange={e => setLayoutData({ ...layoutData, rows: parseInt(e.target.value) })} style={{ ...inputStyle, width: '80px', display: 'block' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Cột</label>
                                <input type="number" value={layoutData.cols} onChange={e => setLayoutData({ ...layoutData, cols: parseInt(e.target.value) })} style={{ ...inputStyle, width: '80px', display: 'block' }} />
                            </div>
                            <button onClick={handleGenerateLayout} style={{ padding: '10px 20px', backgroundColor: '#e65100', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                ⚠️ Tạo lại sơ đồ (Reset)
                            </button>
                        </div>

                        <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#aaa' }}>
                            * Click vào ghế (hoặc click tiếp) để chuyển đổi: <b>Thường</b> &rarr; <b>VIP</b> &rarr; <b>Bảo trì</b> &rarr; <b>Thường</b>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${layoutData.cols}, 40px)`, // Fixed width 40px
                            justifyContent: 'center', // Center grid
                            gap: '10px',
                            maxHeight: '500px',
                            overflow: 'auto',
                            padding: '20px',
                            backgroundColor: '#000',
                            borderRadius: '8px',
                            minHeight: '200px',
                            alignItems: currentSeats.length === 0 ? 'center' : 'start'
                        }}>
                            {currentSeats.length === 0 ? (
                                <div style={{ gridColumn: `1 / span ${layoutData.cols}`, textAlign: 'center', color: '#888' }}>
                                    <p>Chưa có sơ đồ ghế.</p>
                                    <p>Vui lòng nhập số Hàng/Cột ở trên và bấm <b>"Tạo lại sơ đồ"</b> để bắt đầu.</p>
                                </div>
                            ) : (
                                currentSeats.map(seat => {
                                    let bg = '#fff';
                                    let border = '1px solid #ccc';
                                    if (seat.status === 'MAINTENANCE') {
                                        bg = '#333'; // Dark grey for maintenance
                                        border = '1px dashed #555';
                                    } else if (seat.seat_type === 'VIP') {
                                        bg = '#ffd700';
                                        border = '2px solid #ff6f00';
                                    }

                                    return (
                                        <div
                                            key={seat.seat_id}
                                            onClick={() => toggleSeatType(seat)}
                                            title={`${seat.seat_code} - ${seat.status === 'MAINTENANCE' ? 'Bảo trì' : seat.seat_type}`}
                                            style={{
                                                backgroundColor: bg,
                                                color: seat.status === 'MAINTENANCE' ? '#fff' : '#000',
                                                width: '40px', // Fixed size
                                                height: '40px', // Fixed size
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                border: border,
                                                opacity: seat.status === 'MAINTENANCE' ? 0.5 : 1
                                            }}
                                        >
                                            {seat.status === 'MAINTENANCE' ? 'X' : seat.seat_code}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}></div> Thường</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', backgroundColor: '#ffd700', border: '2px solid #ff6f00', borderRadius: '4px' }}></div> VIP</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', backgroundColor: '#333', border: '1px dashed #555', borderRadius: '4px', opacity: 0.5 }}></div> Bảo trì</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: '#222', padding: '30px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
};

const inputStyle = {
    padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px'
};

export default ManageRooms;
