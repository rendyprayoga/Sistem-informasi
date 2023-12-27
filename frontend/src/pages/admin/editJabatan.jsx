import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { editJabatan } from "../../store/action";
import { useState } from "react";

function EditJabatan({ data, onEditDone }) {
    const dispatch = useDispatch()
    const [edit, setEdit] = useState({
        name: '',
        salary_in_months: "",
    });

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
                            dispatch(editJabatan(data.id, edit));
                            handleEditDone()
                        }}>
                            <h3 className="mb-3">Edit data</h3>
                            <Form.Label>Nama Posisi</Form.Label>
                            <Form.Control type="text" className="form-control w-50 mb-4" defaultValue={data.name} required id='name' placeholder="Nama Posisi" onChange={(e) => {
                                setEdit({ ...data, name: e.target.value });
                            }} />
                            <Form.Label>Gaji Dalam Sebulan</Form.Label>
                            <Form.Control type="number" className="form-control w-50 mb-4" defaultValue={data.salary_in_months} required placeholder="1000000" onChange={(e) => {
                                setEdit({ ...data, salary_in_months: e.target.value });
                            }} />
                            <div className="text-end">
                                <Button className="px-5 mx-5" variant="info" onClick={() => handleEditDone()}>Kembali</Button>
                                <Button className="px-5" type="submit">Simpan Data</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default EditJabatan;
