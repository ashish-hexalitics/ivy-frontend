import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthStateProvider } from "./contexts/authContext";
import { ToastStateProvider } from "./contexts/toastContext";
import { ReportStateProvider } from "./contexts/reportContext";
import { AllDataStateProvider } from "./contexts/allDataContext";

import { InvertedPrivateRoute } from "./routes/InvertedPrivateRoute";
import { PrivateRoute } from "./routes/PrivateRoute";

import LoginView from "./views/Login";
import ForgotPasswordView from "./views/ForgotPassword";
import SidebarComponent from "./components/Sidebar";
import ReportsView from "./views/Reports/Main";
import ViewReport from "./views/Reports/View";
import CheckEmailView from "./views/CheckEmail";
import SuccessView from "./views/Success";
import NewPasswordView from "./views/NewPassword";
import HomeView from "./views/Home";
import CustomersView from "./views/Customers";
import PropertiesView from "./views/Properties";
import TenanciesView from "./views/Tenants";
import UsersView from "./views/Users";
import SettingsView from "./views/Settings";
import AddReportView from "./views/Reports/Main/AddReport";
import AddCustomerView from "./views/Customers/AddCustomer";
import AddPropertyView from "./views/Properties/AddProperty";
import AddTenancyView from "./views/Tenants/AddTenancy";
import ViewProperty from "./views/Properties/ViewProperty";
import EditCustomerView from "./views/Customers/EditCustomer";
import EditPropertyView from "./views/Properties/EditProperty";
import EditTenancyView from "./views/Tenants/EditTenancy";
import PreviewReport from "./views/Reports/Main/ViewReport";
import AddUserView from "./views/Users/AddUser";
import EditUserView from "./views/Users/EditUser";
import Gallery from "./views/Reports/View/Gallery";
import ShowPdf from "./components/ShowPdf";
import SignatureApproval from "./components/SignatureApproval";
import ThanksScreen from "./components/ThanksScreen/Thanks";
import MainLayout from "./components/MainLayout";
import TemplateView from "./views/Templates/Main";
import { TemplateStateProvider } from "./contexts/templateContext";
import AddTemplateView from "./views/Templates/Main/AddTemplate";
import PreviewTemplate from "./views/Templates/Main/ViewTemplate";
import ViewTemplate from "./views/Templates/View";

function App() {
  return (
    <BrowserRouter>
      <ToastStateProvider>
        <AuthStateProvider>
          <ReportStateProvider>
            <AllDataStateProvider>
              <TemplateStateProvider>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <InvertedPrivateRoute>
                        <LoginView />
                      </InvertedPrivateRoute>
                    }
                  />
                  <Route
                    path="/forgotPassword"
                    element={
                      <InvertedPrivateRoute>
                        <ForgotPasswordView />
                      </InvertedPrivateRoute>
                    }
                  />
                  <Route
                    path="/checkEmail"
                    element={
                      <InvertedPrivateRoute>
                        <CheckEmailView />
                      </InvertedPrivateRoute>
                    }
                  />
                  <Route
                    path="/success"
                    element={
                      <InvertedPrivateRoute>
                        <SuccessView />
                      </InvertedPrivateRoute>
                    }
                  />
                  <Route
                    path="/reset_password"
                    element={
                      <InvertedPrivateRoute>
                        <NewPasswordView />
                      </InvertedPrivateRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<HomeView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/customers"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<CustomersView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/customers/add"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddCustomerView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/customers/edit"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<EditCustomerView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/properties"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<PropertiesView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/properties/view"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<ViewProperty />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/properties/add"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddPropertyView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/properties/edit"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<EditPropertyView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/reports"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<ReportsView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/templates"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<TemplateView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/reports/edit"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<PreviewReport />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/templates/edit"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<PreviewTemplate />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/reports/response"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<ViewReport />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/templates/response"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<ViewTemplate />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/reports/add"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddReportView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/templates/add"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddTemplateView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tenants"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<TenanciesView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tenants/add/:id"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddTenancyView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tenants/add"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddTenancyView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tenants/edit"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<EditTenancyView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/users"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<UsersView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/users/add"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<AddUserView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/users/edit"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<EditUserView />} />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <MainLayout children={<SettingsView />} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="reports/gallery/:id"
                    element={<MainLayout children={<Gallery />} />}
                  />
                  <Route path="view-pdf/:reportId" element={<ShowPdf />} />
                  <Route
                    path="show-report-pdf/:reportId"
                    element={<ShowPdf />}
                  />
                  <Route path="inspect/:reportId" element={<ShowPdf />} />
                  <Route path="sign/:id" element={<SignatureApproval />} />
                  <Route path="/thanks" element={<ThanksScreen />} />
                </Routes>
              </TemplateStateProvider>
            </AllDataStateProvider>
          </ReportStateProvider>
        </AuthStateProvider>
      </ToastStateProvider>
    </BrowserRouter>
  );
}

export default App;
