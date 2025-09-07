import React from "react";
import { Link } from 'react-router-dom';
import { Shield, Menu, User, Bell } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onNavigate: (path: string) => void;
  userRole: string;
  onRoleChange: (role: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onRoleChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigationItems = [
    { id: "home", path: "/", label: "Home", roles: ["student", "teacher", "admin"] },
    { id: "dashboard", path: "/dashboard", label: "Dashboard", roles: ["student", "teacher", "admin"] },
    { id: "modules", path: "/modules", label: "Resources", roles: ["student", "teacher", "admin"] },
    { id: "drills", path: "/drills", label: "Virtual Drills", roles: ["student", "teacher", "admin"] },
    { id: "games", path: "/games", label: "Games", roles: ["student", "teacher", "admin"] },
    { id: "contacts", path: "/contacts", label: "Emergency", roles: ["student", "teacher", "admin"] },
    { id: "admin", path: "/admin", label: "Admin", roles: ["admin"] },
  ];

  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 min-w-0 cursor-pointer"
            onClick={() => onNavigate("/")}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                PULSE AI
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                PUNJAB UNIFIED LIFE SAFETY & EMERGENCY AI
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          <Link to="/login" className="text-sm font-medium hover:underline">
  Login
</Link>
<Link
  to="/sign-up"
  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700"
>
  Get Started
</Link>
</nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            

            

            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer">
              
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
            <div className="flex flex-col space-y-2">
              {filteredNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                    currentView === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;