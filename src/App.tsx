import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./pages/DashboardModern";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/DriversModern";
import Calendar from "./pages/Calendar";
import MaintenancePage from "./pages/Maintenance";
import MaintenanceDetails from "./pages/MaintenanceDetails";
import MaintenanceForm from "./components/MaintenanceForm";
import OilChangePage from "./pages/OilChange";
import OilChangeDetails from "./pages/OilChangeDetails";
import OilChangeForm from "./components/OilChangeForm";
import TechnicalInspectionPage from "./pages/TechnicalInspection";
import TechnicalInspectionDetails from "./pages/TechnicalInspectionDetails";
import TechnicalInspectionForm from "./components/TechnicalInspectionForm";
import FuelPage from "./pages/Fuel";
import FuelDetails from "./pages/FuelDetails";
import VehicleForm from "./components/VehicleForm";
import DriverForm from "./components/DriverForm";
import VehicleDetails from "./pages/VehicleDetails";
import FuelForm from "./components/FuelForm";
import Insurance from "./pages/Insurance";
import InsuranceDetails from "./pages/InsuranceDetails";
import InsuranceForm from "./components/InsuranceForm";
import DriverDetails from "./pages/DriverDetails";
import TireChangePage from "./pages/TireChangePage";
import TireChangeDetails from "./pages/TireChangeDetails";
import TireChangeForm from "./components/TireChangeForm";
import WashingPage from "./pages/WashingPage";
import WashingDetails from "./pages/WashingDetails";
import WashingForm from "./components/WashingForm";
import AlertsPage from "./pages/AlertsPage";
import VehicleFiles from "./pages/VehicleFiles";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Route de connexion */}
            <Route path="/login" element={<Login />} />

            {/* Routes protégées */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/vehicles" element={<Vehicles />} />
                      <Route path="/drivers" element={<Drivers />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route
                        path="/maintenance"
                        element={<MaintenancePage />}
                      />
                      <Route path="/oil-change" element={<OilChangePage />} />
                      <Route
                        path="/technical-inspection"
                        element={<TechnicalInspectionPage />}
                      />
                      <Route path="/fuel" element={<FuelPage />} />
                      <Route path="/tire-change" element={<TireChangePage />} />
                      <Route path="/washing" element={<WashingPage />} />
                      <Route path="/alerts" element={<AlertsPage />} />

                      {/* Routes pour les formulaires (à implémenter) */}
                      <Route path="/vehicles/new" element={<VehicleForm />} />
                      <Route
                        path="/vehicles/:id"
                        element={<VehicleDetails />}
                      />
                      <Route
                        path="/vehicles/:id/edit"
                        element={<VehicleForm isEdit={true} />}
                      />
                      <Route
                        path="/vehicles/:vehicleId/files"
                        element={<VehicleFiles />}
                      />

                      <Route path="/drivers/new" element={<DriverForm />} />
                      <Route path="/drivers/:id" element={<DriverDetails />} />
                      <Route
                        path="/drivers/:id/edit"
                        element={<DriverForm isEdit={true} />}
                      />

                      <Route
                        path="/maintenance/new"
                        element={<MaintenanceForm />}
                      />
                      <Route
                        path="/maintenance/:id"
                        element={<MaintenanceDetails />}
                      />
                      <Route
                        path="/maintenance/:id/edit"
                        element={<MaintenanceForm isEdit={true} />}
                      />

                      {/* Routes pour les vidanges */}
                      <Route
                        path="/oil-change/new"
                        element={<OilChangeForm />}
                      />
                      <Route
                        path="/oil-change/:id"
                        element={<OilChangeDetails />}
                      />
                      <Route
                        path="/oil-change/:id/edit"
                        element={<OilChangeForm isEdit={true} />}
                      />

                      {/* Routes pour les visites techniques */}
                      <Route
                        path="/technical-inspection/new"
                        element={<TechnicalInspectionForm />}
                      />
                      <Route
                        path="/technical-inspection/:id"
                        element={<TechnicalInspectionDetails />}
                      />
                      <Route
                        path="/technical-inspection/:id/edit"
                        element={<TechnicalInspectionForm isEdit={true} />}
                      />

                      <Route path="/fuel/new" element={<FuelForm />} />
                      <Route path="/fuel/:id" element={<FuelDetails />} />
                      <Route
                        path="/fuel/:id/edit"
                        element={<FuelForm isEdit={true} />}
                      />

                      {/* Routes pour les assurances */}
                      <Route path="/insurance" element={<Insurance />} />
                      <Route
                        path="/insurance/new"
                        element={<InsuranceForm />}
                      />
                      <Route
                        path="/insurance/:id"
                        element={<InsuranceDetails />}
                      />
                      <Route
                        path="/insurance/:id/edit"
                        element={<InsuranceForm isEdit={true} />}
                      />

                      {/* Routes pour les changements de pneus */}
                      <Route
                        path="/tire-change/new"
                        element={<TireChangeForm />}
                      />
                      <Route
                        path="/tire-change/:id"
                        element={<TireChangeDetails />}
                      />
                      <Route
                        path="/tire-change/:id/edit"
                        element={<TireChangeForm isEdit={true} />}
                      />

                      {/* Routes pour les lavages */}
                      <Route path="/washing/new" element={<WashingForm />} />
                      <Route path="/washing/:id" element={<WashingDetails />} />
                      <Route
                        path="/washing/:id/edit"
                        element={<WashingForm isEdit={true} />}
                      />

                      <Route
                        path="/settings"
                        element={
                          <div className="p-6">
                            <h1 className="text-2xl font-bold">Paramètres</h1>
                            <p className="mt-2 text-gray-600">
                              Page de paramètres à implémenter
                            </p>
                          </div>
                        }
                      />

                      {/* Route 404 */}
                      <Route
                        path="*"
                        element={
                          <div className="p-6">
                            <h1 className="text-2xl font-bold">
                              Page non trouvée
                            </h1>
                            <p className="mt-2 text-gray-600">
                              La page que vous cherchez n'existe pas.
                            </p>
                          </div>
                        }
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
