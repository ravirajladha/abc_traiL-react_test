import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import {
  AdminLayout,
  SchoolLayout,
  StudentLayout,
  TeacherLayout,
  ParentLayout,
  RecruiterLayout,
} from '@/layouts';

import GuestRoutes from '@/routes/GuestRoutes';
import AdminRoutes from '@/routes/AdminRoutes';
import SchoolRoutes from '@/routes/SchoolRoutes';
import TeacherRoutes from '@/routes/TeacherRoutes';
import StudentRoutes from '@/routes/StudentRoutes';
import ParentRoutes from '@/routes/ParentRoutes';
import RecruiterRoutes from '@/routes/RecruiterRoutes';

import { NotFound ,StudentTermTest,StudentJobTest} from '@/pages';
import {
  SchoolApplicationPrint,
  SchoolOldApplicationPrint,
} from '@/pages/School';
import { CaseStudyShow, EbookShow, ProjectReportShow } from '@/pages/Admin';

// import { CaseStudyShow, EbookShow, ProjectReportShow } from '@/pages/admin';
// import { Home } from '@/pages/elab';
// import Home from '@/pages/Elab/components/Home';
import Editor1 from '@/pages/e_lab/components/Editor1';
import { USER_TYPES, USERS } from '@/utils/constants';
import { selectUserType, selectIsAuthenticated } from '@/store/authSlice';

function Index() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authenticatedUserType = useSelector(selectUserType);

  let userTypePath;

  switch (authenticatedUserType) {
    case USER_TYPES.ADMIN:
      userTypePath = USERS[USER_TYPES.ADMIN].path;
      break;
    case USER_TYPES.SCHOOL:
      userTypePath = USERS[USER_TYPES.SCHOOL].path;
      break;
    case USER_TYPES.TEACHER:
      userTypePath = USERS[USER_TYPES.TEACHER].path;
      break;
    case USER_TYPES.PARENT:
      userTypePath = USERS[USER_TYPES.PARENT].path;
      break;
    case USER_TYPES.RECRUITER:
      userTypePath = USERS[USER_TYPES.RECRUITER].path;
      break;
    default:
      userTypePath = USERS[USER_TYPES.STUDENT].path;
      break;
  }

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={userTypePath} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Guest Routes */}
        {GuestRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} exact />
        ))}

        {isAuthenticated && (
          <>
            {/* Admin Routes */}
            {authenticatedUserType === USER_TYPES.ADMIN && (
              <Route
                path="/admin"
                element={<AdminLayout allowedRoles={[USER_TYPES.ADMIN]} />}
              >
                {AdminRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            )}
            {/* School Routes */}
            {authenticatedUserType === USER_TYPES.SCHOOL && (
              <Route path="/school" element={<SchoolLayout />}>
                {SchoolRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            )}
            {/* Teacher Routes */}
            {authenticatedUserType === USER_TYPES.TEACHER && (
              <Route path="/teacher" element={<TeacherLayout />}>
                {TeacherRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            )}
            {/* Student Routes */}
            {authenticatedUserType === USER_TYPES.STUDENT && (
              <Route path="/student" element={<StudentLayout />}>
                {StudentRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            )}
            {/* Parent Routes */}
            {authenticatedUserType === USER_TYPES.PARENT && (
              <Route path="/parent" element={<ParentLayout />}>
                {ParentRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            )}
         
            {/* Recruiter Routes */}
            {authenticatedUserType === USER_TYPES.RECRUITER && (
              <Route path="/recruiter" element={<RecruiterLayout />}>
                {RecruiterRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            )}
          </>
        )}
        {/* 
        <Route
          path="/student/elab/show1"
          element={<Home title="Show elab" />}
        /> */}
        {authenticatedUserType === USER_TYPES.STUDENT && (
          <>
            <Route
              path="/student/elab/show/:type/:redirecting_id/:labId"
              element={
                <Editor1
                  title={'Show elab'}
                  studentView={false}
                  isTestCode={false}
                  isShowCodebase={false}
                />
              }
            />
            <Route
              path="ebooks/:ebookId/preview/:moduleId?/:sectionId?"
              element={
                <EbookShow
                  title="Show eBook"
                  isAdmin={false}
                  isMobile={false}
                />
              }
            />
             <Route
              path="project-reports/:projectReportId/preview"
              element={
                <ProjectReportShow
                  title="Show Project Report"
                  isAdmin={false}
                  isMobile={false}
                />
              }
            />
            <Route
              path="case-studies/:caseStudyId/preview"
              element={
                <CaseStudyShow
                  title="Show Case Study"
                  isAdmin={false}
                  isMobile={false}
                />
              }
            />
            <Route
              path="student/subjects/term-test/:token/:testId"  
              element={
                <StudentTermTest />
              }
            />
            <Route
              path="student/jobs/job-test/:token/:jobId"  
              element={
                <StudentJobTest />
              }
            />
          </>
        )}

        {authenticatedUserType === USER_TYPES.ADMIN && (
          <>
            <Route
              path="/student/elab/test-code/:type/:redirecting_id/:labId"
              element={
                <Editor1
                  title="Show elab"
                  studentView={false}
                  isTestCode={true}
                  isShowCodebase={false}
                />
              }
            />
            <Route
              path="ebooks/:ebookId/preview/:moduleId?/:sectionId?"
              element={
                <EbookShow title="Show eBook" isAdmin={true} isMobile={false} />
              }
            />
            <Route
              path="project-reports/:projectReportId/preview"
              element={
                <ProjectReportShow
                  title="Show Project Report"
                  isAdmin={true}
                  isMobile={false}
                />
              }
            />
            <Route
              path="case-studies/:caseStudyId/preview"
              element={
                <CaseStudyShow
                  title="Show Case Study"
                  isAdmin={true}
                  isMobile={false}
                />
              }
            />
          </>
        )}

        {authenticatedUserType === USER_TYPES.ADMIN && (
          <Route
            path="/admin/elab/check-code/:type/:redirecting_id/:labId/:elab_submission_id"
            element={
              <Editor1
                title="Show elab"
                studentView={false}
                isTestCode={true}
                isShowCodebase={true}
              />
            }
          />
        )}
        {authenticatedUserType === USER_TYPES.STUDENT && (
          <Route
            path="/student/elab/check-code/:type/:redirecting_id/:labId/:elab_submission_id"
            element={
              <Editor1
                title="Show elab"
                studentView={false}
                isTestCode={true}
                isShowCodebase={true}
              />
            }
          />
        )}

        {/* {authenticatedUserType === USER_TYPES.ADMIN && (
          <Route
            path="/student/elab/test-code/:type/:redirecting_id/:labId"
            element={
              <Editor1
                title="Show elab"
                studentView={false}
                isTestCode={true}
                isShowCodebase={false}
              />
            }
          />
        )} */}
        {/*         
        <Route
          path="/student/elab/viewSelfSolution/:type/:redirecting_id/:labId"
          element={<Editor1 title="Show elab" studentView={true} />}
        /> */}

        {/* { path: 'elab/show/:type/:redirecting_id/:type_id/:labId', element: <Editor1 title="Elab" /> }, */}

        <Route
          path="school/applications/:applicationId/view/print"
          element={<SchoolApplicationPrint />}
        />
        <Route
          path="school/applications/old-applications/:applicationId/view/print"
          element={<SchoolOldApplicationPrint />}
        />
        <Route
          path="*"
          element={isAuthenticated ? <NotFound /> : <Navigate to="/login" />}
        />

        {/* Ebook Routes -- not authenticated */}

        {/* <Route
          path="ebooks/:ebookId/preview/:moduleId?/:sectionId?"
          element={<EbookShow title="Show eBook" isAdmin={true} isMobile={false}/>}
        /> */}
        {/* <Route
          path="project-reports/:projectReportId/preview"
          element={<ProjectReportShow title="Show Project Report" />}
        /> */}
        {/* <Route
          path="case-studies/:caseStudyId/preview"
          element={<CaseStudyShow title="Show Case Study" />}
        /> */}
      </Routes>
    </>
  );
}

export default Index;
