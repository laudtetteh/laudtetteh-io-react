import React from 'react';

const SidebarMenu: React.FC = () => (
  <div className="arlo_tm_sidebar_menu">
    <div className="sidebar_inner">
      <div className="logo" data-type="avatar">
        <div className="avatar" data-img-url="/img/about/1.jpg"></div>
        <div className="image"><img src="/img/logo/logo.png" alt="logo" /></div>
        <div className="text"><h3>ARLO</h3></div>
      </div>
      <div className="menu">
        <ul className="transition_link">
          <li className="active"><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div className="copyright">
        <p>Copyright &copy; 2024 by <a className="line_effect" href="#">Marketify</a></p>
        <p>All rights are reserved</p>
      </div>
      <div className="social">
        <ul>
          <li><a href="#"><i className="icon-facebook-squared-1"></i></a></li>
          <li><a href="#"><i className="icon-linkedin-squared"></i></a></li>
          <li><a href="#"><i className="icon-vimeo-squared"></i></a></li>
          <li><a href="#"><i className="icon-youtube-squared"></i></a></li>
          <li><a href="#"><i className="icon-skype-circled"></i></a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default SidebarMenu; 