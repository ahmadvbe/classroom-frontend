import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
//2:40:20
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";


const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        params.page = page;
        params.limit = pageSize;
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

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

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "subject") params.subject = value;
          if (field === "teacher") params.teacher = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: { //2:43:30 creating a resource
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getOne: { //2:42:54 feches a single record by id
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },
};



const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

// import {DataProvider, GetListParams, GetListResponse,BaseRecord} from '@refinedev/core'
// 2:40:20 export const dataProvider: DataProvider = {
//here we re working with fake data
//get list : fetches all the records used by useTable, useList, so that everytime u w ana implememnt
// alist resource page,
//refine will  ake a call to getList to get the data and passz it to the useTable or useList behind the scenes
//getList: async <Tdata extends BaseRecord = BaseRecord>({ressource}: GetListParams)
//    : Promise<GetListResponse<Tdata>> => { //2:41:25

// }
//}
//2:43:40 get some mockup data using junie
// create mockk subject data in TS for ...2:44:15
//mock subject data will be  create in a new file and then rendered 2:45:15
