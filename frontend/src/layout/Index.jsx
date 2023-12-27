import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
    const [outletMargin, setOutletMargin] = useState('0');
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const backgroundColor = location.pathname === '/panel' ? '#093545' : 'white';
    return (
        <div style={{ overflowX: 'hidden' }}>
            <Row>
                <Col>
                    <Header />
                </Col>
            </Row>
            <Row style={{ background: backgroundColor }}>
                <Col xs={2}>
                    <Sidebar setOutletMargin={setOutletMargin} />
                </Col>
                <Col xs={10} >
                    <div
                        className='mb-5 mt-5 align-items-center'
                        style={{
                            minHeight: '85vh',
                            marginLeft: outletMargin,
                            transition: 'margin-left 0.3s ease',
                        }}
                    >
                        <Outlet />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
