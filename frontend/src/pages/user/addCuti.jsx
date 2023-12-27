import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { addLeave } from "../../store/action";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function CutiAdd() {
    const dispatch = useDispatch()
    const [data, setData] = useState({
        awal_str: "",
        akhir_str: "",
        status: "diproses",
        desc: "",
    });
    const navigate = useNavigate()
    return (
        <Row className="justify-content-center">
            <Col lg={11} xs={9}>
                <Card>
                    <Card.Body>
                        <Form action="#" onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addLeave(data, navigate));
                        }}>
                            <h3 className="mb-4">Tambah data</h3>
                            <Form.Label>Tanggal Awal</Form.Label>
                            <Form.Control type="date" className="form-control w-50 mb-4" required onChange={(e) => {
                                setData({ ...data, awal_str: e.target.value });
                            }} />
                            <Form.Label>Tanggal Akhir</Form.Label>
                            <Form.Control type="date" className="form-control w-50 mb-4" required onChange={(e) => {
                                setData({ ...data, akhir_str: e.target.value });
                            }} />
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control type="text" className="form-control w-50 mb-4" required onChange={(e) => {
                                setData({ ...data, desc: e.target.value });
                            }} />
                            <div className="text-end">
                                <Button className="px-5 mx-5" variant="info" onClick={() => navigate('/panel/jabatan')}>Kembali</Button>
                                <Button className="px-5" type="submit">Simpan Data</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}