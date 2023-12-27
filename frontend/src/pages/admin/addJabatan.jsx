import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { addJabatan } from "../../store/action";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function JabatanAdd() {
    const dispatch = useDispatch()
    const [data, setData] = useState({
        name: "",
        salary_in_months: "",
    });
    const navigate = useNavigate()
    return (
        <Row className="justify-content-center">
            <Col lg={11} xs={9}>
                <Card>
                    <Card.Body>
                        <Form action="#" onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addJabatan(data, navigate));
                        }}>
                            <h3 className="mb-4">Tambah data</h3>
                            <Form.Label>Nama Posisi</Form.Label>
                            <Form.Control type="text" className="form-control w-50 mb-4" required id='name' placeholder="Nama Posisi" onChange={(e) => {
                                setData({ ...data, name: e.target.value });
                            }} />
                            <Form.Label>Gaji Dalam Sebulan</Form.Label>
                            <Form.Control type="number" className="form-control w-50 mb-4" required placeholder="1000000" onChange={(e) => {
                                setData({ ...data, salary_in_months: e.target.value });
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