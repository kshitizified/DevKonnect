import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profile';

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const { company, title, location, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  return (
    <Fragment>
      <div className="mycontainer">
        <Link className="btn btn-dark my-1" to="/dashboard">
          Go Back
        </Link>
        <h1 className="large text-primary">Add An Experience</h1>
        <p className="lead">
          <i className="fas fa-code-branch"></i> Add any developer/programming
          positions that you have had in the past
        </p>

        <form
          className="form"
          onSubmit={(e) => {
            window.scrollTo(0, 0);
            e.preventDefault();
            addExperience(formData, history);
          }}>
          <div className="form-group">
            <span class="label label-success">Required</span>
            <input
              type="text"
              placeholder="Job Title"
              name="title"
              value={title}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <span class="label label-success">Required</span>
            <input
              type="text"
              placeholder="Company"
              name="company"
              value={company}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <span class="label label-warning">Optional</span>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={location}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group">
            <span class="label label-success">Required</span>
            <h4>From Date</h4>
            <input
              type="date"
              name="from"
              value={from}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group">
            <span class="label label-default label-margin-zero">
              Conditional
            </span>
            <p>
              <input
                type="checkbox"
                name="current"
                checked={current}
                value={current}
                onChange={(e) => {
                  setFormData({ ...formData, current: !current });
                  toggleDisabled(!toDateDisabled);
                }}
              />{' '}
              {'  '}Current Job
            </p>
          </div>
          <div className="form-group">
            <span class="label label-default label-margin-zero">
              Conditional
            </span>
            <h4>To Date</h4>
            <input
              type="date"
              name="to"
              value={to}
              onChange={(e) => onChange(e)}
              disabled={toDateDisabled ? 'disabled' : ''}
            />
          </div>
          <div className="form-group">
            <span class="label label-warning">Optional</span>
            <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="Job Description"
              value={description}
              onChange={(e) => onChange(e)}></textarea>
          </div>
          <input
            type="submit"
            className="btn btn-primary my-1"
            value="Add My Experience"
          />
          <Link className="btn btn-dark my-1" to="/dashboard">
            Go Back
          </Link>
        </form>
      </div>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
};

export default connect(null, { addExperience })(withRouter(AddExperience));
