import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles" className="sp-text">
          Explore Developers
        </Link>
      </li>
      <li>
        <Link to="/posts" className="sp-text">
          Posts
        </Link>
      </li>
      <li>
        <Link to="/dashboard" className="sp-text">
          Dashboard
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!" className="sp-text">
          Logout
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles" className="sp-text">
          Explore Developers
        </Link>
      </li>
      <li>
        <Link to="/register" className="sp-text">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="sp-text">
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/" className="DevKonnect">
          <i className="fas fa-code"></i> DevKonnect
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
