import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, editProfil } from "../store/saga/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Profil() {
    const data = useSelector((state) => state.store.info)
    const edit = useSelector((state) => state.store.edit)
    const dispatch = useDispatch()
    const [button, setButton] = useState(true)
    const [show, setShow] = useState(false)
    const [isAndroid, setIsAndroid] = useState(window.innerWidth <= 991);

    useEffect(() => {
        const handleResize = () => {
            setIsAndroid(window.innerWidth <= 991);
        };
        if (edit && edit.message) {
            setShow(true);
            setTimeout(() => {
                dispatch(deleteMessage());
            }, 3000);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [edit]);

    const [profil, setProfil] = useState({
        name: data.name || '',
        password: data.password || '',
        nohp: data.nohp || '',
        nik: data.nik || '',
        status: data.status || '',
        tgl_lahir: data.tgl_lahir || '',
        jk_pegawai: data.jk_pegawai || '',
        jabatan: data.jabatan || '',
        jatah_cuti: data.jatah_cuti || '',
        total_work_id: 1,
    })

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setProfil({ ...profil, avatar: selectedFile });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in profil) {
            formData.append(key, profil[key]);
        }
        dispatch(editProfil(formData));
    };

    return (
        <Row>
            <Row>
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
                                    {edit?.message}
                                </strong>
                            </Toast.Header>
                        </Toast>
                    </ToastContainer>
                )
                }
                <Col style={{
                    zIndex: 1, backgroundColor: "#093545",
                    width: '100%',
                    top: '55px',
                    height: "50%",
                    position: "absolute",
                    right: '0',
                }} />
            </Row>
            <Row>
                <Col style={{ zIndex: 4 }} className="text-white mb-5">
                    <h2 className="text-capitalize">Halo, {data.name}!</h2>
                    <span className="text-capitalize">silahkan perbarui data anda jika diperlukan</span>
                </Col>
            </Row>
            <Row>
                <Col lg={8} xs={12} style={{ zIndex: 4 }}>
                    <Card className="shadow-lg">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h3 className="mb-4">Edit Profil</h3>
                                <Row>
                                    <Col lg={6} xs={12}>
                                        <Form.Group>
                                            <Form.Label>Nama Lengkap</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nama Lengkap Anda"
                                                autoComplete="nama"
                                                className="mb-3"
                                                defaultValue={data.name}
                                                onChange={(e) => setProfil({ ...profil, name: e.target.value })}
                                                disabled={button}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password Anda"
                                                autoComplete="password"
                                                className="mb-3"
                                                defaultValue={data.password}
                                                onChange={(e) => setProfil({ ...profil, password: e.target.value })}
                                                required
                                                disabled={button}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Nomor Hp</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nomor Hp Anda"
                                                autoComplete="nomor hp"
                                                className="mb-3"
                                                defaultValue={data.nohp}
                                                onChange={(e) => setProfil({ ...profil, nohp: e.target.value })}
                                                required
                                                disabled={button}
                                            />
                                        </Form.Group>
                                        {button ? null :
                                            <Form.Group>
                                                <Form.Label>Foto Profil</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    className="mb-3"
                                                    accept=".png"
                                                    onChange={handleFileChange}
                                                    disabled={button}
                                                />
                                            </Form.Group>
                                        }
                                    </Col>
                                    <Col lg={6} xs={12}>
                                        <Form.Group>
                                            <Form.Label>NIK</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="NIK Anda"
                                                autoComplete="nik"
                                                className="mb-3"
                                                defaultValue={data.nik}
                                                onChange={(e) => setProfil({ ...profil, nik: e.target.value })}
                                                required
                                                disabled={button}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Status Pernikahan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Status Pernikahan Anda"
                                                autoComplete="status"
                                                className="mb-3"
                                                defaultValue={data.status}
                                                onChange={(e) => setProfil({ ...profil, status: e.target.value })}
                                                required
                                                disabled={button}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Tanggal Lahir</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Tanggal Lahir Anda"
                                                autoComplete="tanggal-lahir"
                                                className="mb-5"
                                                defaultValue={data.tgl_lahir}
                                                onChange={(e) => setProfil({ ...profil, tgl_lahir: e.target.value })}
                                                required
                                                disabled={button}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            {button ?
                                                <Button
                                                    className="mb-3 w-100"
                                                    variant="primary"
                                                    onClick={() => setButton(false)}
                                                >
                                                    Edit Data
                                                </Button>
                                                :
                                                <div className="text-center">
                                                    <Button
                                                        className="mb-3 px-5 me-2 "
                                                        variant="danger"
                                                        type="reset"
                                                        onClick={() => setButton(true)}
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        className="mb-3 px-3"
                                                        variant="primary"
                                                        type="submit"
                                                    >
                                                        Simpan Data
                                                    </Button>
                                                </div>
                                            }
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} xs={12} className="order-first order-lg-last mb-5" style={{ marginTop: '100px', }}>
                    <Card style={{ position: 'relative', zIndex: 4 }}>
                        <div style={{ textAlign: 'center', position: 'absolute', top: '-20%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
                            <img
                                src={data.avatar}
                                className="mt-5 mb-5"
                                style={{ width: `${isAndroid ? '130px' : '100%'}`, objectFit: 'cover', borderRadius: '10px' }}
                            />
                        </div>
                        <Card.Body className="text-center text-capitalize mt-5" style={{ position: 'relative' }}>
                            <h2>{data.name}</h2>
                            {data.jabatan}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Row >
    )
}