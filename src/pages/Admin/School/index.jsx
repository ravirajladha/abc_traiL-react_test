import { useState, useEffect } from 'react';
import { fetchSchools } from '@/api/admin';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { ContentLoader } from '@/components/common';

function School({ title, subtitle }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchools()
      .then((data) => {
        setSchools(data.schools);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-2">
      <div className="row mb-4">
        <div className="col-lg-12 d-flex align-items-center justify-content-between">
          <h2 className="text-grey-900 font-md mb-0">
            <span className="fw-600">All Schools</span>
          </h2>
          <div className="d-flex align-items-center">
            <Link
              to="create"
              className="btn ml-auto float-right border-0 d-flex fw-600 text-uppercase py-2 px-3 rounded-lg text-center font-xsss shadow-xs mr-2 text-white bg-primary-gradiant"
            >
              <span
                className="feather-plus font-xsss mr-1 fw-bolder"
                style={{ marginTop: '2.5px' }}
              ></span>
              Add School
            </Link>
          </div>
        </div>
      </div>

      {/* Contents */}

      <div className="row">
        {loading ? (
          <div className="text-center col-12">
            <ContentLoader />
          </div>
        ) : schools && schools.length > 0 ? (
          <div className="col-lg-12">
            <div className="card border-0 mt-0 rounded-lg shadow-xs">
              <div className="card-body d-flex px-4 pt-4 pb-0">
                <h4 className="font-xss text-grey-700">
                  All <strong className="fw-700"> Schools List</strong>{' '}
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-admin mb-0 ">
                    <thead className="bg-greylight rounded-10 ovh border-0">
                      <tr>
                        <th className="border-0">#</th>
                        <th className="border-0">Name</th>
                        <th className="border-0">Phone Number</th>
                        <th className="border-0">Email</th>
                        <th className="border-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schools.map((school, index) => (
                        <tr key={school.id}>
                          <td>{index + 1}</td>
                          <td>{school.name}</td>
                          <td>{school.phone_number}</td>
                          <td>{school.email}</td>
                          <td>
                            <Link
                              to={`${school.auth_id}/school`}
                              className="btn btn-outline-success btn-icon btn-sm mr-2"
                            >
                              <i className="feather-eye"></i>
                            </Link>
                            <Link
                              to={`${school.auth_id}/edit`}
                              className="btn btn-outline-warning btn-icon btn-sm"
                            >
                              <i className="feather-edit"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5 col-12">
            <div className="alert" role="alert">
               There are no schools available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

School.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default School;
