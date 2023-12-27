import { Button, Card, Col, Form, Row, Container, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/styles.css"
import { authInfo, login } from "../../store/action";

export default function Login() {
    const auth = useSelector((state) => state.store)
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const [account, setAccount] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        dispatch(authInfo())
    }, [dispatch])

    useEffect(() => {
        if (auth?.info?.isLogin) {
            navigate("/panel");
        }

    }, [navigate, auth?.info]);

    return (
        <div style={{ background: '#38a8af', minHeight: '100vh', overflowY: 'hidden' }}>
            <div className="my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden p-4 border-0 shadow-lg rounded-4" style={{ background: '#466773' }}>
                                <Card.Body className="p-sm-2">
                                    <div className="text-center">
                                        <h5 className="fs-3xl text-white">
                                            <strong>Selamat Datang di SIMAPEG</strong>
                                        </h5>
                                        <p className="text-white">
                                            Silahkan Login
                                        </p>
                                        <h1 className="mt-5">
                                            <FontAwesomeIcon icon="fa-solid fa-building" bounce size="2xl" style={{ color: "#ffd233", }} />
                                        </h1>
                                    </div>
                                    <div>
                                        {auth?.message ?
                                            <Alert variant="danger" className="text-center">{auth?.message?.data?.description || auth?.message?.response?.data?.description || auth?.message?.message}</Alert>
                                            : null}
                                        <Form action="#" onSubmit={(e) => {
                                            e.preventDefault();
                                            dispatch(login(account, navigate));
                                        }}>
                                            <div className="form-floating mb-3">
                                                <input type="text"
                                                    className="form-control text-white" id="floatingInput" placeholder="Username"
                                                    value={account.username || ''}
                                                    required
                                                    autoComplete="username"
                                                    onChange={(e) => {
                                                        setAccount({ ...account, username: e.target.value });
                                                    }}
                                                    style={{ background: '#466773' }}
                                                />
                                                <label htmlFor="floatingInput" className="text-white">Username</label>
                                            </div>
                                            <div className="input-group mb-3">
                                                <div className="form-floating">
                                                    <input type={showPassword ? "text" : "password"} className="form-control text-white" id="floatingPassword" placeholder="Password"
                                                        value={account.password || ''}
                                                        required
                                                        autoComplete="password"
                                                        onChange={(e) => {
                                                            setAccount({ ...account, password: e.target.value });
                                                        }}
                                                        style={{ background: '#466773' }}
                                                    />
                                                    <label htmlFor="floatingPassword" className="text-white">Password</label>
                                                </div>
                                                <div
                                                    className="input-group-text"
                                                    onClick={handleTogglePassword}
                                                    style={{ background: '#466773' }}

                                                >
                                                    {showPassword ? <FontAwesomeIcon icon="fa-solid fa-lock-open" style={{ color: 'white' }} /> : <FontAwesomeIcon icon="fa-solid fa-lock" style={{ color: 'white' }} />}
                                                </div>
                                            </div>
                                            <div className="pb-4">
                                                <Button
                                                    className="btn custom-button w-100"
                                                    type="submit"
                                                    variant="primary"
                                                    style={{ color: 'white' }}
                                                >
                                                    Masuk
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}