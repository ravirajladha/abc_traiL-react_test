import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {
  LearnTab,
  QnaTab,
  NoteTab,
  ExternalStudentLearnTab,
  LearnInfoTab,
} from '@/components/student/learn';

import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router';

const VideoTabs = ({
  isLoading,
  subjectId,
  subjectData,
  studentId,
  isTeacherAvailable,
  teacherId,
  videoPlayer,
  activeVideoId,
  handleVideoClick,
}) => {
  const studentData = useOutletContext();
  const [activeTab, setActiveTab] = useState('learn');
  const isTabActive = (tabKey) => {
    return activeTab === tabKey;
  };
  return (
    <>
      <div className="card w-100 d-block chat-body p-0 border-0 shadow-xss rounded-3 mb-3 h500 position-relative">
        <Tabs
          defaultActiveKey="learn"
          id="uncontrolled-tab-example"
          onSelect={(key) => setActiveTab(key)}
          className="list-inline-center d-flex text-center border-0 custom-tabs"
        >
          <Tab eventKey="learn" title="SUBJECT" className="list-inline-item">
            {studentData.student_type === 0 ? (
              <LearnTab
                isLoading={isLoading}
                subjectData={subjectData}
                activeVideoId={activeVideoId}
                handleVideoClick={handleVideoClick}
              />
            ) : (
              <ExternalStudentLearnTab
                isLoading={isLoading}
                subjectData={subjectData}
                activeVideoId={activeVideoId}
                handleVideoClick={handleVideoClick}
              />
            )}
          </Tab>
          <Tab eventKey="chat" title="QNA" className="list-inline-item">
            <QnaTab
              studentId={studentId}
              subjectId={subjectId}
              teacherId={teacherId}
              isTeacherAvailable={isTeacherAvailable}
              isTabActive={isTabActive}
            />
          </Tab>
          <Tab eventKey="notes" title="NOTES" className="list-inline-item">
            <NoteTab
              studentId={studentId}
              videoPlayer={videoPlayer}
              activeVideoId={activeVideoId}
              isTabActive={isTabActive}
            />
          </Tab>
          {studentData.student_type === 0 ? (
            ''
          ) : (
            <Tab
              eventKey="info"
              title={
                <span>
                  <i className="feather-info"></i>
                </span>
              }
              className="list-inline-item"
            >
              <LearnInfoTab />
            </Tab>
          )}
        </Tabs>
      </div>
      <h5 className="font-xs mb-2 text-center rounded-lg bg-white py-3 text-dark fw-400 border  border-size-md">
        <i
          className="feather-play text-grey-500 mr-2"
          style={{ marginTop: '2px' }}
        ></i>{' '}
        Live Doubt Clearing
      </h5>
    </>
  );
};

VideoTabs.propTypes = {
  isLoading: PropTypes.bool,
  subjectData: PropTypes.array,
  subjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isTeacherAvailable: PropTypes.bool,
  teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  videoPlayer: PropTypes.object,
  activeVideoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleVideoClick: PropTypes.func,
};

export default VideoTabs;
