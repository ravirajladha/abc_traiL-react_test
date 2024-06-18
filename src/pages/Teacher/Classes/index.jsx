import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ContentItemCard,
  ContentFallback,
  ContentHeader,
  ContentLoader,
} from '@/components/common';
import { fetchTeacherClasses } from '@/api/teacher';

function Classes() {
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetchTeacherClasses();
      console.log(response);
      setClassesData(response.classes);
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
    <div>
      <ContentHeader title="All" subtitle="Classes" />
      <div className="row">
        {loading ? (
          <ContentLoader />
        ) : classesData.length > 0 ? (
          classesData.map((item, index) => (
            <ContentItemCard
              key={index}
              data={item}
              buttons={[
                {
                  label: 'Subjects',
                  action: (item) => `/teacher/classes/${item.id}/subjects`,
                  style: ' bg-primary-gradiant',
                },
                {
                  label: 'Results',
                  action: (item) => `/teacher/classes/${item.id}/results`,
                  style: ' bg-success ml-2',
                },
              ]}
            />
          ))
        ) : (
          <ContentFallback />
        )}
      </div>
    </div>
  );
}

export default Classes;
