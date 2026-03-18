import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

//#    3:50:20 src/providers/data.ts =?implement a new rest data provider
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

//1st define the options needed 3:50:35
const options: CreateDataProviderOptions = {
  getList: { //define the option specifically fpr get list
    //we ll create different endpoints that we can call
    //then refine will handle it in a way allowing us not to change antg within our app 3:52:45
    getEndpoint: ({ resource }) => resource, //3:51:20 take in the resource and return it

    //   3:54:25 make the search work
    //             = > build the search query param and let refine know abt them
    buildQueryParams: async ({ resource, pagination, filters }) => {
      //we re defining the type pf the params for TS 3:56:27
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1; //3:54:53
        const pageSize = pagination?.pageSize ?? 10;

        //we re defining the type pf the params for TS 3:56:27
        params.page = page;
        params.limit = pageSize;
      }

      //loop through all the refine filters 3:55:17
      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);//convert the filter value to string 3:55:38

        if (field === "role") {
          params.role = value;
        }

        if (resource === "departments") {
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "users") {
          if (field === "search" || field === "name" || field === "email") {
            params.search = value;
          }
        }

        if (resource === "subjects") { //handle the filter only for the subjects resource 3:55:48
            //set the params values in the url
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "subject") params.subject = value;
          if (field === "teacher") params.teacher = value;
        }
      });

      //build the params that our APi will consume- return them 3:56:40
      return params;
    },

    //3:51:32
    mapResponse: async (response) => {
      const payload: ListResponse = await response.json(); //get access to the payload we re passing over
      return payload.data ?? [];//3:51:56
    },

    //3:52:00
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },
};

//3:50:53 create  a new Data provider
const { dataProvider } = createDataProvider('http://localhost:8000/api/', options);

export { dataProvider };
