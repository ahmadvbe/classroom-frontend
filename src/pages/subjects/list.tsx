import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
 //2:10:30 A new route
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

import { Subject } from "@/types";
import { DEPARTMENT_OPTIONS } from "@/constants";

const SubjectListPage = () => {

  const [searchQuery, setSearchQuery] = useState(""); //2:19:45 search field
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all"); //2:20:46 for choosing the dpt

  const subjectColumns = useMemo<ColumnDef<Subject>[]>( //2:28:55 columns array which r gonna be displayed within the table to be displayed
      //wrap it in a use memo hook coming from react ,
      // we are memoizing the columns to avoid recreating each column on every render 2:29:07
      //define the type of data within that use memo 2:29:12
    () => [ //the callback function will simply resolve in an array 2:29:27
      //within that array we ll hve diff columns

      { //1st columns
        id: "code", //code of the subject
        accessorKey: "code", //field name from subject data 2:29:45
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>, //nt expecting ana element direclty rather a call back func returning an elemnt
        cell: ({ getValue }) =>  //get access to the value of this specific cell
              <Badge>{getValue<string>()}</Badge>, //actual cell data in the table to b shown 2:30:20
      },

      { //2:32:25
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (//get access to the value of this specific cell
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString", //2:33:40 allow filtering by name - enable text based filtering on this specific column
      },

      {//2:34:00
        id: "department",
        accessorKey: "department.name",
        size: 150,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },

      { //2:34:39
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">{getValue<string>()}</span>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="subjects"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [] //2:30:55 dependancy array columns never changes =>empty array
  );


  // so we ll define the filters to be provided to the permanent refineCoreProps/filters/filtering/  here 2:36:00
  const departmentFilters = //2:36:10
    selectedDepartment === "all"
      ? [] //==>dnt apply any filters if all is selected
      : [ //2:36:20
          {
            field: "department",
            operator: "eq" as const, //2:36:35
            value: selectedDepartment,
          },
        ];

  //2:37:15 is there is any search query?
  const searchFilters = searchQuery? [
        { //if yes
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : []; //if no search query =>dnt apply any filter


  //2:25:49 DATA TO BE DISPLAYED --
    // the following params will be passed to the data provider by Refine which will call our BE API with those params values and return the needed data
  const subjectTable = useTable<Subject>({
    //THIS HOOK useTable is COMING FROM REFINE ALLOWING TO FETCH DATA ACCORDING TO FILTER,... 2:26:15
            //Built on TanStack table, it integrates direclty with Refine's data fetching hooks, 2:32:05
            //THE Type of the table is gonnna include the <Subject> type 2:26:30
            //Now we hve to display the options of this useTable hook 2:27:34

    columns: subjectColumns,//2:28:35 columns of the table that we re working on - Array to b created
    refineCoreProps: {
      resource: "subjects", //which specific resource is this table showing the data for 2:27:38 this to be nested within the  refineCoreProps object:{}
      pagination: {//2:28:02 how do we wana pagination over those resrouces
        pageSize: 10,
        mode: "server", //paginate on server side
      },
      filters: { //2:28:25 2:35:35 #        2:35:25 Apply some filters to the table,
        // Compose refine filters from the current UI selections.

        permanent: [ //2:53:50 enable the permanent filtering where we define an array of diff filters
                    ...departmentFilters, //we wana b able to filter by Dep                                             -- spread the departmentfilters defined above
                    ...searchFilters], //as well as by Search   - so we ll define these filters above 2:36:00 2:37:55   -- spread the seatchFilters
      },


      sorters: { //        2:38:00 Apply the Sorting
        initial: [
          {
            field: "id",
            order: "desc", //the newly craeted ids will appear on top of the table
          },
        ],
      },
    },
  });

  return (
      // lets work on the first data point
      //                 src/pages/subjects/list.tsx 2:16:43
    <ListView>
      <Breadcrumb   //tell us where we re on the dashboard/tracket 2:17:00
         />
      <h1   //2:17:10
            className="page-title" //custom class defined within our APP.css
       >Subjects</h1>

      <div  //2:18:35
            className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div  //2:18:58
             className="actions-row">
          <div
                className="search-field">
            <Search //2:19:12
                  className="search-icon" />
            <Input  //2:19:20
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery} //state to be created above 2:19:40
              onChange={(event) => setSearchQuery(event.target.value)} //2:20:05
            />

          </div>

          <div  //2:20:20
                className="flex gap-2 w-full sm:w-auto">
            <Select //2:20:30
              value={selectedDepartment} //select the dpt we wana get the subject for 2:20:45 => create a new useState above 2:21:00
              onValueChange={setSelectedDepartment} //2:21:10
            >
              <SelectTrigger  //2:21:15
                    className="">
                 <SelectValue //2:21:25
                    placeholder="Filter by department" />
              </SelectTrigger>

              <SelectContent //2:21:45
                 >
                <SelectItem  //2:21:55
                      value="all">All Departments</SelectItem>
                {/* 2:22:15 we wana also render a lsit of the actual departments to be displayed
                  and we will be mapping through these data int eh constants file src/constants/index.ts*/}
                {DEPARTMENT_OPTIONS.
                        map((department) => (
                  <SelectItem //for each returned value we render 2:24:15
                        key={department.value}
                        value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton  //2:24:50 provided by refine automatically redirects you to the create subject page
                //making the routing the routing and the data portion of ur app seamless so u can focus strictly on the business logic 2:25:28
                  resource="subjects" />
          </div>
        </div>
      </div>


      {/*LIST SOME DATA 2:25:35*/}
      <DataTable //2:31:45
            table={subjectTable} //TO BE DEFINED ABOVE
       />
    </ListView>
  );
};

export default SubjectListPage;
