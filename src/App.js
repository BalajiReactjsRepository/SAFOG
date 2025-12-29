import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import MainLayout from "./Layout/MainLayout";
import ProtectedRoute from "./Utils/ProtectedRoute";
const LandingPage = lazy(() => import("./Modules/LandingPage"));
const OtpVerification = lazy(() => import("./Modules/OtpVerification"));
const Registration = lazy(() => import("./Modules/Registration"));
const UploadEssay = lazy(() => import("./Modules/UploadEssay"));
const Success = lazy(() => import("./Modules/Success"));
const Leaderboard = lazy(() => import("./Modules/Leaderboard"));
const Product = lazy(() => import("./Modules/Product"));

function App() {
  return (
    <Suspense
      fallback={
        <div className=' d-flex justify-content-center align-items-center vh-100'>
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/otp-verification' element={<OtpVerification />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/registration' element={<Registration />} />
            <Route path='/upload-essay' element={<UploadEssay />} />
            <Route path='/submitted' element={<Success />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
          </Route>
        </Route>

        <Route path='/product/:id' element={<Product />} />
      </Routes>
    </Suspense>
  );
}

export default App;
