import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addPresenceIn, addPresenceOut, getPresenceCount, getPresenceCountToday, getPresenceCountUser, getUserCount, setTimereq } from "../store/action";

export default function Dashboard() {
    const data = useSelector((state) => state.store.info)
    const countUser = useSelector((state) => state.store.user_count)
    const countPresenceToday = useSelector((state) => state.store.presence_count_today)
    const countPresence = useSelector((state) => state.store.presence_count)
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState('');
    const dispatch = useDispatch()
    
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = `${getDayOfWeek(now)}, ${now.getDate()} ${getMonthName(now)} ${now.getFullYear()}`;
            setDate(formattedDate);
            setTime(now.toLocaleTimeString());
            dispatch(setTimereq());
        };
        const interval = setInterval(updateDateTime, 1000);
        updateDateTime();
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (data.role === 'admin') {
            dispatch(getUserCount())
            dispatch(getPresenceCount())
            dispatch(getPresenceCountToday())
        }
        if(data.role === 'user'){
            dispatch(getPresenceCountUser())
        }
    }, [data.role])

    const isWithinTimeRange = () => {
        const startTime = "4:00:00 AM";
        const endTime = "7:30:00 AM";
        return time <= startTime || time >= endTime;
    };

    const getDayOfWeek = (date) => {
        const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return daysOfWeek[date.getDay()];
    };

    const getMonthName = (date) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[date.getMonth()];
    };

    const getTimeColor = () => {
        return isWithinTimeRange() ? 'danger' : 'success';
    };

    const [dateTime] = useState(new Date());
    const padZero = (value) => {
        return value.toString().padStart(2, '0');
    };

    const getFormattedDateTime = (date) => {
        const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
        const formattedTime = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
        return `${formattedDate} ${formattedTime}`;
    };


    return (
        <Row style={{ background: '#093545' }}>
            <Row>
                <Row className="text-white mb-4">
                    <Col xs={12} md={8}>
                        <h2 className="text-capitalize">Halo, {data.name}!</h2>
                        {/* <p>{getFormattedDateTime(dateTime)}</p> */}
                    </Col>
                    <Col xs={12} md={4} className="text-end mt-2">
                        <h2 className={`text-start text-md-end text-${getTimeColor()}`}>{time}</h2>
                        <h5 className="text-start text-md-end">{date}</h5>
                    </Col>
                </Row>
                {data.role === 'admin' ?
                    <Row>
                        <Col lg={6} xs={12} className="mb-5">
                            <Card >
                                <Card.Body>
                                    Total Absen
                                    <div className="form-control text-white mb-3 mt-4 p-3 d-flex justify-content-between align-items-center" style={{ background: '#105c77' }}>
                                        <div>
                                        Tepat Waktu
                                        </div>
                                        <h5 className="text-end">
                                            {countPresence.presence_accepted_count}
                                        </h5>
                                    </div>
                                    {/* <div className="form-control text-white mb-3  p-3 d-flex justify-content-between align-items-center" style={{ background: '#105c77' }}>
                                        <div>
                                        Terlambat
                                        </div>
                                        <h5 className="text-end">
                                            {countPresence.presence_late_count}
                                        </h5>
                                    </div> */}
                                    <div className="form-control text-white mb-3 p-3 d-flex justify-content-between align-items-center" style={{ background: '#105c77' }}>
                                        <div>
                                            Ditolak
                                        </div>
                                        <h5 className="text-end">
                                            {countPresence.presence_rejected_count}
                                        </h5>
                                    </div>
                                    <div className="form-control text-white p-3 d-flex justify-content-between align-items-center" style={{ background: '#105c77' }}>
                                        <div>
                                            Cuti
                                        </div>
                                        <h5 className="text-end">
                                            {countPresence.leave_accepted_count}
                                        </h5>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6} xs={12}>
                            <Card style={{ background: '#105c77' }}>
                                <Card.Body>
                                    <span className="text-white text-capitalize">data hari ini</span>
                                    <div className="form-control mb-3 mt-4 p-3 text-capitalize d-flex justify-content-between align-items-center">
                                        <div>
                                            <FontAwesomeIcon icon="fa-solid fa-users" style={{ color: "#2073fe" }} />
                                            <span className="mx-2">
                                                Jumlah karyawan absen
                                            </span>
                                        </div>
                                        <h4 className="text-end">
                                            {countUser.today_users_count}
                                        </h4>
                                    </div>
                                    <div className="form-control mb-3 p-3 text-capitalize d-flex justify-content-between align-items-center">
                                        <div>
                                            <FontAwesomeIcon icon="fa-solid fa-users" style={{ color: "#24e220", }} />
                                            <span className="mx-2">
                                            karyawan hadir
                                            </span>
                                        </div>
                                        <h4 className="text-end">
                                            {countPresenceToday.presence_accepted_count}
                                        </h4>
                                    </div>
                                    {/* <div className="form-control mb-3  p-3 text-capitalize d-flex justify-content-between align-items-center">
                                        <div>
                                            <FontAwesomeIcon icon="fa-solid fa-users" style={{ color: "#ff2c2c", }} />
                                            <span className="mx-2">
                                            karyawan telat
                                            </span>
                                        </div>
                                        <h4 className="text-end">
                                            {countPresenceToday.presence_late_count}
                                        </h4>
                                    </div> */}
                                    <div className="form-control mb-3  p-3 text-capitalize d-flex justify-content-between align-items-center">
                                        <div>
                                            <FontAwesomeIcon icon="fa-solid fa-users" style={{ color: "#ff8a00", }} />
                                            <span className="mx-2">
                                            karyawan cuti
                                            </span>
                                        </div>
                                        <h4 className="text-end">
                                            {countPresenceToday.leave_accepted_count}
                                        </h4>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col lg={6} xs={12} className="mb-5">
                            <Card >
                                <Card.Body>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', textAlign: 'left' }}>
                                        <div>
                                            Total Absen
                                        </div>
                                        <div>
                                            <span className="form-control text-white mb-3 mt-4 p-3" style={{ background: '#105c77' }}>
                                                Tepat Waktu
                                                <span style={{ float: 'right' }}>{countPresence.total_presence}</span>
                                            </span>
                                            <span className="form-control text-white p-3" style={{ background: '#105c77' }}>
                                                Cuti
                                                <span style={{ float: 'right' }}>{countPresence.total_cuti}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6} xs={12} className="mb-5">
                            <Card style={{ background: '#105c77' }}>
                                <Card.Body>
                                    <span className="text-white">Pintasan</span>
                                    <div>
                                        <Button variant="light" className="form-control mt-4 mb-3" disabled={isWithinTimeRange()} onClick={() => dispatch(addPresenceIn(getFormattedDateTime(dateTime)))}>Absen Masuk</Button>
                                    </div>
                                    <div>
                                        <Button variant="light" className="form-control mb-3" disabled={isWithinTimeRange()} onClick={() => dispatch(addPresenceOut(getFormattedDateTime(dateTime)))}>Absen Keluar</Button>
                                    </div>
                                    <div>
                                        <Button variant="light" className="form-control mb-3">Pengajuan Cuti</Button>
                                    </div>
                                    <div>
                                        <Button variant="light" className="form-control">Lihat Gaji</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                }
            </Row>
        </Row>
    )
}