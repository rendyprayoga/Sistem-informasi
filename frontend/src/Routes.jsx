import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout/Index";
import Dashboard from "./pages/dashboard";
import Profil from "./pages/profil";
import Login from "./pages/auth";
import { Authenticated } from "./middleware/auth.middleware";
import Jabatan from "./pages/admin/jabatan";
import JabatanAdd from "./pages/admin/addJabatan";
import Karyawan from "./pages/admin/karyawan";
import KaryawanAdd from "./pages/admin/addKaryawan";
import Absensi from "./pages/admin/absensi";
import Cuti from "./pages/admin/cuti";
import Gaji from "./pages/admin/gaji";
import AbsensiUser from "./pages/user/absensiUser";
import GajiU from "./pages/user/gajiUser";
import CutiUser from "./pages/user/cutiUser";
import CutiAdd from "./pages/user/addCuti";

export default function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/panel" element={
                    <Authenticated>
                        <Layout />
                    </Authenticated>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="jabatan" element={<Jabatan />} />
                    <Route path="users" element={<Karyawan />} />
                    <Route path="profil" element={<Profil />} />
                    <Route path="presence" element={<Absensi />} />
                    <Route path="salary" element={<Gaji />} />
                    <Route path="salarys" element={<GajiU />} />
                    <Route path="leave" element={<Cuti />} />
                    <Route path="leaves" element={<CutiUser />} />
                    <Route path="add-leaves" element={<CutiAdd />} />
                    <Route path="add-jabatan" element={<JabatanAdd />} />
                    <Route path="add-karyawan" element={<KaryawanAdd />} />
                    <Route path="presences" element={<AbsensiUser />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
