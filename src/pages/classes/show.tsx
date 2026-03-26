import { AdvancedImage } from "@cloudinary/react";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";



//    FE side 2- Use it on the FE  to display that info 6:49:49
//                 =>create a new page component to show the details
//                         webstormproject/classroom-frontend/src/pages/classes/show.tsx
//but before we ll
    //#                **Define this App route with the webstormproject/classroom-frontend/src/App.tsx**
    // #                6:51:00 Add the option to go to the class details page from the classes list page
    // #                            - we ll have to define the ednpoint that proccesses the request on our behalf and gets the details of one resource @
//# 6:54:05 now back to Classes Details Page development
type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const ClassesShow = () => {
  const { id } = useParams();
  const classId = id ?? "";

  //6:54:10 get access to the specific class data - refines makes it easy - destruct the query and call the useShow hook coming from RefineDevCore
  const { query } = useShow<ClassDetails>({ //define the type of data to get back 6:54:25
    resource: "classes", //which resource to get back
  });
      //once u hve the query retrieved -  u can destruct the data  6:54:38 being sent from the BE
  //1- destruct the data alone
  const classDetails = query.data?.data; // data is being retrieved
  // 2-const {isLoadin, isError} = query 6:55:45 destruct the other 2 alone
  //query.isLoading state
  //query.isError

  const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    []
  );

  const studentsTable = useTable<ClassUser>({
    columns: studentColumns,
    refineCoreProps: {
      resource: `classes/${classId}/users`,
      pagination: {
        pageSize: 3,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "student",
          },
        ],
      },
    },
  });

  //6:55:40 -2- if we have no data or still loading or erroring -HANDLING THE UNFORTUNATE CASES
  if (query.isLoading || query.isError || !classDetails) {
    return ( //6:55:45 6:58:20
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {query.isLoading //if we re currently loading
            ? "Loading class details..."
            : query.isError //check if we hve an error 6:58:53
            ? "Failed to load class details."
            : "Class details not found." //else 6:59:05
          }
        </p>
      </ShowView>
    );
  }


  //6:59:15 HANDLING RELEVANT DATA
  const teacherName = classDetails.teacher?.name ?? "Unknown"; //1-GET ACCESS TO TEACHER NAME
  const teacherInitials = teacherName //GRAB TEACHER'S INITIALS
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  //2-PLACEHOLDER FOR PROFILE PHOTO 7:00:25
  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA"
  )}`;



  //3- READY T CREATE THE JSX 7:00:56
  return ( //7:01:10
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader  //refresh and edit in realtime
                resource="classes"
                title="Class Details" />

      <div //banner rendering 7:01:30
            className="banner">

        {classDetails.bannerUrl ? ( //if a banner url exists
            //7:09:00 cloudinary transformations 7:10:40 webstormproject/classroom-frontend/src/lib/cloudinary.ts
                  //7:12:28 where we wana define wt to do as transformations to be applied within this image @src/lib/cloudinary.ts
                // use the bannerphoto from cloudinary.ts 7:14:58 @webstormproject/classroom-frontend/src/pages/classes/show.tsx
          classDetails.bannerUrl.includes("res.cloudinary.com") &&
          classDetails.bannerCldPubId ? (
            <AdvancedImage //render the cloudinary advanced image coming from "@cloudinary/react"; 7:15:12 we will feed it with props such as the bannerPhoto
              cldImg={bannerPhoto( //spec create @cloudinary.ts / bannerPhotp 5:15:30
                classDetails.bannerCldPubId ?? "",
                classDetails.name
              )}
              alt="Class Banner"
            />
          ) : (
            <img
              src={classDetails.bannerUrl}
              alt={classDetails.name}
              loading="lazy"
            />
          )
        ) : (//i not 7:01:45 simply render another div
          <div className="placeholder" />
        )}
      </div>

      <Card  //7:02:05
            className="details-card">
        {/* Class Details */}
        <div>
          <div  //1st part
                className="details-header">
            <div //1st part - 1st subpart
              >
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>

            <div //1st part - 2nd subpart 7:03:50
              >
              <Badge variant="outline">{classDetails.capacity} spots</Badge>
              <Badge
                variant={ //7:04:07 color variant
                  classDetails.status === "active" ? "default" : "secondary"
                }
                data-status={classDetails.status}
              >
                {classDetails.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div //1st part - 3rd subpart 7:04:30
                className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img //7:04:55
                  src={classDetails.teacher?.image ?? placeholderUrl}
                  alt={teacherName}
                />

                <div>
                  <p>{teacherName}</p>
                  <p>{classDetails?.teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{classDetails?.department?.name}</p>
                <p>{classDetails?.department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card  2nd part 7:06:44 */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails?.subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Join Class Section 7:07:35 3rd part */}
        <div className="join">
          <h2>🎓 Join Class</h2>

          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button //7:08:19
              size="lg" className="w-full">
          Join Class
        </Button>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        {/*<CardContent>*/}
        {/*  <DataTable table={studentsTable} paginationVariant="simple" />*/}
        {/*</CardContent>*/}
      </Card>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default ClassesShow;
