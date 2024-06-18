import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ContentFallback,
  ContentHeader,
  ContentLoader,
} from '@/components/common';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchZoomCalls } from '@/api/admin';
import Swal from 'sweetalert2';
import { formatDate } from '@/utils/helpers';

function Index({ title }) {
  const [zoomCalls, setZoomCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetchZoomCalls();
      setZoomCalls(response.zoomCallUrls);
      console.log(response.zoomCallUrls);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ContentHeader
        title="Zoom Call"
        subtitle=""
        buttons={[
          {
            link: `create`,
            text: 'New Zoom Call',
          },
        ]}
      />
      {loading ? (
        <ContentLoader />
      ) : (
        zoomCalls &&
        (zoomCalls.length > 0 ? (
          <div className="row">
            <div className="col-lg-12">
              <div className="card border-0 mt-0 rounded-lg shadow-sm">
                <div className="card-body d-flex pt-4 px-4 pb-0">
                  <h4 className="font-xss text-grey-800 mt-3 fw-700">
                    {title}
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
                            Date
                          </th>
                          <th className="border-0" scope="col">
                            Url
                          </th>
                          <th scope="col" className="text-right border-0 pl-1" width="20%">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {zoomCalls.map((zoomCall, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{formatDate(zoomCall.date)}</td>
                            <td>{zoomCall.url}</td>
                            <td className="text-right">
                              <Link
                                to={`${zoomCall.id}/edit`}
                                className="btn btn-outline-warning btn-icon btn-sm mr-2"
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
          </div>
        ) : (
          <ContentFallback />
        ))
      )}
    </>
  );
}

Index.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Index;
