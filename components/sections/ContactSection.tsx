import React from 'react';

const ContactSection: React.FC = () => (
  <div id="contact" className="arlo_tm_section">
    <div className="section_inner">
      <div className="arlo_tm_contact">
        <div className="contact_inner">
          <div className="arlo_tm_title"><h3>Get in Touch</h3></div>
          <div className="my_map">
            <div className="mapouter">
              <div className="gmap_canvas">
                <iframe
                  width="100%"
                  height="350"
                  id="gmap_canvas"
                  src="https://maps.google.com/maps?q=Broadway,%20New%20York&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                ></iframe>
              </div>
            </div>
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
                <li>
                  <input type="text" placeholder="Name" name="contact_name" className="cf-form-control" />
                  <span></span>
                </li>
                <li>
                  <input type="text" placeholder="Email" name="contact_email" className="cf-form-control" />
                  <span></span>
                </li>
                <li>
                  <input type="text" placeholder="Phone" name="contact_phone" className="cf-form-control" />
                  <span></span>
                </li>
                <li>
                  <select name="contact_subject" className="cf-form-control colored">
                    <option value="Choose Services">Choose Service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Application">Mobile Application</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </li>
                <li id="text-area-w">
                  <textarea placeholder="Message" name="contact_message" className="cf-form-control"></textarea>
                </li>
                <li id="enter_code">
                  <span id="txtCaptchaSpan"></span>
                  <input type="text" className="cf-form-control" name="contact_question" id="txtInput" autoComplete="off" placeholder="Please Enter Code *" />
                  <input type="hidden" id="txtCaptcha" />
                </li>
              </ul>
              <div className="arlo_tm_button">
                <a href="#" id="send_message">
                  <span className="back">Send Message</span>
                  <span className="front">Send Message</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactSection; 