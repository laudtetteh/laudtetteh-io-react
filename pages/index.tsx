import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate preloader
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Sequentially load JS files: jquery.js -> plugins.js -> init.js
    const loadScript = (src: string) => {
      return new Promise<HTMLScriptElement>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    let scripts: HTMLScriptElement[] = [];
    let cancelled = false;

    loadScript('/js/jquery.js')
      .then(script => {
        scripts.push(script);
        return loadScript('/js/plugins.js');
      })
      .then(script => {
        scripts.push(script);
        return loadScript('/js/init.js');
      })
      .then(script => {
        scripts.push(script);
      })
      .catch(() => {/* handle error if needed */});

    return () => {
      cancelled = true;
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>Arlo</title>
        <meta name="description" content="Name of your web site" />
        <meta name="author" content="Marketify" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="/css/plugins.css" />
        <link rel="stylesheet" type="text/css" href="/css/modalboxes.css" />
        <link rel="stylesheet" type="text/css" href="/css/style.css" />
      </Head>

      {/* PRELOADER */}
      {loading && (
        <div id="preloader">
          <div className="loader_line"></div>
        </div>
      )}

      {/* WRAPPER ALL */}
      <div className="arlo_tm_all_wrap" data-enter="rollIn" data-exit="rollOut">
        {/* BACKGROUND EFFECTS */}
        <div className="arlo_tm_background_effects" data-style="lines"></div>

        {/* MOBILE MENU */}
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

        {/* SIDEBAR MENU */}
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

        {/* MAINPART */}
        <div className="arlo_tm_mainpart">
          <div className="mainpart_inner">
            {/* HOME */}
            <div id="home" className="arlo_tm_section animated">
              <div className="arlo_tm_home">
                <div className="content">
                  <h3>David Parker</h3>
                  <div className="animateText">
                    <span>Web Developer</span>
                    <span>UI/UX Designer</span>
                    <span>SEO Optimizer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <div id="about" className="arlo_tm_section">
              <div className="section_inner">
                <div className="arlo_tm_about">
                  <div className="biography">
                    <div className="arlo_tm_title">
                      <h3>About Me</h3>
                    </div>
                    <div className="text">
                      <p>My name is David Parker and I am a Web Designer, and I'm very passionate and dedicated to my work. With 3 years experience as a professional Web Designer, I have acquired the skills and knowledge necessary to make your project a success. I enjoy every step of the design process, from discussion and collaboration. Thanks a lot for your attention and your trust!</p>
                    </div>
                    <div className="details">
                      <ul>
                        <li><span>Name:</span><span>David Parker</span></li>
                        <li><span>Age:</span><span>25</span></li>
                        <li><span>City:</span><span>New York, USA</span></li>
                        <li><span>Job:</span><span>Web Designer</span></li>
                        <li><span>Phone:</span><span><a className="line_effect" href="#">+77 022 155 05 05</a></span></li>
                        <li><span>Email:</span><span><a className="line_effect" href="#">example@gmail.com</a></span></li>
                        <li><span>Website:</span><span><a className="line_effect" href="#">www.yourdomain.com</a></span></li>
                        <li><span>Freelance:</span><span>Available</span></li>
                      </ul>
                    </div>
                    <div className="arlo_tm_button">
                      <a href="/img/cv/1.jpg" download>
                        <span className="back">Download CV</span>
                        <span className="front">Download CV</span>
                      </a>
                    </div>
                  </div>
                  <div className="skillbox">
                    <div className="arlo_tm_title">
                      <h3>Knowledge</h3>
                    </div>
                    <div className="wrapper">
                      <div className="left">
                        <div className="skills_title"><h3>Programming Skills</h3></div>
                        <div className="arlo_progress">
                          <div className="progress_inner" data-value="85" data-color="#999">
                            <span><span className="label">WordPress</span><span className="number">85%</span></span>
                            <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                          </div>
                          <div className="progress_inner" data-value="95" data-color="#999">
                            <span><span className="label">Laravel</span><span className="number">95%</span></span>
                            <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                          </div>
                          <div className="progress_inner" data-value="75" data-color="#999">
                            <span><span className="label">Angular</span><span className="number">75%</span></span>
                            <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                          </div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="skills_title"><h3>Language Skills</h3></div>
                        <div className="arlo_progress">
                          <div className="progress_inner" data-value="100" data-color="#999">
                            <span><span className="label">English</span><span className="number">100%</span></span>
                            <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                          </div>
                          <div className="progress_inner" data-value="90" data-color="#999">
                            <span><span className="label">Arabic</span><span className="number">90%</span></span>
                            <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                          </div>
                          <div className="progress_inner" data-value="80" data-color="#999">
                            <span><span className="label">Japanese</span><span className="number">80%</span></span>
                            <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="experience">
                    <div className="arlo_tm_title"><h3>Timeline</h3></div>
                    <div className="wrapper">
                      <div className="left">
                        <div className="experience_title"><h3>Working Experience</h3></div>
                        <div className="arlo_tm_experience_list">
                          <ul>
                            <li><div className="list_inner"><div className="subject"><h3>Envato Market</h3><span>Web Designer</span></div><div className="date"><span>2020-now</span></div></div></li>
                            <li><div className="list_inner"><div className="subject"><h3>Behance</h3><span>SEO Optimizer</span></div><div className="date"><span>2018-2020</span></div></div></li>
                            <li><div className="list_inner"><div className="subject"><h3>Colorlib</h3><span>Theme Reviewer</span></div><div className="date"><span>2016-2018</span></div></div></li>
                          </ul>
                        </div>
                      </div>
                      <div className="right">
                        <div className="experience_title"><h3>Educational Experience</h3></div>
                        <div className="arlo_tm_experience_list">
                          <ul>
                            <li><div className="list_inner"><div className="subject"><h3>Univercity of Texas</h3><span>Master of Design</span></div><div className="date"><span>2020-2017</span></div></div></li>
                            <li><div className="list_inner"><div className="subject"><h3>Webster College</h3><span>UI/UX Design</span></div><div className="date"><span>2017-2015</span></div></div></li>
                            <li><div className="list_inner"><div className="subject"><h3>Github Club</h3><span>Web Sertification</span></div><div className="date"><span>2015-2013</span></div></div></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="arlo_tm_testimonials">
                    <div className="arlo_tm_title"><h3>Testimonials</h3></div>
                    <div className="testimonials_inner">
                      <div className="quote"><img className="svg" src="/img/svg/quote.svg" alt="" /></div>
                      <div className="wrapper owl-carousel">
                        <div className="item">
                          <div className="text"><p>I rarely like to write reviews, but the Marketify team truly deserve a standing ovation for their customer support, customisation and most importantly is professionalism. Many thanks once again for everything and hope that I get to deal with you again in the near future!</p></div>
                          <div className="details"><div className="avatar"><div className="image" data-img-url="/img/testimonials/1.jpg"></div></div><div className="info"><h3 className="author"><span>Albert Kennedy</span></h3><h3 className="job"><span>Architector</span></h3></div></div>
                        </div>
                        <div className="item">
                          <div className="text"><p>Minimal design, incredibly well documented, and an absolute pleasure to use! The customer support is one of the absolute best I've ever had the pleasure of interacting with. Quick, courteous, and extremely helpful! Thanks a lot for your hard work!</p></div>
                          <div className="details"><div className="avatar"><div className="image" data-img-url="/img/testimonials/2.jpg"></div></div><div className="info"><h3 className="author"><span>Mark Scotland</span></h3><h3 className="job"><span>Photographer</span></h3></div></div>
                        </div>
                        <div className="item">
                          <div className="text"><p>Loved the template design, documentation, customizability and the customer support from Marketify team! I am a noob in programming with very little knowledge about coding but the Marketify team helped me to launch my resume website successfully.</p></div>
                          <div className="details"><div className="avatar"><div className="image" data-img-url="/img/testimonials/3.jpg"></div></div><div className="info"><h3 className="author"><span>Ave Smith</span></h3><h3 className="job"><span>Designer</span></h3></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICES */}
            <div id="services" className="arlo_tm_section">
              <div className="section_inner">
                <div className="arlo_tm_services">
                  <div className="services_list">
                    <div className="arlo_tm_title"><h3>Top Notch Services</h3></div>
                    <ul>
                      <li><div className="list_inner"><img className="svg" src="/img/svg/anchor.svg" alt="" /><h3 className="title">Creative Design</h3><div className="list"><ul><li><span>Figma Design</span></li><li><span>PSD Design</span></li><li><span>Sketch Design</span></li></ul></div></div></li>
                      <li><div className="list_inner"><img className="svg" src="/img/svg/web.svg" alt="" /><h3 className="title">Web Development</h3><div className="list"><ul><li><span>HTML Websites</span></li><li><span>Wordpress Websites</span></li><li><span>NFT &amp; AI Websites</span></li></ul></div></div></li>
                      <li><div className="list_inner"><img className="svg" src="/img/svg/physics.svg" alt="" /><h3 className="title">Mobile Application</h3><div className="list"><ul><li><span>Android Apps</span></li><li><span>IOS Apps</span></li><li><span>Huawei Apps</span></li></ul></div></div></li>
                      <li><div className="list_inner"><img className="svg" src="/img/svg/star.svg" alt="" /><h3 className="title">SEO Optimization</h3><div className="list"><ul><li><span>SEO Website</span></li><li><span>Code Validation</span></li><li><span>GTmetrix Pro</span></li></ul></div></div></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* PORTFOLIO */}
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
                      <li className="vimeo"><div className="inner"><div className="entry arlo_tm_portfolio_animation_wrap" data-title="Web Design" data-category="Vimeo"><a className="popup-vimeo" href="https://vimeo.com/337293658"><img src="/img/thumbs/1-1.jpg" alt="" /><div className="abs_image" data-img-url="/img/portfolio/1.jpg"></div></a></div></div></li>
                      <li className="youtube"><div className="inner"><div className="entry arlo_tm_portfolio_animation_wrap" data-title="Mobile Application" data-category="Youtube"><a className="popup-youtube" href="https://www.youtube.com/watch?v=7e90gBu4pas"><img src="/img/thumbs/1-1.jpg" alt="" /><div className="abs_image" data-img-url="/img/portfolio/2.jpg"></div></a></div></div></li>
                      <li className="soundcloud"><div className="inner"><div className="entry arlo_tm_portfolio_animation_wrap" data-title="Graphic Design" data-category="Soundcloud"><a className="soundcloude_link mfp-iframe audio" href="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/471954807&amp;color=%23ff5500&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"><img src="/img/thumbs/1-1.jpg" alt="" /><div className="abs_image" data-img-url="/img/portfolio/3.jpg"></div></a></div></div></li>
                      <li className="modalbox"><div className="inner"><div className="entry arlo_tm_portfolio_animation_wrap" data-title="Mobile Mockup" data-category="Modalbox"><a className="popup_info portfolio_popup" href="#"><img src="/img/thumbs/1-1.jpg" alt="" /><div className="abs_image" data-img-url="/img/portfolio/4.jpg"></div></a></div><div className="hidden_content_portfolio"><div className="popup_details"><div className="main_details"><div className="textbox"><p>Web designing is the process of planning, conceptualizing, and implementing the plan for designing a website in a way that is functional and offers a good user experience. User experience is central to the web designing process. Websites have an array of elements presented in ways that make them easy to navigate.</p><p>Web designing essentially involves working on every attribute of the website that people interact with, so that the website is simple and efficient, allows users to quickly find the information they need, and looks visually pleasing. All these factors, when combined, decide how well the website is designed.</p></div><div className="detailbox"><ul><li><span className="first">Client</span><span>David Parker</span></li><li><span className="first">Category</span><span><a href="#">Modalbox</a></span></li><li><span className="first">Date</span><span>November 22, 2024</span></li><li><span className="first">Share</span><ul className="share"><li><a href="#"><img className="svg" src="/img/svg/social/facebook.svg" alt="" /></a></li><li><a href="#"><img className="svg" src="/img/svg/social/twitter.svg" alt="" /></a></li><li><a href="#"><img className="svg" src="/img/svg/social/instagram.svg" alt="" /></a></li></ul></li></ul></div></div><div className="additional_images"><ul><li><div className="list_inner"><div className="my_image"><img src="/img/thumbs/4-2.jpg" alt="" /><div className="main" data-img-url="/img/portfolio/5.jpg"></div></div></div></li><li><div className="list_inner"><div className="my_image"><img src="/img/thumbs/4-2.jpg" alt="" /><div className="main" data-img-url="/img/portfolio/6.jpg"></div></div></div></li><li><div className="list_inner"><div className="my_image"><img src="/img/thumbs/4-2.jpg" alt="" /><div className="main" data-img-url="/img/portfolio/7.jpg"></div></div></div></li></ul></div></div></div></div></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOG */}
            <div id="blog" className="arlo_tm_section">
              <div className="section_inner">
                <div className="arlo_tm_news">
                  <div className="news_list">
                    <div className="arlo_tm_title"><h3>Recent Posts</h3></div>
                    <ul>
                      <li><div className="list_inner"><div className="image"><img src="/img/thumbs/4-3.jpg" alt="" /><div className="main" data-img-url="/img/news/1.jpg"></div><a className="arlo_tm_full_link" href="#"></a><div className="date"><span>Dec 25, 2024</span></div></div><div className="desc"><div className="meta"><span>By <a className="line_effect" href="#">Aigars Silcans</a></span><span>In <a className="line_effect" href="#">Lifestyle</a></span></div><div className="title"><h3><a className="text_hover_effect" href="#">How to Create WordPress Website Using Elementor</a></h3></div><div className="arlo_tm_button"><a href="#"><span className="back">Read More</span><span className="front">Read More</span></a></div></div><div className="news_hidden_details"><div className="news_popup_informations"><div className="text"><p>Arlo is a leading web design agency with an award-winning design team that creates innovative, effective websites that capture your brand, improve your conversion rates, and maximize your revenue to help grow your business and achieve your goals.</p><p>In today's digital world, your website is the first interaction consumers have with your business. That's why almost 95 percent of a user's first impression relates to web design. It's also why web design services can have an immense impact on your company's bottom line.</p><p>That's why more companies are not only reevaluating their website's design but also partnering with Erling, the web design agency that's driven more than $2.4 billion in revenue for its clients. With over 50 web design awards under our belt, we're confident we can design a custom website that drives sales for your unique business.</p></div></div></div></div></li>
                      <li><div className="list_inner"><div className="image"><img src="/img/thumbs/4-3.jpg" alt="" /><div className="main" data-img-url="/img/news/2.jpg"></div><a className="arlo_tm_full_link" href="#"></a><div className="date"><span>Dec 22, 2024</span></div></div><div className="desc"><div className="meta"><span>By <a className="line_effect" href="#">Jessica Parker</a></span><span>In <a className="line_effect" href="#">Design</a></span></div><div className="title"><h3><a className="text_hover_effect" href="#">Build Interactive Parallax Effects with  Tweenmax GSAP</a></h3></div><div className="arlo_tm_button"><a href="#"><span className="back">Read More</span><span className="front">Read More</span></a></div></div><div className="news_hidden_details"><div className="news_popup_informations"><div className="text"><p>Arlo is a leading web design agency with an award-winning design team that creates innovative, effective websites that capture your brand, improve your conversion rates, and maximize your revenue to help grow your business and achieve your goals.</p><p>In today's digital world, your website is the first interaction consumers have with your business. That's why almost 95 percent of a user's first impression relates to web design. It's also why web design services can have an immense impact on your company's bottom line.</p><p>That's why more companies are not only reevaluating their website's design but also partnering with Erling, the web design agency that's driven more than $2.4 billion in revenue for its clients. With over 50 web design awards under our belt, we're confident we can design a custom website that drives sales for your unique business.</p></div></div></div></div></li>
                      <li><div className="list_inner"><div className="image"><img src="/img/thumbs/4-3.jpg" alt="" /><div className="main" data-img-url="/img/news/3.jpg"></div><a className="arlo_tm_full_link" href="#"></a><div className="date"><span>Dec 20, 2024</span></div></div><div className="desc"><div className="meta"><span>By <a className="line_effect" href="#">Keita Smith</a></span><span>In <a className="line_effect" href="#">Social</a></span></div><div className="title"><h3><a className="text_hover_effect" href="#">Learn Unique Website Development with W3Schools</a></h3></div><div className="arlo_tm_button"><a href="#"><span className="back">Read More</span><span className="front">Read More</span></a></div></div><div className="news_hidden_details"><div className="news_popup_informations"><div className="text"><p>Arlo is a leading web design agency with an award-winning design team that creates innovative, effective websites that capture your brand, improve your conversion rates, and maximize your revenue to help grow your business and achieve your goals.</p><p>In today's digital world, your website is the first interaction consumers have with your business. That's why almost 95 percent of a user's first impression relates to web design. It's also why web design services can have an immense impact on your company's bottom line.</p><p>That's why more companies are not only reevaluating their website's design but also partnering with Erling, the web design agency that's driven more than $2.4 billion in revenue for its clients. With over 50 web design awards under our belt, we're confident we can design a custom website that drives sales for your unique business.</p></div></div></div></div></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div id="contact" className="arlo_tm_section">
              <div className="section_inner">
                <div className="arlo_tm_contact">
                  <div className="contact_inner">
                    <div className="arlo_tm_title"><h3>Get in Touch</h3></div>
                    <div className="my_map">
                      <div className="mapouter"><div className="gmap_canvas"><iframe width="100%" height="350" id="gmap_canvas" src="https://maps.google.com/maps?q=Broadway,%20New%20York&t=&z=15&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0}></iframe></div></div>
                    </div>
                    <div className="form_wrapper">
                      <form id="contactForm">
                        <div className="error_box" id="empty-form"><p>Please Fill Required Fields</p></div>
                        <div className="error_box" id="subject-alert"><p>Please Select Subject</p></div>
                        <div className="error_box" id="security-alert"><p>Security code does not match !</p></div>
                        <div className="error_box" id="email-invalid"><p>Please enter a valid email address. Exp. example@gmail.com</p></div>
                        <div className="error_box" id="phone-invalid"><p>Please enter a valid phone number.Exp. +998994425557</p></div>
                        <div className="error_box" id="error_mail"><p></p></div>
                        <div className="success_box" id="success_mail"><p>Your message has been sent. We will contact you as soon as possible.</p></div>
                        <ul>
                          <li><input type="text" placeholder="Name" name="contact_name" className="cf-form-control" /><span></span></li>
                          <li><input type="text" placeholder="Email" name="contact_email" className="cf-form-control" /><span></span></li>
                          <li><input type="text" placeholder="Phone" name="contact_phone" className="cf-form-control" /><span></span></li>
                          <li><select name="contact_subject" className="cf-form-control colored"><option value="Choose Services">Choose Service</option><option value="Web Development">Web Development</option><option value="Mobile Application">Mobile Application</option><option value="UI/UX Design">UI/UX Design</option></select></li>
                          <li id="text-area-w"><textarea placeholder="Message" name="contact_message" className="cf-form-control"></textarea></li>
                          <li id="enter_code"><span id="txtCaptchaSpan"></span><input type="text" className="cf-form-control" name="contact_question" id="txtInput" autoComplete="off" placeholder="Please Enter Code *" /><input type="hidden" id="txtCaptcha" /></li>
                        </ul>
                        <div className="arlo_tm_button"><a href="#" id="send_message"><span className="back">Send Message</span><span className="front">Send Message</span></a></div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Load contact.form.js */}
      <script src="/js/contact.form.js"></script>
    </>
  );
};

export default HomePage;
