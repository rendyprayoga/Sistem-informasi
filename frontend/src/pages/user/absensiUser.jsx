import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPresenceIn, addPresenceOut, deleteMessage, getPresenceUser } from "../../store/saga/actions"
import { Card, CardBody, Col, Row, Toast, ToastContainer } from "react-bootstrap"
import {
    useTable, useSortBy, useGlobalFilter, usePagination,
} from 'react-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AbsensiUser() {

    const dispatch = useDispatch()
    const absen = useSelector((state) => state.store.presence)
    const message = useSelector((state) => state.store)
    const time = useSelector((state) => state.store.time)
    const [dateTime] = useState(new Date());
    const padZero = (value) => {
        return value.toString().padStart(2, '0');
    };

    const getFormattedDateTime = (date) => {
        const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
        const formattedTime = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const isWithinTimeRange = () => {
        const startTime = "5:00:00 AM";
        const endTime = "7:30:00 AM";
        return time <= startTime || time >= endTime;
    };

    useEffect(() => {
        dispatch(getPresenceUser()) 
    }, [])
    
    useEffect(() => {
        if (message && message.delete?.message || message.add?.message || message.edit?.message) {
            setShow(true);
            setTimeout(() => {
                dispatch(deleteMessage());
            }, 3000);
        }
    }, [message.delete, message.edit, message.add?.message ])
    const columns = useMemo(
        () => [
            {
                Header: 'No',
                accessor: (_, index) => index + 1
            },
            {
                Header: 'Absen Masuk',
                accessor: 'presence_in',
                Cell: ({value}) => (value),
            },
            {
                Header: 'Absen Keluar',
                accessor: 'presence_out',
                Cell: ({value}) => (value),
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: ({value}) => (value),
            },
        ],
        [],
    )

    const data = useMemo(
        () => (absen?.presence_list || []),
        [absen],
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        gotoPage,
        pageCount,
    } = useTable(
        {
            columns,
            data,
            initialState:{
                pageSize:5,
            }
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
    )
    const [show, setShow] = useState(false)
    const { globalFilter } = state

    return (
        <Row style={{ marginRight: '5%' }}>
            {show && (
                <ToastContainer position="top-end" style={{ zIndex: 5, position: 'absolute' }}>
                    <Toast onClose={() => setShow(false)} show={show} delay={3000} style={{ width: '100%', marginTop: '45%', marginLeft: '2%' }} autohide>
                        <Toast.Header style={{ background: '#22bb55' }}>
                            <img
                                src="holder.js/20x20?text=%20"
                                className="rounded me-2"
                                alt=""
                            />
                            <strong className="me-auto p-2 text-white">
                                <FontAwesomeIcon icon="fa-solid fa-check" className="mx-2" />
                                {message.delete?.message || message.add?.message || message.edit?.message}
                            </strong>
                        </Toast.Header>
                    </Toast>
                </ToastContainer>
            )
            }
            <Col className='my-5'>
                <Card className="overflow-hidden p-4 border-0 shadow-lg rounded-4">
                    <CardBody>
                        <Row className="mb-2">
                            <Col >
                                <div className="mb-2 d-inline-block">
                                    <div className="position-relative">
                                        <input type="text" value={globalFilter || ''} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari data absen" className="form-control" style={{ backgroundColor: '#f3f6f9' }} />
                                    </div>
                                </div>
                            </Col>
                            <Col className="text-end">
                                <button className="btn mx-5 btn-success" onClick={() => dispatch(addPresenceIn(getFormattedDateTime(dateTime)))} disabled={isWithinTimeRange()}>Absen Masuk</button>
                                <button className="btn btn-info" onClick={() => dispatch(addPresenceOut(getFormattedDateTime(dateTime)))} disabled={isWithinTimeRange()}>Absen Keluar</button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='table-responsive'>
                                    <table {...getTableProps()} className='table align-middle table-nowrap table-hover'>
                                        <thead className='text-center'>
                                            {headerGroups.map((headerGroup) => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map((column) => {
                                                        const sortIcon = column.isSortedDesc ? "🔼": "🔽";
                                                        return (
                                                            <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{backgroundColor:'#f3f6f9'}}>
                                                                {column.render('Header')}
                                                                <span>{column.isSorted ? sortIcon : ''}</span>
                                                            </th>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </thead>
                                        {page.length === 0 ? (
                                            <tbody >
                                                <tr>
                                                    <td colSpan={headerGroups[0].headers.length} className="text-center">
                                                        {(absen) ? 'Tidak ada data.' : null}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody {...getTableBodyProps()} className='text-center'>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map((cell) => (
                                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                            </Col>
                        </Row>
                        <Row className="align-items-md-center mt-3">
                            <Col>
                                <nav aria-label="Page navigation">
                                    <ul className="pagination pagination-sm justify-content-end mb-2">
                                        {/* First */}
                                        <li className={`page-item ${state.pageIndex === 0 ? 'hide-pagination' : ''}`}>
                                            <a className="page-link" style={{cursor: 'pointer'}} onClick={() => gotoPage(0)} tabIndex="-1">
                                                {'<<'}
                                            </a>
                                        </li>
                                        {/* Previus */}
                                        <li className={`page-item ${state.pageIndex === 0 ? 'hide-pagination' : ''}`}>
                                            <a className="page-link" style={{cursor: 'pointer'}} onClick={() => gotoPage(state.pageIndex - 1)} tabIndex="-1">{'<'}</a>
                                        </li>
                                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((key, index) => (
                                            <li key={key} className={`page-item ${index === state.pageIndex ? 'active' : ''}`}>
                                                <a className="page-link" style={{cursor: 'pointer'}} onClick={() => gotoPage(index)}>{index + 1}</a>
                                            </li>
                                        ))}
                                        {/* Next */}
                                        <li className={`page-item ${state.pageIndex === pageCount - 1 ? 'hide-pagination' : ''}`}>
                                            <a className="page-link" style={{cursor: 'pointer'}} onClick={() => gotoPage(state.pageIndex + 1)}>{'>'}</a>
                                        </li>
                                        {/* Last */}
                                        <li className={`page-item ${state.pageIndex === pageCount - 1 ? 'hide-pagination' : ''}`}>
                                            <a className="page-link" style={{cursor: 'pointer'}} onClick={() => gotoPage(pageCount - 1)}>
                                                {">>"}
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}