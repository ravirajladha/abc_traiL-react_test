import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchTestQuestions, deleteTestQuestion } from '@/api/admin';
import { fetchClasses, fetchSubjects } from '@/api/dropdown';

import { ContentHeader, ContentLoader } from '@/components/common';
import { TestQuestionShowModal } from '@/components/admin/term-test';
import ContentSelectFilter from '@/components/common/ContentSelectFilter';

function TermTestQuestionBank({ title }) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);

  const fetchClassDropdownData = useCallback(() => {
    fetchClasses()
      .then((data) => {
        setClasses(data.classes);
      })
      .catch((error) => {
        console.error(error.message);
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
        console.error(error.message);
      });
  }, []);

  const handleClassChange = ({ target: { value } }) => {
    setSelectedClass(value);
    setSubjects([]);
    setSelectedSubject();
    if (value) {
      fetchSubjectsDropdownData(value);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleShowModal = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const data = await fetchTestQuestions(selectedClass, selectedSubject);
      setQuestions(data.term_test_questions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching term test questions:', error);
      setLoading(false);
    }
  }, [setQuestions, setLoading, selectedClass, selectedSubject]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (questionId) => {
    Swal.fire({
      title: 'Confirm!',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      text: 'Do you want to delete this question?',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteTestQuestion(questionId);
          if (!response.status) {
            toast.error(response.message);
          } else {
            toast.success(response.message);
          }
          fetchQuestions();
        } catch (error) {
          console.error('Error deleting term test question:', error);
        }
      }
    });
  };

  return (
    <>
      <ContentHeader
        title={title}
        buttons={[
          {
            link: 'create',
            text: 'New Question',
          },
        ]}
        backLink={`/admin/tests`}
      />
      {loading ? (
        <div className="text-center mt-5 col-12">
          <ContentLoader />
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-12">
            <div className="card border-0 mt-0 rounded-lg shadow-sm">
              <div className="card-body d-flex align-items-center justify-content-between pt-4 px-4 pb-0">
                <h4 className="font-xss text-grey-800 mt-3 fw-700">{title}</h4>
                <div className="d-flex g-4">
                  <ContentSelectFilter
                    options={classes}
                    name="selectedClass"
                    label="name"
                    value={selectedClass || ''}
                    onChange={handleClassChange}
                    defaultText="All Classes"
                    className="float-right filter mr-2"
                  />
                  <ContentSelectFilter
                    options={subjects}
                    name="selectedClass"
                    label="name"
                    value={selectedSubject || ''}
                    onChange={handleSubjectChange}
                    placeholder="Select a Subject"
                    defaultText="All Subjects"
                    className="float-right filter mr-2"
                  />
                </div>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-admin mb-0">
                    <thead className="bg-greylight rounded-10">
                      <tr>
                        <th className="border-0" scope="col" width="10%">
                          Sl. No.
                        </th>
                        <th className="border-0" scope="col">
                          Question
                        </th>
                        <th className="border-0" scope="col" width="10%">
                          Class
                        </th>
                        <th className="border-0" scope="col" width="10%">
                          Subject
                        </th>
                        <th
                          scope="col"
                          className="text-right border-0 pl-1"
                          width="15%"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions && questions?.length > 0 ? (
                        questions.map((question, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{question.question}</strong>
                            </td>
                            <td>{question.class}</td>
                            <td>{question.subject}</td>
                            <td className="text-right">
                              <Link
                                to="#"
                                onClick={() => handleShowModal(question)}
                                className="btn btn-outline-warning btn-icon btn-sm mr-2"
                              >
                                <i className="feather-eye"></i>
                              </Link>
                              <Link
                                to={`${question.id}/edit`}
                                className="btn btn-outline-primary btn-icon btn-sm mr-2"
                              >
                                <i className="feather-edit"></i>
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-outline-danger btn-icon btn-sm"
                                onClick={() => handleDelete(question.id)}
                              >
                                <i className="feather-trash"></i>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            There are no term test questions available at the
                            moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <TestQuestionShowModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedQuestion={selectedQuestion}
      />
    </>
  );
}

TermTestQuestionBank.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TermTestQuestionBank;
