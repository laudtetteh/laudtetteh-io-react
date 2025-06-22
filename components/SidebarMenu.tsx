import React from 'react';

const SidebarMenu: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="arlo_tm_sidebar_menu">
      <div className="sidebar_inner">
        <div className="logo" data-type="avatar">
          <div className="avatar" data-img-url="/img/about/1.jpg"></div>
          <div className="image"><img src="/img/logo/logo.png" alt="logo" /></div>
          <div className="text"><h3>LAUD TETTEH</h3></div>
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
          <p>Copyright &copy; {currentYear} by <a className="line_effect" href="#">Laud Tetteh</a></p>
          <p>All rights are reserved</p>
        </div>
        <div className="social">
          <ul>
            <li><a href="https://github.com/laudtetteh" target="_blank" rel="noopener noreferrer"><i className="icon-github-squared"></i></a></li>
            <li><a href="https://www.linkedin.com/in/laudtetteh" target="_blank" rel="noopener noreferrer"><i className="icon-linkedin-squared"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
