import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ContentLoader } from '@/components/common';
import { Highlight } from '@/components/Dashboard';

import { fetchDashboard } from '@/api/student';

import {
  QuickAnalyticsCard,
  VideoAnalyticsCard,
  ZoomCallCard,
} from '@/components/student/dashboard';
import { getStudentDataFromLocalStorage } from '@/utils/services';

function Dashboard() {
  const studentData = JSON.parse(getStudentDataFromLocalStorage());
  const studentId = studentData.student_auth_id;

  const [dashboard, setDashboard] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboardItems = useCallback(async () => {
    fetchDashboard(studentId)
      .then((data) => {
        if (data) {
          setDashboard(data.dashboard);
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
    fetchDashboardItems();
  }, [fetchDashboardItems]);

  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <Highlight showBackgroundImage />
      {loading ? (
        <div className="row my-5">
          <ContentLoader />
        </div>
      ) : (
        <>
          {studentData.student_type === 0 ? (
            <ZoomCallCard data={dashboard.zoomCall} />
          ) : (
            ''
          )}
          <QuickAnalyticsCard
            last_login_at={dashboard.last_login_at}
            total_watch_time={dashboard.total_watch_time}
            avg_assessment_score={dashboard.avg_assessment_score}
            first_term_results={dashboard.first_term_results}
            first_term_total_marks={dashboard.first_term_total_marks}
            second_term_results={dashboard.second_term_results}
            second_term_total_marks={dashboard.second_term_total_marks}
            third_term_results={dashboard.third_term_results}
            third_term_total_marks={dashboard.third_term_total_marks}
          />
          <VideoAnalyticsCard stats={dashboard.video_stats} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
