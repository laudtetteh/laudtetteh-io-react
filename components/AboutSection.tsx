import React from 'react';

const AboutSection: React.FC = () => (
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
);

export default AboutSection;
