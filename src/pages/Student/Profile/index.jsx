import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { ContentHeader } from '@/components/common';

import {
  ReportCard,
  RankCard,
  SubjectCard,
  AboutCard,
} from '@/components/student/profile';

import { fetchReportCard } from '@/api/student';
import { fetchStudentFromStudents } from '@/api/school';
import { getStudentDataFromLocalStorage } from '@/utils/services';
function Profile({ isAdmin, isStudent }) {
  const { studentId: studentIdFromParams } = useParams();
  const navigate = useNavigate();
  const [reportCard, setReportCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [studentData, setStudentData] = useState(() => {
    // If isAdmin is true, then we should always be using the studentId from the URL parameters
    // otherwise, we try to get the student data from local storage.
    if (isAdmin === 'true') {
      return null;
    } else {
      try {
        // If isStudent is true and no studentId is provided in the URL, try to get data from local storage
        if (isStudent === 'true' && !studentIdFromParams) {
          const data = JSON.parse(getStudentDataFromLocalStorage());
          setLoading(true);

          return data || {};
        }
      } catch (error) {
        console.error(
          'Failed to parse student data from local storage:',
          error
        );
        return {};
      }
      return null;
    }
  });
  // const studentData1 = JSON.parse(getStudentDataFromLocalStorage());
  // console.log("student data: " + studentData1.student_id)

  console.log('studentidparama', studentData);

  // Fetches student basic data for admin
  const fetchStudentData = useCallback(async () => {
    if (!studentIdFromParams) {
      setError(new Error('No student ID provided in URL parameters.'));
      return;
    }
  
    try {
      const data = await fetchStudentFromStudents(studentIdFromParams);
      if (data && data.student) {
        setStudentData(data.student);
        setLoading(false);
      } else {
        throw new Error('Student data is empty.');
      }
    } catch (error) {
      setError(error);
      toast.error('Failed to fetch student data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [studentIdFromParams]);

  const fetchStudentReportCard = useCallback(async () => {
    // if (!studentData || !studentData.id) return;
    console.log('Fetching student', studentData);
    const studentId = studentData.student_id;
    const classId = studentData.class_id;
    const sectionId = studentData.section_id;
    console.log('Fetching student full data', studentId, classId, sectionId);
    // setLoading(true);
    try {
      const data = await fetchReportCard(studentId, classId, sectionId);
      if (data) {
        setReportCard(data.report_card);
      setLoading(false);

      }
    } catch (error) {
      console.error('Failed to fetch report card:', error);
      setError(true);
      toast.error('Failed to load report card: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [studentData]);

  // Effect to fetch student data if admin
  useEffect(() => {
    if (isAdmin === 'true' && studentIdFromParams) {
      fetchStudentData();
    }
  }, [isAdmin, studentIdFromParams, fetchStudentData]);

  // Effect to set student data from local storage if student
  useEffect(() => {
    if (isStudent === 'true' && !studentIdFromParams) {
      try {
        const data = JSON.parse(getStudentDataFromLocalStorage());
        setStudentData(data || {});
        setLoading(false);
      } catch (error) {
        setError(new Error('Failed to parse student data from local storage.'));
      }
    }
  }, [isStudent, studentIdFromParams]);

  // Effect to fetch report card data for all user types once studentData is set
  useEffect(() => {
    if (studentData && studentData.student_id) {
      const studentId = studentData.student_id;
      const classId = studentData.class_id;
      const sectionId = studentData.section_id;
      fetchStudentReportCard(studentId, classId, sectionId);
    }
  }, [studentData, fetchStudentReportCard]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <React.Fragment>
      <ContentHeader title="My" subtitle="Profile" />
      <div>
        <Tabs
          defaultActiveKey="report"
          className="mb-3 nav nav-tabs profile xs-p-3 d-flex align-items-center justify-content-between product-info-tab border-bottom-0 bg-white shadow-xss rounded-lg"
        >
          <Tab eventKey="report" title="REPORT CARD">
            <ReportCard
              studentData={studentData}
              reportData={reportCard}
              loading={loading}
            />
          </Tab>
          <Tab eventKey="about" title="ABOUT">
            <AboutCard studentData={studentData} />
          </Tab>
          <Tab eventKey="subject" title="SUBJECT">
            <SubjectCard subjects={studentData?.subjects} />
          </Tab>
          <Tab eventKey="ranks" title="RANKS">
            <RankCard reportData={reportCard} />
          </Tab>
        </Tabs>
      </div>
    </React.Fragment>
  );
}

export default Profile;
