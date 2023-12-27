import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editUsers, getJabatan } from "../../store/action";
import { useEffect, useState } from "react";

function EditKaryawan({ data, onEditDone }) {
    const dispatch = useDispatch()
    const jabatan = useSelector((state) => state.store.jabatan)
    const [edit, setEdit] = useState({
        name: "" || data.name,
        jatah_cuti: '' || data.jatah_cuti,
        nik: '' || data.nik,
        nohp: "" || data.nohp,
        jk_pegawai: "" || data.jk_pegawai,
        tgl_lahir: "" || data.tgl_lahir,
        status: "" || data.status,
        role: "" || data.role,
        jabatan_id: '' || data.jabatan_id,
        total_work_id: data.total_work_id,
    });
    useEffect(() => {
        dispatch(getJabatan())  
    }, [])

    const handleEditDone = () => {
        onEditDone();
    };

    return (
        <Row className="justify-content-center">
            <Col lg={11} xs={9}>
                <Card>
                    <Card.Body>
                        <Form action="#" onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(editUsers(data.id, edit));
                            handleEditDone()
                        }}>
                            <h3 className="mb-3">Edit data</h3>
                            <Row>
                                <Col>
                                    <Form.Label>Nama Lengkap</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" defaultValue={data.name} required id='name' placeholder="Nama Lengkap" onChange={(e) => {
                                        setEdit({ ...data, name: e.target.value });
                                    }} />
                                    <Form.Label>NIK</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" defaultValue={data.nik} required placeholder="nik" onChange={(e) => {
                                        setEdit({ ...data, nik: e.target.value });
                                    }} />
                                    <Form.Label>Jenis Kelamin</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="form-control w-50 mb-4"
                                        defaultValue={data.jk_pegawai}
                                        required={data.jk_pegawai === ''}
                                        onChange={(e) => {
                                            setEdit({ ...data, jk_pegawai: e.target.value });
                                        }}
                                    >
                                        <option value="">
                                            {data.jk_pegawai}
                                        </option>
                                        <option key="1" value="Laki-laki">Laki-laki</option>
                                        <option key="2" value="Perempuan">Perempuan</option>
                                    </Form.Control>
                                    <Form.Label>Jabatan</Form.Label>
                                    <Form.Control as="select" className="form-control w-50 mb-4" value={data.jabatan} required={data.jabatan_id === ''} onChange={(e) => {
                                        setEdit({ ...data, jabatan_id: e.target.value });
                                    }}>
                                        <option value="">pilih jabatan</option>
                                        {jabatan?.jabatan_list?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Label>No HP</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" defaultValue={data.nohp} required placeholder="1000000" onChange={(e) => {
                                        setEdit({ ...data, nohp: e.target.value });
                                    }} />
                                    <Form.Label>Tanggal Lahir</Form.Label>
                                    <Form.Control type="date" className="form-control w-50 mb-4" defaultValue={data.tgl_lahir} required placeholder="1000000" onChange={(e) => {
                                        setEdit({ ...data, tgl_lahir: e.target.value });
                                    }} />
                                    <Form.Label>Status Pernikahan</Form.Label>
                                    <Form.Control type="text" className="form-control w-50 mb-4" defaultValue={data.status} required placeholder="1000000" onChange={(e) => {
                                        setEdit({ ...data, status: e.target.value });
                                    }} />
                                    <div className="text-end">
                                        <Button className="px-5 mx-5" variant="info" onClick={() => handleEditDone()}>Kembali</Button>
                                        <Button className="px-5" type="submit">Simpan Data</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default EditKaryawan;
