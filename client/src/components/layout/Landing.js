import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large DevKonnect">DevKonnect</h1>
          <p className="lead sp-text">
            Connecting Technical Enthusiasts
            <br></br>
            <br></br>
            Create interesting post | Help others | Discuss Technology
          </p>
          <div className="buttons">
            <Link to="/register">
              <input
                type="button"
                className="btn btn-primary"
                value="Register"
              />
            </Link>
            <Link to="/login">
              <input type="button" className="btn btn-light" value="Login" />
            </Link>
          </div>
          <p className="myfooter sp-text ">
            {' '}
            <a
              href="https://www.linkedin.com/in/kshitiz-kumar/"
              target="_blank">
              Created By: Kshitiz Kumar
            </a>{' '}
            |{' '}
            <a href="https://github.com/kshitizified" target="_blank">
              Github
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
