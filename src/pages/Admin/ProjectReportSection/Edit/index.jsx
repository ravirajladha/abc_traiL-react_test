import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { ContentFormWrapper, ContentHeader } from '@/components/common';
import {
  SaveButton,
} from '@/components/common/form';

import { useNavigate, useParams } from 'react-router-dom';
import { editProjectReportSection, fetchProjectReportSectionDetails } from '@/api/admin';
function Edit() {
  const { projectReportId, projectReportModuleId, projectReportSectionId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [sectionTitle, setSectionTitle] = useState(''); 

  const fetchData = async () => {
    try {
      const response = await fetchProjectReportSectionDetails(projectReportSectionId);
      setSectionTitle(response.projectReportSection.title);
      console.log(response);
    } catch (error) {
      toast.error(error.message);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append('sectionTitle', sectionTitle);
  
      const response = await editProjectReportSection(projectReportSectionId,submissionData);
      toast.success("Project Report Section updated successfully.");

      setSectionTitle('');
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
      navigate(`/admin/project-reports/${projectReportId}/modules/${projectReportModuleId}/sections`);
    } catch (error) {
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
      console.error('Error:', error.message);
      toast.error('Error submitting the form. Please try again.');
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <ContentHeader title="Edit Section" />
      <ContentFormWrapper formTitle="Edit Project Report Section">
        <form onSubmit={handleSubmit}>
            <div className="row" >
              <div className="col-lg-6 mb-2">
                <label className="mont-font fw-600 font-xsss">
                  Section Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Enter Section Title"
                  value={sectionTitle}
                  onChange={(e) => {
                    setSectionTitle(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
          <SaveButton isSubmitting={isSubmitting} />
        </form>
      </ContentFormWrapper>
    </>
  );
}

export default Edit;
