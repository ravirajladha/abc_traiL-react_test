import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchTeacher, editTeacher } from '@/api/school';

import { ContentCardWrapper, ContentHeader } from '@/components/common';

function Edit() {
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const fileInputRef = useRef();

  const [validationErrors, setValidationErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    emp_id: '',
    profile_image: '',
    doj: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
  });

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetchTeacher(teacherId);
      const data = response.teacher;
      if (data) {
        const updatedForm = {
          name: data.name || '',
          emp_id: data.emp_id || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          password: data.password || '',
        };
        setForm(updatedForm);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      submissionData.append('_method', 'PUT');
      submissionData.append('name', form.name || '');
      submissionData.append('email', form.email || '');
      submissionData.append('phone_number', form.phone_number || '');
      submissionData.append('password', form.password || '');
      if (form.profile_image) {
        submissionData.append('profile_image', form.profile_image);
        submissionData.append('profile_image_name', form.profile_image_name);
      }
      const response = await editTeacher(teacherId, submissionData);
      toast.success('Teacher updated successfully', response);
      navigate('/school/teachers');
    } catch (error) {
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
      toast.error(error.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone_number') {
      newValue = value.replace(/\D/g, '');
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10);
      }
    }
    setForm((prevState) => ({ ...prevState, [name]: newValue }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setForm((prevFormData) => ({
        ...prevFormData,
        profile_image: file,
        profile_image_name: file.name,
      }));
    }
  };

  return (
    <div className="px-2">
      <ContentHeader title="Edit" subtitle="Teacher" />

      <ContentCardWrapper>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter Name"
                />
                {validationErrors.name && (
                  <span className="text-danger">{validationErrors.name}</span>
                )}
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Employee ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="emp_id"
                  value={form.emp_id}
                  onChange={handleFormChange}
                  placeholder="Enter Employee ID"
                />
                {validationErrors.emp_id && (
                  <span className="text-danger">{validationErrors.emp_id}</span>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Enter Email"
                />
                {validationErrors.email && (
                  <span className="text-danger">{validationErrors.email}</span>
                )}
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleFormChange}
                  placeholder="Enter Password"
                />
                {validationErrors.password && (
                  <span className="text-danger">
                    {validationErrors.password}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <div className="form-group">
                <label className="mont-font form-label fw-600 font-xsss">
                  Profile Image
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Select Profile Image"
                  value={form.profile_image_name}
                  onClick={() => fileInputRef.current.click()}
                  readOnly
                />
                <input
                  type="file"
                  className="custom-file-input"
                  name="profile_image"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                {validationErrors.profile_image && (
                  <span className="text-danger">
                    {validationErrors.profile_image}
                  </span>
                )}
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleFormChange}
                  placeholder="Enter Employee ID"
                />
                {validationErrors.phone_number && (
                  <span className="text-danger">{validationErrors.phone_number}</span>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-12 mb-0 mt-2 pl-0">
            <button
              type="submit"
              className="bg-current border-0 text-center float-right text-white font-xsss fw-600 p-3 w150 rounded-lg d-inline-block"
            >
              <i className="feather-save mr-2"></i> Save
            </button>
          </div>
        </form>
      </ContentCardWrapper>
    </div>
  );
}

export default Edit;
