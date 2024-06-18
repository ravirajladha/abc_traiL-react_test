import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';

import { ContentFormWrapper, ContentHeader } from '@/components/common';
import { SelectInput } from '@/components/common/form';
import { ELAB_LANGUAGES } from '@/utils/constants';

import { fetchClasses, fetchSubjects } from '@/api/dropdown';
import { createElab } from '@/api/admin';

function Create({ title }) {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  //setting the form data empty initially
  const initialFormData = {
    selectedClass: '',
    selectedSubject: '',
    selectedLanguage: null,
    elabName: '',
    // code: '',
    description: '',
    io_format:'',
    constraints: '',
    sampleIO: '',
    pseudocode: '',
    template1: '',
    template2: '',
    dataHarnessCode: '',
    testcase: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Function to reset the form data
  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchClassDropdownData = useCallback(() => {
    fetchClasses()
      .then((data) => {
        setClasses(data.classes);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    fetchClassDropdownData();
  }, [fetchClassDropdownData]);

  const fetchSubjectsDropdownData = useCallback((classId) => {
    fetchSubjects(classId)
      .then((data) => {
        setSubjects(data.subjects);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form details', formData);
    try {
      const response = await createElab(formData);
      toast.success('Elab added successfully', response);
      //resetting the form data
      resetFormData();
      navigate('/admin/elabs/create');
    } catch (error) {
      console.log('error', error.validationErrors);
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
      toast.error(error.message);
    }
  };

  const handleClassChange = ({ target: { value } }) => {
    console.log('classId', value);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      selectedClass: '',
    }));
    setFormData({
      selectedClass: value,
      selectedSubject: '',
    });

    fetchSubjectsDropdownData(value);
  };
  const handleSubjectChange = (event) => {
    console.log('subject value', event.target.value);
    const selectedSubjectId = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      selectedSubject: selectedSubjectId,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      selectedSubject: '',
    }));

    const selectedSubject = event.target.value;
    setFormData((prevData) => ({ ...prevData, selectedSubject }));
  };
  // const handleLanguageChange = (event) => {
  //   const selectedLanguageId = event.target.value; // Get the selected language ID
  //   const selectedLanguage = ELAB_LANGUAGES.find(
  //     (language) => language.id === parseInt(selectedLanguageId)
  //   );
  //   setFormData({ ...formData, selectedLanguage }); // Update the selectedLanguage in the form data
  // };

  // const handleLanguageChange = (event) => {
  //   const selectedLanguageId = event.target.value; // Get the selected language ID
  //   const selectedLanguage = ELAB_LANGUAGES.find(language => language.id === parseInt(selectedLanguageId));
  //   setFormData({ ...formData, selectedLanguage: selectedLanguage.value }); // Update the selectedLanguage in the form data with it

  const handleLanguageChange = (event) => {
    const selectedLanguageId = event.target.value; // Get the selected language ID
    const selectedLanguage = ELAB_LANGUAGES.find(language => language.id === parseInt(selectedLanguageId));
    setFormData({ ...formData, selectedLanguage: JSON.stringify(selectedLanguage) }); // Update the selectedLanguage in the form data and stringify it
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };
  // onChange={handleFormChange}
  const handleFormSpecialChange = (value, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  // console.log("title", title)

  return (
    <div>
      <ContentHeader title={title} />
      <ContentFormWrapper formTitle="New eLab">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Select Class */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Select Class
                </label>
                <SelectInput
                  className="form-cdgdntrol"
                  options={classes}
                  name="selectedClass"
                  label="name"
                  value={formData.selectedClass}
                  onChange={handleClassChange}
                  placeholder="Select Class"
                />
                {validationErrors.selectedClass && (
                  <span className="text-danger">
                    {validationErrors.selectedClass}
                  </span>
                )}
              </div>
            </div>

            {/* Select Subject */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Select Subject
                </label>

                <SelectInput
                  className="form-control"
                  options={subjects}
                  name="selectedSubject"
                  label="name"
                  value={formData.selectedSubject || ''}
                  onChange={handleSubjectChange}
                  placeholder="Select Subject"
                />
                {validationErrors.selectedSubject && (
                  <span className="text-danger">
                    {validationErrors.selectedSubject}
                  </span>
                )}
              </div>
            </div>

            {/* Select Language */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Select Language
                </label>

                <select
                  className="form-control"
                  name="selectedLanguage"
                  value={
                    formData.selectedLanguage
                      ? formData.selectedLanguage.id
                      : ''
                  }
                  onChange={handleLanguageChange}
                >
                  <option value="">Select Language</option>
                  {ELAB_LANGUAGES.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.name}
                    </option>
                  ))}
                </select>

                {validationErrors.selectedLanguage && (
                  <span className="text-danger">
                    {validationErrors.selectedLanguage}
                  </span>
                )}

                {/* <SelectInput
                  className="form-control"
                  options={ELAB_LANGUAGES}
                  label="language"
                  name="selectedLanguage"
                  value={formData.selectedSubject || ''}
                  onChange={handleSubjectChange}
                  placeholder="Select Subject"
                />
                {validationErrors.selectedSubject && (
                  <span className="text-danger">
                    {validationErrors.selectedSubject}
                  </span>
                )} */}
              </div>
            </div>

            {/* Elab Name */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Elab name</label>
                <input
                  type="text"
                  name="elabName"
                  value={formData.elabName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter Elab Name"
                />
                 {validationErrors.elabName && (
                  <span className="text-danger">
                    {validationErrors.elabName}
                  </span>
                )}
              </div>
            </div>

            {/* Code AceEditor */}
            {/* <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Langauge</label>
                <AceEditor
                  mode="java"
                  theme="github"
                  name="code"
                  onChange={(value) => handleFormSpecialChange(value, 'code')}
                  value={formData.code}
                  editorProps={{ $blockScrolling: true }}
                  // Add onChange handler if needed
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  className="w-100 h200 font-xss"
                />
                 {validationErrors.code && (
                  <span className="text-danger">
                    {validationErrors.code}
                  </span>
                )}
              </div>
            </div> */}

            {/* Description Textarea */}
            <div className="col-12">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter description here"
                  rows="3"
                ></textarea>
                 {validationErrors.description && (
                  <span className="text-danger">
                    {validationErrors.description}
                  </span>
                )}
              </div>
            </div>

            {/* Textarea I/O Format */}
            

            {/* Constraints Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
               I/O Format
                </label>
                <textarea
                  className="form-control"
                  name="io_format"
                  value={formData.io_format}
                  onChange={handleFormChange}
                  placeholder="Enter I/o Format here"
                  rows="3"
                ></textarea>
                 {validationErrors.io_format && (
                  <span className="text-danger">
                    {validationErrors.io_format}
                  </span>
                )}
              </div>
            </div>
            {/* Constraints Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Constraints
                </label>
                <textarea
                  className="form-control"
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleFormChange}
                  placeholder="Enter constraints here"
                  rows="3"
                ></textarea>
                 {validationErrors.constraints && (
                  <span className="text-danger">
                    {validationErrors.constraints}
                  </span>
                )}
              </div>
            </div>

            {/* Sample I/O Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Sample I/O</label>
                <textarea
                  className="form-control"
                  name="sampleIO"
                  value={formData.sampleIO}
                  onChange={handleFormChange}
                  placeholder="Enter sample I/O here"
                  rows="3"
                ></textarea>
                 {validationErrors.sampleIO && (
                  <span className="text-danger">
                    {validationErrors.sampleIO}
                  </span>
                )}
              </div>
            </div>

            {/* Pseudocode Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Pseudocode</label>
                <AceEditor
                  mode="java"
                  theme="github"
                  name="pseudocode"
                  onChange={(value) =>
                    handleFormSpecialChange(value, 'pseudocode')
                  }
                  value={formData.pseudocode}
                  placeholder="Enter pseudocode here"
                  editorProps={{ $blockScrolling: true }}
                  // Add onChange handler if needed
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  className="w-100 h200 font-xss"
                />
                 {validationErrors.pseudocode && (
                  <span className="text-danger">
                    {validationErrors.pseudocode}
                  </span>
                )}
              </div>
            </div>

            {/* Template 1 Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Template 1</label>
                <AceEditor
                  mode="java"
                  theme="github"
                  name="template1"
                  placeholder="Enter template 1 here"
                  editorProps={{ $blockScrolling: true }}
                  onChange={(value) =>
                    handleFormSpecialChange(value, 'template1')
                  }
                  value={formData.template1}
                  // Add onChange handler if needed
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  className="w-100 h200 font-xss"
                />
                 {validationErrors.template1 && (
                  <span className="text-danger">
                    {validationErrors.template1}
                  </span>
                )}
              </div>
            </div>

            {/* Template 2 Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Template 2</label>
                <AceEditor
                  mode="java"
                  theme="github"
                  name="template2"
                  placeholder="Enter template 2 here"
                  editorProps={{ $blockScrolling: true }}
                  onChange={(value) =>
                    handleFormSpecialChange(value, 'template2')
                  }
                  value={formData.template2}
                  // Add onChange handler if needed
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  className="w-100 h200 font-xss"
                />
                 {validationErrors.template2 && (
                  <span className="text-danger">
                    {validationErrors.template2}
                  </span>
                )}
              </div>
            </div>

            {/* Data Harness Code Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">
                  Data Harness Code
                </label>
                <AceEditor
                  placeholder="Enter data harness code here"
                  mode="java"
                  theme="github"
                  name="dataHarnessCode"
                  onChange={(value) =>
                    handleFormSpecialChange(value, 'dataHarnessCode')
                  }
                  value={formData.dataHarnessCode}
                  editorProps={{ $blockScrolling: true }}
                  // Add onChange handler if needed
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  className="w-100 h200 font-xss"
                />
                 {validationErrors.dataHarnessCode && (
                  <span className="text-danger">
                    {validationErrors.dataHarnessCode}
                  </span>
                )}
              </div>
            </div>

            {/* Testcase Textarea */}
            <div className="col-6">
              <div className="form-group">
                <label className="mont-font fw-600 font-xsss">Testcase</label>
                <textarea
                  className="form-control "
                  name="testcase"
                  onChange={handleFormChange}
                  value={formData.testcase}
                  placeholder="Enter testcase JSON here"
                  rows="3"
                ></textarea>
                 {validationErrors.testcase && (
                  <span className="text-danger">
                    {validationErrors.testcase}
                  </span>
                )}
              </div>
            </div>
            <div className="col-lg-12">
              <button
                type="submit"
                className="btn bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-lg d-inline-block border-0 float-right"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mr-2"
                  />
                ) : (
                  <>
                    <i className="feather-save mr-2"></i> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
      </ContentFormWrapper>
    </div>
  );
}

Create.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Create;
