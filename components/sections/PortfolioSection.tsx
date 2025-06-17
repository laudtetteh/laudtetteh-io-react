import React from 'react';

const PortfolioSection: React.FC = () => (
  <>
    <div className="arlo_tm_portfolio_titles"></div>
    <div id="portfolio" className="arlo_tm_section">
      <div className="section_inner">
        <div className="arlo_tm_portfolio">
          <div className="portfolio_list">
            <div className="arlo_tm_title"><h3>Creative Portfolio</h3></div>
            <div className="portfolio_filter">
              <ul>
                <li><a href="#" className="current" data-filter="*">All</a></li>
                <li><a href="#" data-filter=".vimeo">Vimeo</a></li>
                <li><a href="#" data-filter=".youtube">Youtube</a></li>
                <li><a href="#" data-filter=".soundcloud">Soundcloud</a></li>
                <li><a href="#" data-filter=".modalbox">Modalbox</a></li>
              </ul>
            </div>
            <ul className="portfolio_item gallery_zoom">
              <li className="vimeo">
                <div className="inner">
                  <div className="entry arlo_tm_portfolio_animation_wrap" data-title="Web Design" data-category="Vimeo">
                    <a className="popup-vimeo" href="https://vimeo.com/337293658">
                      <img src="/img/thumbs/1-1.jpg" alt="" />
                      <div className="abs_image" data-img-url="/img/portfolio/1.jpg"></div>
                    </a>
                  </div>
                </div>
              </li>
              <li className="youtube">
                <div className="inner">
                  <div className="entry arlo_tm_portfolio_animation_wrap" data-title="Mobile Application" data-category="Youtube">
                    <a className="popup-youtube" href="https://www.youtube.com/watch?v=7e90gBu4pas">
                      <img src="/img/thumbs/1-1.jpg" alt="" />
                      <div className="abs_image" data-img-url="/img/portfolio/2.jpg"></div>
                    </a>
                  </div>
                </div>
              </li>
              <li className="soundcloud">
                <div className="inner">
                  <div className="entry arlo_tm_portfolio_animation_wrap" data-title="Graphic Design" data-category="Soundcloud">
                    <a className="soundcloude_link mfp-iframe audio" href="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/471954807&amp;color=%23ff5500&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true">
                      <img src="/img/thumbs/1-1.jpg" alt="" />
                      <div className="abs_image" data-img-url="/img/portfolio/3.jpg"></div>
                    </a>
                  </div>
                </div>
              </li>
              <li className="modalbox">
                <div className="inner">
                  <div className="entry arlo_tm_portfolio_animation_wrap" data-title="Mobile Mockup" data-category="Modalbox">
                    <a className="popup_info portfolio_popup" href="#">
                      <img src="/img/thumbs/1-1.jpg" alt="" />
                      <div className="abs_image" data-img-url="/img/portfolio/4.jpg"></div>
                    </a>
                  </div>
                  <div className="hidden_content_portfolio">
                    <div className="popup_details">
                      <div className="main_details">
                        <div className="textbox">
                          <p>Web designing is the process of planning, conceptualizing, and implementing the plan for designing a website in a way that is functional and offers a good user experience. User experience is central to the web designing process. Websites have an array of elements presented in ways that make them easy to navigate.</p>
                          <p>Web designing essentially involves working on every attribute of the website that people interact with, so that the website is simple and efficient, allows users to quickly find the information they need, and looks visually pleasing. All these factors, when combined, decide how well the website is designed.</p>
                        </div>
                        <div className="detailbox">
                          <ul>
                            <li><span className="first">Client</span><span>David Parker</span></li>
                            <li><span className="first">Category</span><span><a href="#">Modalbox</a></span></li>
                            <li><span className="first">Date</span><span>November 22, 2024</span></li>
                            <li><span className="first">Share</span>
                              <ul className="share">
                                <li><a href="#"><img className="svg" src="/img/svg/social/facebook.svg" alt="" /></a></li>
                                <li><a href="#"><img className="svg" src="/img/svg/social/twitter.svg" alt="" /></a></li>
                                <li><a href="#"><img className="svg" src="/img/svg/social/instagram.svg" alt="" /></a></li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="additional_images">
                        <ul>
                          <li>
                            <div className="list_inner">
                              <div className="my_image">
                                <img src="/img/thumbs/4-2.jpg" alt="" />
                                <div className="main" data-img-url="/img/portfolio/5.jpg"></div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="list_inner">
                              <div className="my_image">
                                <img src="/img/thumbs/4-2.jpg" alt="" />
                                <div className="main" data-img-url="/img/portfolio/6.jpg"></div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="list_inner">
                              <div className="my_image">
                                <img src="/img/thumbs/4-2.jpg" alt="" />
                                <div className="main" data-img-url="/img/portfolio/7.jpg"></div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default PortfolioSection; 