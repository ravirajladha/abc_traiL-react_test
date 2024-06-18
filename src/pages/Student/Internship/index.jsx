import { ContentHeader, ContentFallback } from '@/components/common';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInternships } from '@/api/admin';
function Internship({ title }) {
  const [internships, setInternshipsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchData = async () => {
    try {
      const response = await getInternships();
      setInternshipsData(response.internships);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);
  return (
  
    <div>
      <ContentHeader title="Internship" />
      {loading ? (
        <p>Loading...</p>
      ) : internships.length === 0 ? (
        <ContentFallback message="There are no internships available at the moment." />
      ) : (


      <div className="middle-sidebar-bottom theme-dark-bg">
          <div className="middle-sidebar-left">
            <div className="col-lg-12 pt-0 mb-3 d-flex justify-content-between">
              <div>
                {/* <h2 className="fw-400 font-lg d-block">
                  <b>Internship</b>
                </h2> */}
              </div>
              
            </div>
            <div className="row">
              {internships.map((internship, index) => (
                <div className="col-4" key={index}>
                  <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                    {/* <div className="card w-100 shadow-xss rounded-10 overflow-hidden border-0 mb-3 mt-0 p-4"> */}
                      <div className="card-body d-block pt-4 text-center">
                        <figure className="avatar position-relative w-110 z-index-1 w100 z-index-1 mr-auto ml-auto">
                          <img
                            // src={`${baseUrl}${internship.project_image}`}
                           src= {baseUrl + internship.image}
                            alt={`Image ${index + 1}`}
                            className="p-3 bg-greylight rounded-lg w-100"
                          />
                        </figure>
                        <h4 className="font-xs ls-1 fw-700 text-grey-900">
                          {internship.name}
                          {/* <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                            {internship.internship_tasks_count} Stages
                          </span> */}
                        </h4>
                      </div>

                      <div className="card-body d-flex align-items-center justify-content-center pl-1 pr-1 pt-0">
                      <Link to={`participate/${internship.id}`}>
                        <button
                          className="bg-success text-white rounded-xl btn-cart w125 d-inline-block text-center font-xsssss p-3 fw-700 ls-3 text-uppercase"
                          // onClick={() =>
                          //   handleParticipateClick(internship.project_image)
                          // }
                        >
                          Participate
                        </button>
                        </Link>
                        {/* <button
                          onClick={() => {
                            const downloadUrl = `${baseUrl}api/download-image/${internship.id}`;
                            window.location.href = downloadUrl;
                          }}
                          className="bg-success text-white rounded-xl btn-cart w125 d-inline-block text-center font-xsssss p-3 fw-700 ls-3 text-uppercase"
                        >
                          Download
                        </button> */}
                        {/* <button
                          onClick={() => {
                            const downloadUrl = `${baseUrl}api/download-image/${internship.id}`;
                            window.location.href = downloadUrl;
                          }}
                          className="bg-greylight theme-white-bg btn-round-lg ml-1 rounded-3 text-grey-700"
                        >
                          <i className="feather-download-cloud"></i>
                        </button> */}
                      </div>
                    </div>
                  {/* </div> */}
                </div>
              ))}
            </div>
          </div>
      
    </div>
     )}
     </div>
   );
 }

export default Internship;
