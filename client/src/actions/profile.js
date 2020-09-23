import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  GET_GITHUB_REPOS,
} from './types';

// Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
  var username = '';
  try {
    const res = await axios.get('/api/profile/me');
    username = res.data.user.name;
    dispatch(setAlert(`Welcome ${username}`, 'success'));
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_PROFILE });

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  try {
    const res = await axios.get('/api/profile');
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get a profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get the github repos
export const getGithubRepos = (githubUsername) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${githubUsername}`);
    console.log(res.data);
    dispatch({
      type: GET_GITHUB_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Acion to create or update a profile
export const createProfile = (FormData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', FormData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(
      setAlert(
        edit ? 'Profile Updated Successfully' : 'Profile Created Successfully',
        'success'
      )
    );

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Action to add experience
export const addExperience = (FormData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/experience', FormData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(
      setAlert(
        'Your experience is successfully added to your awesome profile',
        'success'
      )
    );
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Action to add education
export const addEducation = (FormData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/education', FormData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(
      setAlert(
        'Your education is successfully added to your awesome profile',
        'success'
      )
    );
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Action to Delete an Experience
export const deleteExperience = (id) => async (dispatch) => {
  if (
    window.confirm(
      'Are you sure want to DELETE THIS EXPERIENCE DETAIL ? Deleting can not be undone in future'
    )
  ) {
    try {
      const res = await axios.delete(`/api/profile/experience/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert('Your experience is successfully deleted', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Action to Delete an Education
export const deleteEducation = (id) => async (dispatch) => {
  if (
    window.confirm(
      'Are you sure want to DELETE THIS EDUCATION DETAIL ? Deleting can not be undone in future'
    )
  ) {
    try {
      const res = await axios.delete(`/api/profile/education/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert('Your education is successfully deleted', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

// Action to DELETE account
export const deleteAccount = (id) => async (dispatch) => {
  if (
    window.confirm(
      'Are you sure want to DELETE YOUR ACCOUNT ? Deleting can not be undone in future'
    )
  ) {
    try {
      await axios.delete(`/api/profile`);

      dispatch({
        type: CLEAR_PROFILE,
      });

      dispatch({
        type: ACCOUNT_DELETED,
      });

      dispatch(setAlert('Your account is successfully deleted', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
