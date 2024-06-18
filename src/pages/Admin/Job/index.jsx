import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import {
  ContentDisplayModal,
  ContentHeader,
  ContentLoader,
} from '@/components/common';

import { deleteJobDetails, fetchJobList } from '@/api/admin';
import { Link } from 'react-router-dom';
import { fetchClasses } from '@/api/dropdown';
import { getUserDataFromLocalStorage } from '@/utils/services';

function Job(props) {
  console.log('isadmin', props.isAdmin);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const userData = JSON.parse(getUserDataFromLocalStorage());
  console.log('userdata', userData);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [classes, setClasses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const getJobsList = useCallback(async () => {
    fetchJobList()
      .then((data) => {
        if (data) {
          setJobs(data.jobs);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    getJobsList();
  }, [getJobsList]);

  const handleDelete = useCallback(
    async (jobId) => {
      Swal.fire({
        title: 'Confirm!',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        text: 'Do you want to delete this job post?',
        icon: 'warning',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await deleteJobDetails(jobId);
            getJobsList();
            toast.success(response.message);
          } catch (error) {
            toast.error(error.message);
          }
        }
      });
    },
    [getJobsList]
  );

  const handleShowModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(!showModal);
  };

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
  
  const getClassNames = (classIds) => {
    const ids = classIds.split(',');
    const classNames = ids
      .map((id) => {
        const classObj = classes.find((cls) => cls.id === parseInt(id));
        return classObj ? classObj.name : null;
      })
      .filter((name) => name !== null)
      .join(', ');

    return classNames;
  };
  return (
    <>

      {/* <ContentHeader
        title="Jobs"
        backLink="/admin/dashboard"
        buttons={[
          {
            link: 'create',
            text: 'New Job Post',
          },
        ]}
      /> */}
      <ContentHeader
        title="Jobs"
        backLink={props.isAdmin ? '/admin/dashboard' : '/recruiter/dashboard'}

        buttons={[
          {
            link: 'tests',
            text: 'Tests',
          },
          {
            link: 'create',
            text: 'New Job Post',
          },
        ]}
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
                <h4 className="font-xss text-grey-800 mt-3 fw-700">
                  All Job Posts
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-admin mb-0 ">
                    <thead className="bg-greylight rounded-10 ">
                      <tr>
                        <th className="border-0" scope="col">
                          #
                        </th>
                        <th className="border-0" scope="col">
                          Name
                        </th>
                        <th className="border-0" scope="col">
                          Class
                        </th>
                        <th className="border-0" scope="col">
                          Test
                        </th>
                        <th className="border-0" scope="col">
                          Recruiter
                        </th>
                        <th
                          scope="col"
                          className="text-right border-0 pl-1"
                          width="25%"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    {jobs && jobs?.length > 0 ? (
                      <tbody>
                        {jobs?.map((job, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{job.title}</strong>
                            </td>
                            <td>{getClassNames(job?.class_id)}</td>
                            <td>
                            <strong>{job.test_name ? job.test_name : 'N/a'}</strong>
                            </td>
                            <td>
                              <strong>{job.recruiter_name}</strong>
                            </td>
                            <td className="text-right">
                              <Link
                                to="#"
                                onClick={() => handleShowModal(job)}
                                className="btn btn-outline-warning btn-icon btn-sm mr-2"
                              >
                                <i className="feather-eye"></i>
                              </Link>

                              <Link
                                to={`${job.id}/edit`}
                                className="btn btn-outline-primary btn-icon btn-sm mr-2"
                              >
                                <i className="feather-edit"></i>
                              </Link>

                              <Link
                                to={`${job.id}/applications`}
                                className="btn btn-outline-success btn-icon btn-sm mr-2"
                              >
                                <i className="feather-file"></i>
                              </Link>

                              <Link
                                to="#"
                                className="btn btn-outline-danger btn-icon btn-sm"
                                onClick={() => handleDelete(job.id)}
                              >
                                <i className="feather-trash"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan="5" className="text-center">
                            There are no jobs available at the moment.
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ContentDisplayModal
        show={showModal}
        handleClose={handleCloseModal}
        title="Job Details"
        content={
          <>
            {' '}
            <div className="row">
              <div className="col-12">
                <div className="card mb-4 d-block w-100 shadow-xss rounded-lg p-xxl-5 p-4 border-0 text-center">
                  <a
                    href="#"
                    className="btn-round-xxxl rounded-lg bg-lightblue ml-auto mr-auto"
                  >
                    <img
                      src={baseUrl + selectedJob?.image}
                      alt="image"
                      className="p-1"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </a>

                  <h4 className="fw-700 font-xs my-3">{selectedJob?.title}</h4>
                  <p className="fw-500 font-xssss text-grey-500 mt-3">
                    {selectedJob?.description}
                  </p>
                  <div className="clearfix"></div>
                  <span className="font-xsssss fw-700 pl-3 pr-3 lh-32 text-uppercase rounded-lg ls-2 alert-success d-inline-block text-dark mb-1 mr-2 ls-3">
                    ₹&emsp;{selectedJob?.annual_ctc}
                  </span>
                  <span className="font-xsssss fw-700 pl-3 pr-3 lh-32 text-uppercase rounded-lg ls-2 bg-light d-inline-block text-grey-800 mb-1 mr-2">
                    <i className="feather-pocket"></i>&emsp;{' '}
                    {selectedJob?.criteria}
                  </span>
                  <span className="font-xsssss fw-700 pl-3 pr-3 lh-32 text-uppercase rounded-lg ls-2 alert-info d-inline-block text-dark mb-1">
                    <i className="feather-map-pin"></i>&emsp;{' '}
                    {selectedJob?.location}
                  </span> 
                  {/* <p className="fw-500 font-xssss text-grey-500 mt-3">
                    {selectedJob?.instruction}
                  </p> */}
                  <div
                      dangerouslySetInnerHTML={{
                        __html: selectedJob?.instruction,
                      }}
                      style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                    />
                  
                </div>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}

export default Job;
