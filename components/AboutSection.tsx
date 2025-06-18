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
            <p>I'm Laud Tetteh, a Full Stack Web Developer based in Seattle, WA, with 10+ years of experience building, optimizing, and maintaining web applications for clients and employers across the US and Africa. I thrive on learning new technologies, collaborating with smart people, and solving real-world problems through code. My background spans backend, frontend, DevOps, and project management. Let's build something great together!</p>
          </div>
          <div className="details">
            <ul>
              <li><span>Name:</span><span>Laud Tetteh</span></li>
              <li><span>Location:</span><span>Seattle, WA</span></li>
              <li><span>Job:</span><span>Software Engineer</span></li>
              <li><span>Working at:</span><span>Salesforce</span></li>
              <li><span>Email:</span><span><a className="line_effect" href="mailto:hello@laudtetteh.io">hello@laudtetteh.io</a></span></li>
              <li><span>Website:</span><span><a className="line_effect" href="https://www.laudtetteh.io">www.laudtetteh.io</a></span></li>
            </ul>
          </div>
          <div className="arlo_tm_button">
            <a href="/docs/cv/Laud-Tetteh-Resume.pdf" download>
              <span className="back">Download CV</span>
              <span className="front">Download CV</span>
            </a>
          </div>
        </div>
        <div className="skillbox">
          <div className="arlo_tm_title">
            <h3>Skills</h3>
          </div>
          <div className="wrapper">
            <div className="left">
              <div className="skills_title"><h3>Server Side</h3></div>
              <div className="arlo_progress">
                <div className="progress_inner" data-value="80" data-color="#999">
                  <span><span className="label">PHP | Node.js</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="85" data-color="#999">
                  <span><span className="label">Laravel | WordPress | Drupal</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="65" data-color="#999">
                  <span><span className="label">MySQL | MariaDB | MongoDB</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="skills_title"><h3>Client Side</h3></div>
              <div className="arlo_progress">
                <div className="progress_inner" data-value="70" data-color="#999">
                  <span><span className="label">ReactJS</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="80" data-color="#999">
                  <span><span className="label">Bootstrap | TailwindCSS</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="95" data-color="#999">
                  <span><span className="label">HTML | CSS | SASS</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="wrapper" style={{marginTop: '5em'}}>
            <div className="left">
              <div className="skills_title"><h3>Dev-Ops & CI/CD</h3></div>
              <div className="arlo_progress">
                <div className="progress_inner" data-value="85" data-color="#999">
                  <span><span className="label">GitHub Actions</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="75" data-color="#999">
                  <span><span className="label">Cypress | PHPUnit | Playwright</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="95" data-color="#999">
                  <span><span className="label">Docker | AWS | Heroku | Netlify</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="skills_title"><h3>Others</h3></div>
              <div className="arlo_progress">
                <div className="progress_inner" data-value="100" data-color="#999">
                  <span><span className="label">Agile | Jira | GUS | Asana</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="80" data-color="#999">
                  <span><span className="label">New Relic | Google Analytics</span><span className="number"></span></span>
                  <div className="background"><div className="bar"><div className="bar_in"></div></div></div>
                </div>
                <div className="progress_inner" data-value="90" data-color="#999">
                  <span><span className="label">Figma | Sketch</span><span className="number"></span></span>
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
              <div className="experience_title"><h3>Work Experience</h3></div>
              <div className="arlo_tm_experience_list">
                <ul>
                  <li><div className="list_inner"><div className="subject"><h3>Software Eng.</h3><span>Salesforce</span></div><div className="date"><span>2021 - Present</span></div></div></li>
                  <li><div className="list_inner"><div className="subject"><h3>Senior Dev.</h3><span>MethodistCRM</span></div><div className="date"><span>2019 - 2021</span></div></div></li>
                  <li><div className="list_inner"><div className="subject"><h3>Senior Dev.</h3><span>Studio Ten Four, LLC</span></div><div className="date"><span>2014 - 2021</span></div></div></li>
                  <li><div className="list_inner"><div className="subject"><h3>Front-End Eng.</h3><span>Moz</span></div><div className="date"><span>2016 - 2017</span></div></div></li>
                </ul>
              </div>
            </div>
            <div className="right">
              <div className="experience_title"><h3>Education</h3></div>
              <div className="arlo_tm_experience_list">
                <ul>
                  <li><div className="list_inner"><div className="subject"><h3>Central University College, Ghana</h3><span>BA, Business Administration</span></div><div className="date"><span>2008</span></div></div></li>
                  <li><div className="list_inner"><div className="subject"><h3>Cape Coast Polytechnic, Ghana</h3><span>HND, Civil Engineering</span></div><div className="date"><span>2005</span></div></div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="arlo_tm_testimonials">
          <div className="arlo_tm_title"><h3>Some Nice Words</h3></div>
          <div className="testimonials_inner">
            <div className="quote"><img className="svg" src="/img/svg/quote.svg" alt="" /></div>
            <div className="wrapper owl-carousel">
              <div className="item">
                <div className="text"><p>"Laud is a highly skilled engineer who consistently delivers high-quality work. He is proactive, collaborative, and always willing to go the extra mile to ensure project success. His technical expertise and positive attitude make him a valuable asset to any team."</p></div>
                <div className="info"><h3 className="author"><span>Jennifer Alderete (Salesforce)</span></h3><h3 className="job"><span>Software Engineering Manager, Salesforce</span></h3></div>
              </div>
              <div className="item">
                <div className="text"><p>"Laud is a talented engineer, responsive to requests, and delivered on projects. As a marketer speaking to a marketer, he was patient and I appreciated his ability to collaborate and clearly lay out his technical work so that I could better understand. His positive attitude and work ethic make him an excellent coworker."</p></div>
                <div className="info"><h3 className="author"><span>Danielle Citrine (Moz)</span></h3><h3 className="job"><span>Demand Generation & Event Marketer</span></h3></div>
              </div>
              <div className="item">
                <div className="text"><p>"Laud was fantastic to work with at Moz for several months. He helped us during a very busy period by working through a hefty backlog of front-end tickets, giving the rest of the UX team time to work on implementing a new CMS and UX framework. He was conscientious about completing tickets on time, communicated well with project stakeholders, and wasn't afraid to ask questions when he needed help. Most importantly, he has just an enjoyably low drama nature."</p></div>
                <div className="info"><h3 className="author"><span>Christopher Ferris (Moz)</span></h3><h3 className="job"><span>Software Engineer</span></h3></div>
              </div>
              <div className="item">
                <div className="text"><p>"Laud was awesome to work with at Moz. As a marketer, I appreciated his communication style the most as well as his speediness. My job was to request new landing pages and updates to our marketing pages... I really appreciated that. I'd recommend Laud for any marketer or designer looking for a front end developer, and to any dev team looking for a developer who can work well with marketers. He also has a great can-do attitude, adorable twins, and a super solid goal to help his community."</p></div>
                <div className="info"><h3 className="author"><span>Brittani Dinsmore (Moz)</span></h3><h3 className="job"><span>Marketing Leader</span></h3></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutSection;
