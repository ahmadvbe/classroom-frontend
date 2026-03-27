import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
 //2:05:20
import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "../src/components/refine-ui/notification/toaster.tsx";
import { useNotificationProvider } from "../src/components/refine-ui/notification/use-notification-provider.tsx";
import { ThemeProvider } from "../src/components/refine-ui/theme/theme-provider.tsx";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Home,
  Users,
} from "lucide-react";

import SubjectsList from "./pages/subjects/list";
import { Layout } from "./components/refine-ui/layout/layout.tsx";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsShow from "./pages/subjects/show";

import Dashboard from "./pages/dashboard";

import { dataProvider } from "../src/providers/data.ts";

//4:15:40 to be implemented as Classes route 3 components
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";

import { authProvider } from "../src/providers/auth.ts";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Forgotpassword } from "./pages/forgot-password";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentShow from "./pages/departments/show";
import FacultyList from "./pages/faculty/list";
import FacultyShow from "./pages/faculty/show";
import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsJoin from "./pages/enrollments/join";
import EnrollmentConfirm from "./pages/enrollments/confirm";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "kkWuv7-GgBIfw-P8CGy0",
              }}


              resources={[  //2:07:30 define the resources
                // 2:06:34 RESOURCE CONCEPT /DATA entities
                // in our case that is gonna refer to:  classes subjects students
                // easier way to manage ur app routes 2:07:30 and tie those routes
                {
                  name: "dashboard", //1st resource
                  list: "/",
                  meta: { //2:08:04
                    label: "Home",
                    icon: <Home />,
                  },
                },
                { //2:10:40
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create", //create route
                  show: "/subjects/show/:id", //get route id
                  meta: {
                    label: "Subjects",
                    icon: <BookOpen />, //coming from lucid react
                  },
                },
                //7:28:00 Refine AI Website Implementation
                {
                  name: "departments",
                  list: "/departments",
                  show: "/departments/show/:id",
                  create: "/departments/create",
                  meta: {
                    label: "Departments",
                    icon: <Building2 />,
                  },
                },
                { //this is the resource for users
                  name: "users",
                  list: "/faculty",
                  show: "/faculty/show/:id",
                  meta: {
                    label: "Faculty",
                    icon: <Users />,
                  },
                },
                {
                  name: "enrollments",
                  list: "/enrollments/create",
                  create: "/enrollments/create",
                  meta: {
                    label: "Enrollments",
                    icon: <ClipboardCheck />,
                  },
                },

                  //4:14:38 we need to define class routes and use these component within App.tsx
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",

                  //                **Define this App route with the webstormproject/classroom-frontend/src/App.tsx**
                  //                     add to the classes resource: the show parameter
                  //                     and point it to: "/classes/show/:id", 6:50:30
                  show: "/classes/show/:id",
                  meta: {
                    label: "Classes",
                    icon: <GraduationCap />,
                  },
                },
              ]}
            >
              <Routes>
                {/*//7:28:00 Refine AI Website Implementation*/}
                <Route
                  element={
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<Forgotpassword />} />
                </Route>

                <Route  //2:08:40
                  element={
                    // <Authenticated key="private-routes" fallback={<Login />}>
                      <Layout>
                        <Outlet //2:08:49 coming from react-router which renders a matching  child route of a parent route or ntg if no child routes matches
                            //special component used to render a child route inside a parent route 2:09:05
                            //it will render the side bar which refine will pass as child auto for us within other pages
                          />
                      </Layout>
                    //</Authenticated>
                  }
                 >
                  <Route   //2:06:10
                        path="/"
                        element={<Dashboard />} />

                  <Route  //2:11:15
                        path="subjects">
                    <Route
                          index  //default route
                          element={<SubjectsList />} />
                    <Route
                          path="create"  // /create
                          element={<SubjectsCreate />} />
                    <Route
                          path="show/:id"
                          element={<SubjectsShow />} />
                  </Route>

                  {/*//7:28:00 Refine AI Website Implementation*/}
                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="show/:id" element={<DepartmentShow />} />
                  </Route>

                  <Route //this is the route for users
                       //create process is missing 7:34:30
                        path="faculty">
                    <Route index element={<FacultyList />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>

                  <Route path="enrollments">
                    <Route path="create" element={<EnrollmentsCreate />} />
                    <Route path="join" element={<EnrollmentsJoin />} />
                    <Route path="confirm" element={<EnrollmentConfirm />} />
                  </Route>


                  {/*add classes as a new route 4:15:05 inside the refine component
                      this route will render the classes/list + the classes/create*/}
                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                          {/*add the show/:id route below the classes folder 6:50:35  */}
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
