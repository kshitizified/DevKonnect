import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = formData;

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
        <h1 className="large text-primary">Add Your Education</h1>
        <p className="lead">
          <i className="fas fa-code-branch"></i> Add any school, bootcamp,
          college etc. that you have attended
        </p>
        <form
          className="form"
          onSubmit={(e) => {
            window.scrollTo(0, 0);
            e.preventDefault();
            addEducation(formData, history);
          }}>
          <div className="form-group">
            <span class="label label-success">Required</span>
            <input
              type="text"
              placeholder="School,Bootcamp, College etc."
              name="school"
              value={school}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <span class="label label-success">Required</span>
            <input
              type="text"
              placeholder="* Degree or Certificate"
              name="degree"
              value={degree}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <span class="label label-warning">Optional</span>
            <input
              type="text"
              placeholder="Field of Study"
              name="fieldofstudy"
              value={fieldofstudy}
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
              {'  '}I am currently studying here
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
              placeholder="Program Description"
              value={description}
              onChange={(e) => onChange(e)}></textarea>
          </div>
          <input type="submit" className="btn btn-primary my-1" />
          <Link className="btn btn-dark my-1" to="/dashboard">
            Go Back
          </Link>
        </form>
      </div>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
