import React, { useState, useEffect } from 'react';

const MobileMenu: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <>
      <div className="arlo_tm_topbar">
        <div className="topbar_inner">
          <div className="logo" data-type="avatar">
            <div className="avatar" data-img-url="/img/about/1.jpg"></div>
            <div className="image"><img src="/img/logo/logo.png" alt="logo" /></div>
            <div className="text"><h3>ARLO</h3></div>
          </div>
          <div className="trigger">
            <div className="hamburger hamburger--slider">
              <div className="hamburger-box">
                <div className="hamburger-inner"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="arlo_tm_mobile_menu">
        <div className="inner">
          <div className="wrapper">
            <div className="logo" data-type="avatar">
              <div className="avatar" data-img-url="/img/about/1.jpg"></div>
              <div className="image"><img src="/img/logo/logo.png" alt="logo" /></div>
              <div className="text"><h3>ARLO</h3></div>
            </div>
            <div className="menu_list">
              <ul className="transition_link">
                <li className="active"><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
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
            <div className="copyright">
              <p>Copyright &copy; 2024</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
 