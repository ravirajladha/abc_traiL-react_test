import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ContentFormWrapper,
  ContentHeader,
  ContentLoader,
} from '@/components/common';
import { SaveButton, SelectInput } from '@/components/common/form';
import { getInternshipTaskDetail, editInternshipTask,getInternshipDetail } from '@/api/admin';
import { fetchSelectedActiveElabs } from '@/api/common';

function Edit(props) {
  const { title } = props;
  const navigate = useNavigate();
  const { internshipId, internshipTaskId } = useParams();
  console.log('id', internshipId, internshipTaskId);
  const [elabs, setElabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState(null);

  const [formData, setFormData] = useState({
    elabId: '',
    name: '',
    description: '',
    is_active: '',
  });
  console.log('descriopt', formData.is_active, formData.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // const fetchElabDropdownData = useCallback(() => {
  //   fetchActiveElabs()
  //     .then((data) => {
  //       setElabs(data);
  //     })
  //     .catch((error) => {
  //       toast.error(error.message);
  //     });
  // }, []);

  // useEffect(() => {
  //   fetchElabDropdownData();
  // }, [fetchElabDropdownData]);

  // // console.log("minip rojectis", internshipTaskId)
  // const fetchInternshipTaskData = useCallback(async () => {
  //   try {
  //     const miniProjectTaskData = await getInternshipTaskDetail(
  //       internshipTaskId
  //     );
  //     if (miniProjectTaskData) {
  //       const updatedForm = {
  //         elabId: miniProjectTaskData.elab_id || '',
  //         name: miniProjectTaskData.name || '',
  //         description: miniProjectTaskData.description || '',
  //         is_active: miniProjectTaskData.is_active, // Convert boolean to string
  //       };
  //       setFormData(updatedForm);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Internship Task data:', error);
  //     setLoading(false);
  //   }
  // }, [internshipTaskId]);

  // useEffect(() => {
  //   fetchInternshipTaskData();
  // }, [fetchInternshipTaskData]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mini project details
        const miniProjectDetailsResponse = await getInternshipDetail(internshipId);
        
        // Extract classId and subjectId from mini project details response
        const { class_id} = miniProjectDetailsResponse.miniProject;
  
        // Fetch elabs data using classId and subjectId
        const elabsResponse = await fetchSelectedActiveElabs(class_id);
        
        // Update state with fetched data
        setClassId(class_id);

        setElabs(elabsResponse.elabs);
  
        // Fetch mini project task data
        const miniProjectTaskData = await getInternshipTaskDetail(internshipTaskId);
        if (miniProjectTaskData) {
          const updatedForm = {
            elabId: miniProjectTaskData.elab_id || '',
            name: miniProjectTaskData.name || '',
            description: miniProjectTaskData.description || '',
            is_active: miniProjectTaskData.is_active, // Convert boolean to string
          };
          setFormData(updatedForm);
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    fetchData();
  }, [internshipId, internshipTaskId]);


  const handleElabChange = (selectedOption) => {
    const { value } = selectedOption.target; // Extract the value from the selected option
    setFormData((prevData) => ({ ...prevData, elabId: value })); // Update elabId in formData
    setValidationErrors(({ elabId: _, ...prevErrors }) => prevErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDropdownChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      is_active: selectedOption.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await editInternshipTask(internshipTaskId, formData);
      toast.success('Internship Task Updated Successfully', response.message);

      clearForm();
      setIsSubmitting(false);
      navigate(`/admin/internship-tasks/${internshipTaskId}`);
    } catch (error) {
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
      console.error('Error:', error.message);
      toast.error('Error submitting the form. Please try again.');
      setIsSubmitting(false);
    }
  };
  const clearForm = () => {
    setFormData({
      elabId: '',
      name: '',
      description: '',
      is_active: false,
    });
    setValidationErrors({});
  };
  return (
    <div>
      <ContentHeader title={title} />
      <ContentFormWrapper formTitle="Update Internship Task">
        {loading ? (
          <div className="my-5">
            <ContentLoader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 mb-2">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                    Select Elab <span className="text-danger">*</span>
                  </label>
                  <SelectInput
                    className="form-control"
                    options={elabs}
                    name="elabId"
                    label="title"
                    value={formData.elabId}
                    onChange={handleElabChange}
                    placeholder="Select Elab"
                  />
                  {validationErrors.elabId && (
                    <span className="text-danger">
                      {validationErrors.elabId}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-lg-6 mb-2">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                    Internship Task Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter  Internship Task Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {validationErrors.name && (
                    <span className="text-danger">{validationErrors.name}</span>
                  )}
                </div>
              </div>
           

              <div className="col-lg-12 mb-2">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control mb-0 p-3 h100 lh-16"
                    name="description"
                    placeholder="Enter Description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {validationErrors.description && (
                    <span className="text-danger">
                      {validationErrors.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-lg-12 mb-2">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                   Status
                  </label>
                  <select
                    className="form-control"
                    name="is_active"
                    value={formData.is_active}
                    onChange={handleDropdownChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <SaveButton isSubmitting={isSubmitting} />
            </div>
          </form>
        )}
      </ContentFormWrapper>
    </div>
  );
}
export default Edit;
