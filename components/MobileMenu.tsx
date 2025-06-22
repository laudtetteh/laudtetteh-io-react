import React, { useState, useEffect } from 'react';

const MobileMenu: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  return (
    <>
      <div className="arlo_tm_topbar">
        <div className="topbar_inner">
          <div className="transition_link">
            <a href="#home" className="logo_link">
              <div className="logo" data-type="avatar">
                <div 
                  className="avatar" 
                  style={{ backgroundImage: 'url(/img/about/1.jpg)' }}
                ></div>
                <div className="image"><img src="/img/logo/logo-1.png" alt="logo" /></div>
                <div className="text"><h3>LAUD TETTEH</h3></div>
              </div>
            </a>
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
            <div className="transition_link">
              <a href="#home" className="logo_link">
                <div className="logo" data-type="avatar">
                  <div 
                    className="avatar" 
                    style={{ backgroundImage: 'url(/img/about/1.jpg)' }}
                  ></div>
                  <div className="image"><img src="/img/logo/logo-1.png" alt="logo" /></div>
                  <div className="text"><h3>LAUD TETTEH</h3></div>
                </div>
              </a>
            </div>
            <div className="menu_list">
              <ul className="transition_link">
                <li className="active"><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#sandbox">Sandbox</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="social">
              <ul>
                <li><a href="https://github.com/laudtetteh" target="_blank" rel="noopener noreferrer"><i className="icon-github-squared"></i></a></li>
                <li><a href="https://www.linkedin.com/in/laudtetteh" target="_blank" rel="noopener noreferrer"><i className="icon-linkedin-squared"></i></a></li>
              </ul>
            </div>
            <div className="copyright">
              <p>Copyright &copy; {new Date().getFullYear()} by Laud Tetteh</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
 