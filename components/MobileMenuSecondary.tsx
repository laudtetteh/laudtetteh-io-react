import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const MobileMenuSecondary: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => { setMounted(true); }, []);

  const handleNavClick = (sectionId: string) => {
    // Close mobile menu first
    closeMobileMenu();
    
    if (router.pathname === '/') {
      // Already on homepage, use legacy transition system
      setTimeout(() => {
        const link = document.querySelector(`.transition_link a[href="#${sectionId}"]`);
        if (link) {
          (link as HTMLElement).click();
        } else {
          // Fallback to direct scroll
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
        // Update URL with hash
        router.replace(`/#${sectionId}`, undefined, { shallow: true });
      }, 100);
    } else {
      // Navigate to homepage first, then trigger transition
      router.push(`/#${sectionId}`).then(() => {
        setTimeout(() => {
          const link = document.querySelector(`.transition_link a[href="#${sectionId}"]`);
          if (link) {
            (link as HTMLElement).click();
          }
        }, 300); // Longer delay after navigation
      });
    }
  };

  const handleBlogClick = () => {
    // Close mobile menu first
    closeMobileMenu();
    
    // Delay navigation slightly to allow menu to close
    setTimeout(() => {
      router.push('/blog');
    }, 100);
  };

  const handleHomeClick = () => {
    closeMobileMenu();
    
    setTimeout(() => {
      if (router.pathname === '/') {
        // Already on homepage, trigger home transition
        const link = document.querySelector(`.transition_link a[href="#home"]`);
        if (link) {
          (link as HTMLElement).click();
        }
        // Update URL with hash
        router.replace('/#home', undefined, { shallow: true });
      } else {
        // Navigate to homepage
        router.push('/#home');
      }
    }, 100);
  };

  const closeMobileMenu = () => {
    // Remove the opened class from mobile menu
    const mobileMenu = document.querySelector('.arlo_tm_mobile_menu');
    const hamburger = document.querySelector('.arlo_tm_topbar .trigger .hamburger');
    
    if (mobileMenu) {
      mobileMenu.classList.remove('opened');
    }
    if (hamburger) {
      hamburger.classList.remove('is-active');
    }
  };

  if (!mounted) return null;
  return (
    <>
      <div className="arlo_tm_topbar">
        <div className="topbar_inner">
          <div className="transition_link" style={{marginTop: 25}}>
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
                <li className="active">
                  <a href="#home" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleHomeClick(); }}>Home</a>
                </li>
                <li>
                  <a href="#about" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleNavClick('about'); }}>About</a>
                </li>
                <li>
                  <a href="#sandbox" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleNavClick('sandbox'); }}>Sandbox</a>
                </li>
                <li>
                  <a href="#blog" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleBlogClick(); }}>Blog</a>
                </li>
                <li>
                  <a href="#contact" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleNavClick('contact'); }}>Contact</a>
                </li>
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

export default MobileMenuSecondary;
 