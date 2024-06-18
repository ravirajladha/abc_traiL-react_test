import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';

import { ContentFormWrapper, ContentHeader, ContentLoader } from '@/components/common';
import { SelectInput } from '@/components/common/form';

import { fetchClasses, fetchSubjects } from '@/api/dropdown';
import { editTestQuestion, fetchTestQuestionDetails } from '@/api/admin';

function Edit({ title }) {
  const navigate = useNavigate();
  const { questionId } = useParams();

  const [loading, setLoading] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [formData, setFormData] = useState({
    selectedClass: '',
    selectedSubject: '',
    question: '',
    code: '',
    option_one: '',
    option_two: '',
    option_three: '',
    option_four: '',
    answer_key: '',
  });
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

  const fetchSubjectsDropDown = useCallback((classId) => {
    fetchSubjects(classId)
      .then((data) => {
        setSubjects(data.subjects);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleClassChange = ({ target: { value } }) => {
    setFormData((prevData) => ({ ...prevData, selectedClass: value }));
    fetchSubjectsDropDown(value);
  };

  const handleSubjectChange = (event) => {
    const selectedSubject = event.target.value;
    setFormData((prevData) => ({ ...prevData, selectedSubject }));
  };

  const handleOptionChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      answer_key: value === prevData.answer_key ? '' : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await editTestQuestion(questionId, formData);
      toast.success(response.message);
      setShowCodeInput(false);
      setFormData({
        ...formData,
        selectedClass: '',
        selectedSubject: '',
        question: '',
        code: '',
        option_one: '',
        option_two: '',
        option_three: '',
        option_four: '',
        answer_key: '',
      });
      navigate('/admin/tests/question-bank');
    } catch (error) {
      if (error.validationErrors) {
        if (Array.isArray(error.validationErrors.answer_key)) {
          error.validationErrors.answer_key.forEach((errorMessage) =>
            toast.error(errorMessage)
          );
        }

        setValidationErrors(error.validationErrors);
      } else {
        toast.error(error.message);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 300);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchQuestionDetails = useCallback(() => {
    fetchTestQuestionDetails(questionId)
      .then((response) => {
        const questionDetails = response.term_test_question;
        setFormData({
          selectedClass: questionDetails.class_id.toString(),
          selectedSubject: questionDetails.subject_id.toString(),
          question: questionDetails.question,
          code: questionDetails.code || '',
          option_one: questionDetails.option_one,
          option_two: questionDetails.option_two,
          option_three: questionDetails.option_three,
          option_four: questionDetails.option_four,
          answer_key: questionDetails.answer_key,
        });
        fetchSubjectsDropDown(questionDetails.class_id);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [questionId, fetchSubjectsDropDown]);

  useEffect(() => {
    fetchClassDropdownData();
    fetchQuestionDetails();
  }, [fetchClassDropdownData, fetchQuestionDetails]);
  return (
    <div>
      <ContentHeader title={title} />
      <ContentFormWrapper formTitle="Term Test Question">
        {loading ? (
          <div className="py-5">
            <ContentLoader />
          </div>
        ) : (
          <form className="contact_form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 mb-2">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                    Select Class
                  </label>
                  <SelectInput
                    className="form-control"
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

              <div className="col-lg-6 mb-2">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                    Select Subject
                  </label>
                  <SelectInput
                    className="form-control"
                    options={subjects}
                    name="selectedSubject"
                    label="name"
                    value={formData.selectedSubject}
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

              <div className="col-sm-12">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">
                    Question *
                    <span
                      className={`btn btn-sm ${
                        !!formData.code || showCodeInput
                          ? 'bg-danger'
                          : 'bg-success'
                      } text-white ml-2 mb-2`}
                      onClick={() => setShowCodeInput(!showCodeInput)}
                    >
                      {showCodeInput ? (
                        <>
                          <span className="feather-minus mr-1"></span>
                        </>
                      ) : (
                        <>
                          <span className="feather-plus mr-1"></span>
                        </>
                      )}
                      Code
                    </span>
                  </label>
                  <textarea
                    name="question"
                    className="form-control mb-0 p-3 h100 lh-16"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter Question *"
                  ></textarea>

                  {validationErrors.question && (
                    <span className="text-danger">
                      {validationErrors.question}
                    </span>
                  )}
                </div>
              </div>

              {showCodeInput ||
                (!!formData.code && (
                  <div className="col-md-12 mb-4">
                    <label className="form-label mont-font fw-600 font-xsss">
                      Code:{' '}
                    </label>
                    <AceEditor
                      mode="java"
                      theme="github"
                      name="code"
                      editorProps={{ $blockScrolling: true }}
                      value={formData.code}
                      onChange={(newValue) =>
                        setFormData({ ...formData, code: newValue })
                      }
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                      className="w-100 h200"
                    />
                  </div>
                ))}
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-check d-flex mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="optionsRadio"
                      id="option_one"
                      value="option_one"
                      checked={formData.answer_key === 'option_one'}
                      onChange={handleOptionChange}
                    />

                    <label
                      className="form-check-label mont-font fw-600 font-xsss"
                      htmlFor="option_one"
                    >
                      Option 1
                    </label>
                  </div>
                  <textarea
                    name="option_one"
                    className="form-control mb-0 p-3 h100 lh-16"
                    value={formData.option_one}
                    onChange={handleInputChange}
                    placeholder="Enter Option 1*"
                  ></textarea>
                  {validationErrors.option_one && (
                    <span className="text-danger">
                      {validationErrors.option_one}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-check d-flex mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="optionsRadio"
                      id="option_two"
                      value="option_two"
                      checked={formData.answer_key === 'option_two'}
                      onChange={handleOptionChange}
                    />

                    <label
                      className="form-check-label mont-font fw-600 font-xsss"
                      htmlFor="option_two"
                    >
                      Option 2
                    </label>
                  </div>
                  <textarea
                    name="option_two"
                    className="form-control mb-0 p-3 h100 lh-16"
                    value={formData.option_two}
                    onChange={handleInputChange}
                    placeholder="Enter Option 2*"
                  ></textarea>
                  {validationErrors.option_two && (
                    <span className="text-danger">
                      {validationErrors.option_two}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-check d-flex mb-2">
                    <input
                      className="form-check-input "
                      type="radio"
                      name="optionsRadio"
                      id="option_three"
                      value="option_three"
                      checked={formData.answer_key === 'option_three'}
                      onChange={handleOptionChange}
                    />

                    <label
                      className="form-check-label mont-font fw-600 font-xsss"
                      htmlFor="option_three"
                    >
                      Option 3
                    </label>
                  </div>
                  <textarea
                    name="option_three"
                    className="form-control mb-0 p-3 h100 lh-16"
                    value={formData.option_three}
                    onChange={handleInputChange}
                    placeholder="Enter Option 3*"
                  ></textarea>
                  {validationErrors.option_three && (
                    <span className="text-danger">
                      {validationErrors.option_three}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <div className="form-check d-flex mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="optionsRadio"
                      value="option_four"
                      id="option_four"
                      checked={formData.answer_key === 'option_four'}
                      onChange={handleOptionChange}
                    />

                    <label
                      className="form-check-label mont-font fw-600 font-xsss"
                      htmlFor="option_four"
                    >
                      Option 4
                    </label>
                  </div>
                  <textarea
                    name="option_four"
                    className="form-control mb-0 p-3 h100 lh-16"
                    value={formData.option_four}
                    onChange={handleInputChange}
                    placeholder="Enter Option 4*"
                  ></textarea>
                  {validationErrors.option_four && (
                    <span className="text-danger">
                      {validationErrors.option_four}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-lg-12 mb-2 mt-2 pl-0">
                <button
                  type="submit"
                  className="btn bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-lg d-inline-block border-0 float-right"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      {' '}
                      <Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="mr-2"
                      />
                    </>
                  ) : (
                    <>
                      <i className="feather-save mr-2"></i> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </ContentFormWrapper>
    </div>
  );
}

Edit.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Edit;
