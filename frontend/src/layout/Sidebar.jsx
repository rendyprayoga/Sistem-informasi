import { useEffect, useState } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { useLocation, useNavigate } from "react-router-dom";
import '../assets/styles.css'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/action";
import { Button } from "react-bootstrap";

export default function Sidebar({ setOutletMargin }) {
    const dispatch = useDispatch()
    const data = useSelector((state) => state.store.info)
    const [isVisible, setIsVisible] = useState(false);
    const [fadeClass, setFadeClass] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const currentRoute = location.pathname.replace("/", "");

    const handleToggle = expanded => {
        setIsVisible(expanded);
        const isAndroid = window.innerWidth <= 768;
        if (!isAndroid) {
            setOutletMargin(expanded ? '5%' : '-12%')
        }
    };

    useEffect(() => {
        setFadeClass(isVisible ? "show" : "fade");
    }, [isVisible]);

    useEffect(() => {
        const handleResize = () => {
            const isAndroid = window.innerWidth <= 768;
            if (isAndroid) {
                setIsVisible(false);
                setOutletMargin('5%');
            } else {
                setIsVisible(true)
                setOutletMargin('5%');
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setOutletMargin]);

    return (
        <SideNav
            expanded={isVisible}
            onToggle={handleToggle}
            style={{ position: "fixed", height: "100%" }}
            onSelect={(selected) => {
                const to = "/" + selected;
                navigate(to);
            }}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected={currentRoute}>
                <NavItem eventKey="panel">
                    <NavIcon>
                        <FontAwesomeIcon icon="fa-solid fa-display" />
                    </NavIcon>
                    <NavText>Home</NavText>
                </NavItem>
                {data.role === 'admin' ?
                    <NavItem eventKey="panel/jabatan">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-chart-simple" />
                        </NavIcon>
                        <NavText>Jabatan</NavText>
                    </NavItem>
                    : null}
                {data.role === 'admin' ?
                    <NavItem eventKey="panel/users">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-users" />
                        </NavIcon>
                        <NavText>Karyawan</NavText>
                    </NavItem>
                    : null}
                {data.role === 'admin' ? null :
                    <NavItem eventKey="panel/profil">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-user-pen" />
                        </NavIcon>
                        <NavText>Edit Profil</NavText>
                    </NavItem>
                }
                {data.role === 'admin' ?
                    <NavItem eventKey="panel/presence">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-file-circle-check" />
                        </NavIcon>
                        <NavText>Absensi</NavText>
                    </NavItem>
                    :
                    <NavItem eventKey="panel/presences">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-file-circle-check" />
                        </NavIcon>
                        <NavText>Absensi</NavText>
                    </NavItem>
                }
                {data.role === 'admin' ?
                    <NavItem eventKey="panel/salary">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-money-bill-wave" />
                        </NavIcon>
                        <NavText>Gaji</NavText>
                    </NavItem>
                    :
                    <NavItem eventKey="panel/salarys">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-money-bill-wave" />
                        </NavIcon>
                        <NavText>Gaji</NavText>
                    </NavItem>
                }
                {data.role === 'admin' ?
                    <NavItem eventKey="panel/leave">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-file-circle-exclamation" />
                        </NavIcon>
                        <NavText>Cuti</NavText>
                    </NavItem>
                    : <NavItem eventKey="panel/leaves">
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-file-circle-exclamation" />
                        </NavIcon>
                        <NavText>Cuti</NavText>
                    </NavItem>
                }
                {isVisible ? (
                    <div className={`text-center fade ${fadeClass}`} style={{ position: 'absolute', bottom: '8%', width: '100%' }}>
                        <Button variant="danger" className="px-5 py-2" onClick={(e) => { e.preventDefault(); dispatch(logout(navigate)); }}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                            <span className="mx-2">Logout</span>
                        </Button>
                    </div>
                ) : (
                    <NavItem eventKey={currentRoute} className='show' style={{ background: '#dc3545', position: 'absolute', bottom: '8%', width: '100%' }} onClick={(e) => { e.preventDefault(); dispatch(logout(navigate)); }}>
                        <NavIcon>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                        </NavIcon>
                    </NavItem>
                )}
            </SideNav.Nav>
        </SideNav >
    );
}
