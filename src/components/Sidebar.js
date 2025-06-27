import React from 'react';
import './Sidebar.css';
// Để đơn giản, tôi dùng text cho icon. Bạn có thể dùng react-icons nếu muốn.

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="menu-icon">☰</div> {/* Icon Menu */}
        <div className="gemini-logo">G</div>
      </div>
      <div className="new-chat-button">
        + Cuộc trò chuyện mới
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm" />
        <span className="search-icon">🔍</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-item">
            <span className="nav-icon">✨</span>
            <span className="nav-text">Khám phá Gem</span>
          </div>
        </div>
        <div className="nav-section recent-chats">
          <div className="section-title">Gần đây</div>
          <div className="nav-item active">
            <span className="nav-text">Giao diện Chat AI ReactJS</span>
          </div>
          <div className="nav-item">
            <span className="nav-text">Thêm Học Phần: Các Cách...</span>
          </div>
          <div className="nav-item">
            <span className="nav-text">Dropdown Menu Clipping Fix</span>
          </div>
          <div className="nav-item">
            <span className="nav-text">Vue.js UI/UX Refinement</span>
          </div>
          <div className="nav-item">
            <span className="nav-text">Lọc CV bằng Spring Boot</span>
          </div>
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Cài đặt và trợ giúp</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;