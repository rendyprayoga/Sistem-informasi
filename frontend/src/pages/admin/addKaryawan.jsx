import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap"
import { addUsers, getJabatan } from "../../store/action";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function KaryawanAdd() {
    const dispatch = useDispatch()
    const jabatan = useSelector((state) => state.store.jabatan)
    const message = useSelector((state) => state.store.message)
    const [data, setData] = useState({
        name: "",
        username: '',
        jatah_cuti: '',
        nik: '' ,
        nohp: "" ,
        jk_pegawai: "" ,
        tgl_lahir: "" ,
        status: "" ,
        role: "" ,
        jabatan_id: '',
        password: '',
        total_work_id: 1,
        avatar: 'default.png'
    });
    useEffect(() => {
        dispatch(getJabatan())  
    }, [])
    const navigate = useNavigate()
    return (
        <Row className="justify-content-center">
            <Col lg={11} xs={9}>
                <Card>
                    <Card.Body>
                        {message ? 
                            <Alert variant="danger" className="text-center">{message.data}</Alert>
                            : null}
                        <Form action="#" onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addUsers(data, navigate));
                        }}>
                            <h3 className="mb-3">Tambah data</h3>
                            <Row>
                                <Col>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" required id='name' placeholder="Username" onChange={(e) => {
                                        setData({ ...data, username: e.target.value });
                                    }} />
                                    <Form.Label>Nama Lengkap</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" required placeholder="Nama Lengkap" onChange={(e) => {
                                        setData({ ...data, name: e.target.value });
                                    }} />
                                    <Form.Label>NIK</Form.Label>
                                    <Form.Control type="number" className="form-control w-50 mb-4" required placeholder="NIK" onChange={(e) => {
                                        setData({ ...data, nik: e.target.value });
                                    }} />
                                    <Form.Label>Jenis Kelamin</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="form-control w-50 mb-4"
                                        required={data.jk_pegawai === ""}
                                        onChange={(e) => {
                                            setData({ ...data, jk_pegawai: e.target.value });
                                        }}
                                    >
                                        <option value="">
                                    Pilih jenis kelamin
                                        </option>
                                        <option key="1" value="Laki-laki">Laki-laki</option>
                                        <option key="2" value="Perempuan">Perempuan</option>
                                    </Form.Control>
                                    <Form.Label>Jabatan</Form.Label>
                                    <Form.Control as="select" className="form-control w-50 mb-4" required={data.jabatan_id === ""} onChange={(e) => {
                                        setData({ ...data, jabatan_id: e.target.value });
                                    }}>
                                        <option value="" disabled>pilih jabatan</option>
                                        {jabatan?.jabatan_list?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Label>Jatah Cuti</Form.Label>
                                    <Form.Control type="number" className="form-control w-50 mb-4" required placeholder="Jatah Cuti" onChange={(e) => {
                                        setData({ ...data, jatah_cuti: e.target.value });
                                    }} />
                                </Col>
                                <Col>
                                    <Form.Label>No HP</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4"  required placeholder="0899123321" onChange={(e) => {
                                        setData({ ...data, nohp: e.target.value });
                                    }} />
                                    <Form.Label>Tanggal Lahir</Form.Label>
                                    <Form.Control type="date" className="form-control w-50 mb-4"  required onChange={(e) => {
                                        setData({ ...data, tgl_lahir: e.target.value });
                                    }} />
                                    <Form.Label>Status Pernikahan</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" required placeholder="lajang" onChange={(e) => {
                                        setData({ ...data, status: e.target.value });
                                    }} />
                                    <Form.Label>Hak Akses</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="form-control w-50 mb-4"
                                        required={data.role === ""}
                                        onChange={(e) => {
                                            setData({ ...data, role: e.target.value });
                                        }}
                                    >
                                        <option value="" disabled>
                                    Pilih Hak Akses
                                        </option>
                                        <option key="3" value="admin">Admin</option>
                                        <option key="4" value="user">User</option>
                                    </Form.Control>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" className="form-control w-50 mb-4" required placeholder="Password" autoComplete="password" onChange={(e) => {
                                        setData({ ...data, password: e.target.value });
                                    }} />
                                    <div className="text-end">
                                        <Button className="px-5 mx-5" variant="info" onClick={() => navigate('/panel/users')}>Kembali</Button>
                                        <Button className="px-5" type="submit">Simpan Data</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                           
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}