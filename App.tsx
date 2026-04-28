import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Advances from "./pages/Advances";
import Expenses from "./pages/Expenses";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Admins from "./pages/Admins";

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { page: "dashboard", label: "الرئيسية", icon: "fas fa-home", always: true },
    { page: "employees", label: "الموظفين", icon: "fas fa-users" },
    { page: "attendance", label: "الحضور والانصراف", icon: "fas fa-clock" },
    { page: "advances", label: "السلف والخصومات", icon: "fas fa-hand-holding-usd" },
    { page: "expenses", label: "المصروفات", icon: "fas fa-receipt" },
    { page: "suppliers", label: "الموردين", icon: "fas fa-truck" },
    { page: "reports", label: "التقارير", icon: "fas fa-chart-bar" },
    { page: "admins", label: "المشرفين", icon: "fas fa-user-cog", adminOnly: true },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "linear-gradient(145deg, #1a1a1a, #2a2a2a)",
          padding: "15px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #d4af37",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(212,175,55,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 50, height: 50, background: "linear-gradient(145deg, #d4af37, #b8941f)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fas fa-building" style={{ fontSize: 22, color: "#0a0a0a" }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg, #d4af37, #f4e4a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            SMART TECHNOLOGY
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#b0b0b0", fontSize: 14 }}>
            <i className="fas fa-user-shield" style={{ color: "#d4af37" }} />
            <span>{user?.name || ""}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/change-password")}>
            <i className="fas fa-key" /> تغيير كلمة المرور
          </button>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            <i className="fas fa-sign-out-alt" /> تسجيل الخروج
          </button>
        </div>
      </header>

      <nav style={{ background: "#0a0a0a", padding: "0 30px", borderBottom: "1px solid #2a2a2a", overflowX: "auto" }}>
        <ul style={{ display: "flex", listStyle: "none", gap: 5, margin: 0, padding: 0 }}>
          {navItems.map((item) => {
            if (item.adminOnly && !user?.isMainAdmin) return null;
            if (!item.always && !hasPermission(item.page)) return null;
            const isActive = location.pathname === `/${item.page}`;
            return (
              <li key={item.page}>
                <button
                  onClick={() => navigate(`/${item.page}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "15px 20px",
                    color: isActive ? "#d4af37" : "#b0b0b0",
                    background: isActive ? "linear-gradient(to top, rgba(212,175,55,0.1), transparent)" : "transparent",
                    border: "none",
                    borderBottom: isActive ? "3px solid #d4af37" : "3px solid transparent",
                    fontFamily: "Cairo, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className={item.icon} style={{ fontSize: 16 }} /> {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <main style={{ padding: 30, maxWidth: 1400, margin: "0 auto", width: "100%", flex: 1 }}>
        {children}
      </main>

      <footer style={{ background: "#0a0a0a", padding: 20, textAlign: "center", borderTop: "1px solid #2a2a2a", marginTop: 50 }}>
        <p style={{ fontSize: 14, color: "#b0b0b0" }}>
          تم التصميم بواسطة <span style={{ color: "#d4af37", fontWeight: 600 }}>mostafa</span> &copy; 2026
        </p>
      </footer>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/employees" element={<RequireAuth><Employees /></RequireAuth>} />
      <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
      <Route path="/advances" element={<RequireAuth><Advances /></RequireAuth>} />
      <Route path="/expenses" element={<RequireAuth><Expenses /></RequireAuth>} />
      <Route path="/suppliers" element={<RequireAuth><Suppliers /></RequireAuth>} />
      <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
      <Route path="/admins" element={<RequireAuth><Admins /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
