import React from 'react';

const ServicesSection: React.FC = () => (
  <div id="services" className="arlo_tm_section">
    <div className="section_inner">
      <div className="arlo_tm_services">
        <div className="services_list">
          <div className="arlo_tm_title"><h3>Top Notch Services</h3></div>
          <ul>
            <li>
              <div className="list_inner">
                <img className="svg" src="/img/svg/anchor.svg" alt="" />
                <h3 className="title">Creative Design</h3>
                <div className="list">
                  <ul>
                    <li><span>Figma Design</span></li>
                    <li><span>PSD Design</span></li>
                    <li><span>Sketch Design</span></li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="list_inner">
                <img className="svg" src="/img/svg/web.svg" alt="" />
                <h3 className="title">Web Development</h3>
                <div className="list">
                  <ul>
                    <li><span>HTML Websites</span></li>
                    <li><span>Wordpress Websites</span></li>
                    <li><span>NFT &amp; AI Websites</span></li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="list_inner">
                <img className="svg" src="/img/svg/physics.svg" alt="" />
                <h3 className="title">Mobile Application</h3>
                <div className="list">
                  <ul>
                    <li><span>Android Apps</span></li>
                    <li><span>IOS Apps</span></li>
                    <li><span>Huawei Apps</span></li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="list_inner">
                <img className="svg" src="/img/svg/star.svg" alt="" />
                <h3 className="title">SEO Optimization</h3>
                <div className="list">
                  <ul>
                    <li><span>SEO Website</span></li>
                    <li><span>Code Validation</span></li>
                    <li><span>GTmetrix Pro</span></li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default ServicesSection; 