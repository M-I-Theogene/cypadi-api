import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiMessageSquare,
  FiLogOut,
  FiPlus,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiMenu,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import "./Sidebar.css";

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Toggle dropdown
  const toggleDropdown = (menu: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // Close dropdowns when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setOpenDropdowns([]);
      setIsProfileDropdownOpen(false);
    }
  }, [isCollapsed]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".sidebar__footer") && isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items configuration
  const menuItems = [
    {
      id: "dashboard",
      icon: FiHome,
      label: "Dashboard",
      path: "/",
      hasDropdown: false,
    },
    {
      id: "posts",
      icon: FiFileText,
      label: "Posts",
      path: "/posts",
      hasDropdown: true,
      subItems: [
        {
          id: "manage-posts",
          label: "Manage Posts",
          path: "/posts",
          icon: FiFileText,
        },
        {
          id: "new-post",
          label: "New Post",
          path: "/posts/create",
          icon: FiPlus,
        },
      ],
    },
    {
      id: "comments",
      icon: FiMessageSquare,
      label: "Comments",
      path: "/comments",
      hasDropdown: false,
    },
  ];

  return (
    <div
      className={`sidebar-container ${isCollapsed ? "collapsed" : ""} ${
        isMobileMenuOpen ? "mobile-open" : ""
      }`}
      onClick={(e) => {
        // Close sidebar when clicking on overlay (but not on sidebar itself)
        if (
          window.innerWidth <= 768 &&
          isMobileMenuOpen &&
          (e.target as HTMLElement).classList.contains("sidebar-container")
        ) {
          setIsMobileMenuOpen(false);
        }
      }}
    >
      <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
        {/* Header with Logo */}
        <div className="sidebar__header">
          <div className="sidebar__logo-container">
            <img
              src="/logo/cypadi_trancyparent_logo.png"
              alt="Cypadi Logo"
              className="sidebar__logo"
            />
            {!isCollapsed && (
              <span className="sidebar__brand">Cypadi Blog</span>
            )}
          </div>
          <button
            className={`sidebar__toggle ${isCollapsed ? "collapsed" : ""}`}
            onClick={() => {
              const isMobile = window.innerWidth <= 768;
              if (isMobile) {
                // On mobile, close the sidebar
                setIsMobileMenuOpen(false);
              } else {
                // On desktop, toggle collapse/expand
                setIsCollapsed(!isCollapsed);
              }
            }}
            aria-label="Toggle sidebar"
          >
            <FiChevronLeft />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.path);
            const isDropdownOpen = openDropdowns.includes(item.id);
            const isHovered = hoveredDropdown === item.id;

            if (item.hasDropdown) {
              return (
                <div
                  key={item.id}
                  className={`sidebar__menu-item ${
                    isItemActive || isDropdownOpen ? "active" : ""
                  }`}
                  onMouseEnter={() => {
                    if (isCollapsed) {
                      setHoveredDropdown(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isCollapsed) {
                      setHoveredDropdown(null);
                    }
                  }}
                >
                  {isCollapsed ? (
                    <Link
                      to={item.path}
                      className="sidebar__link"
                      onClick={() => setHoveredDropdown(null)}
                    >
                      <Icon className="sidebar__icon" />
                    </Link>
                  ) : (
                    <div
                      className="sidebar__link"
                      onClick={(e) => {
                        // Only toggle if clicking on the link itself, not on dropdown items
                        const target = e.target as HTMLElement;
                        if (!target.closest(".sidebar__dropdown")) {
                          toggleDropdown(item.id);
                        }
                      }}
                    >
                      <Icon className="sidebar__icon" />
                      <span className="sidebar__label">{item.label}</span>
                      {isDropdownOpen ? (
                        <FiChevronDown className="sidebar__chevron" />
                      ) : (
                        <FiChevronRight className="sidebar__chevron" />
                      )}
                    </div>
                  )}

                  {/* Dropdown Menu - Expanded State */}
                  {!isCollapsed && isDropdownOpen && item.subItems && (
                    <div
                      className="sidebar__dropdown"
                      onClick={(e) => {
                        // Stop all clicks inside dropdown from bubbling to parent
                        e.stopPropagation();
                      }}
                    >
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActive(subItem.path);
                        return (
                          <Link
                            key={subItem.id}
                            to={subItem.path}
                            className={`sidebar__dropdown-link ${
                              isSubActive ? "active" : ""
                            }`}
                            onClick={(e) => {
                              // Stop navigation click from bubbling
                              e.stopPropagation();
                            }}
                          >
                            <SubIcon className="sidebar__icon" />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Dropdown Flyout - Collapsed State */}
                  {isCollapsed && isHovered && item.subItems && (
                    <div className="sidebar__flyout">
                      <div className="sidebar__flyout-header">{item.label}</div>
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActive(subItem.path);
                        return (
                          <Link
                            key={subItem.id}
                            to={subItem.path}
                            className={`sidebar__flyout-link ${
                              isSubActive ? "active" : ""
                            }`}
                            onClick={() => setHoveredDropdown(null)}
                          >
                            <SubIcon className="sidebar__icon" />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item (no dropdown)
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar__link ${isItemActive ? "active" : ""}`}
              >
                <Icon className="sidebar__icon" />
                {!isCollapsed && (
                  <span className="sidebar__label">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="sidebar__footer">
          <div
            className={`sidebar__user ${isProfileDropdownOpen ? "active" : ""}`}
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="User Avatar"
              className="sidebar__avatar"
            />
            {!isCollapsed && (
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">Admin User</div>
                <div className="sidebar__user-role">Administrator</div>
              </div>
            )}
            {!isCollapsed && (
              <FiChevronDown
                className={`sidebar__profile-chevron ${
                  isProfileDropdownOpen ? "open" : ""
                }`}
              />
            )}
          </div>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && !isCollapsed && (
            <div className="sidebar__profile-dropdown">
              <button
                className="sidebar__profile-dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setIsProfileDropdownOpen(false);
                }}
              >
                <FiSettings className="sidebar__icon" />
                <span>Manage Profile</span>
              </button>
              <button
                className="sidebar__profile-dropdown-item logout"
                onClick={() => {
                  handleLogout();
                  setIsProfileDropdownOpen(false);
                }}
              >
                <FiLogOut className="sidebar__icon" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Collapsed state - show icon button */}
          {isCollapsed && (
            <button
              className="sidebar__profile-icon-btn"
              onClick={() => navigate("/profile")}
              title="Manage Profile"
            >
              <FiUser className="sidebar__icon" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Toggle Button - Only visible on mobile when sidebar is closed */}
      {!isMobileMenuOpen && (
        <button
          className="sidebar__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      )}

      {/* Main Content */}
      <main
        className={`main-content ${isCollapsed ? "expanded" : ""}`}
        onClick={(e) => {
          // Only handle mobile menu closing, don't interfere with sidebar dropdowns
          if (window.innerWidth <= 768 && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
          }
        }}
      >
        {children}
      </main>
    </div>
  );
};

