import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { fetchClasses } from '@/api/common';
import { deleteClass } from '@/api/admin';

import {
  ContentLoader,
  ContentItemCard,
  ContentHeader,
} from '@/components/common';

function Classes({ title }) {
  const [classesData, setClassesData] = useState(null);
  const [loading, setLoading] = useState(true);
console.log("from classes");
  const fetchData = async () => {
    try {
      const response = await fetchClasses();
      setClassesData(response);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId) => {
    Swal.fire({
      title: 'Confirm!',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      text: 'Do you want to delete this class?',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteClass(classId);
          fetchData();
          toast.success(response.message);
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="px-2">
      <ContentHeader
        title={title}
        backLink="/admin/dashboard"
        buttons={[
          {
            link: 'create',
            text: 'New Class',
          },
        ]}
      />

      <div className="row">
        {loading ? (
          <ContentLoader />
        ) : classesData !== null && classesData.length > 0 ? (
          classesData.map((classItem, index) => (
            <ContentItemCard
              key={index}
              data={classItem}
              buttons={[
                {
                  label: 'Subjects',
                  action: (item) => `/admin/classes/${item.id}/subjects`,
                  style: ' bg-primary-gradiant',
                },
                {
                  label: 'Results',
                  action: (item) => `/admin/classes/${item.id}/results`,
                  style: ' bg-success ml-2',
                },
              ]}
              handleDelete={() => handleDelete(classItem.id)}
              handleEdit={(item) => `/admin/classes/${item.id}/edit`}
            />
          ))
        ) : (
          <div className="text-center mt-5 col-12">
            <div className="alert" role="alert">
              There are no classes available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Classes.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Classes;
