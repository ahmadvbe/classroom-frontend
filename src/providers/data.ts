import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

//#    3:50:20 src/providers/data.ts =?implement a new rest data provider
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";
import {HttpError} from "@refinedev/core";



//4:00:40 Coderabbit suggestion
if(!BACKEND_BASE_URL){
  throw new Error("BE is not configured, Please set the VITE_BACKEND_BASE_URL in ur .env file")
}


// 5:37:40 display the errors on the FE side
// webstormproject/classroom-frontend/src/providers/data.ts
// create a new func forming the error object 5:38:05
//so we can use it when we map the responses
const buildHttpError = async(response:Response):Promise<HttpError> => {
  //it returns a Promise which results in an HttpError defined at type.ts
  let message = 'Request failed.';
  try{ //get access to the payload 5:38:50
      const payload = (await response.json()) as { message: string };
      if(payload?.message) message = payload.message;

  }catch{
    //ignore errors
  }

  return {
    message,
    statusCode:response.status
  }

}



//1st define the options needed 3:50:35
const options: CreateDataProviderOptions = {
  //             ==>getList Endpoint
//        ==>now we hve enabled the getList Functionalities within our RestAPI Data Providers
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
      //use of func created above 5:39:35
      if(!response.ok) throw await buildHttpError(response);

      //4:00:20 Code rabbit fix : adding .clone()
      const payload: ListResponse = await response.clone().json(); //get access to the payload we re passing over


      return payload.data ?? [];//3:51:56
    },

    //3:52:00
    getTotalCount: async (response) => {
      //use of func created above 5:39:35
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

//# 6:19:00 **to Bind the Post Creation Events** we have to modify the data Provider of Refine
//     to tell it how to call APIs and what data should it expect
//     webstormproject/classroom-frontend/src/providers/data.ts
//             ==>create Endpoint 6:19:29
//        ==>now we hve enabled the create Functionalities within our RestAPI Data Providers
  create: {
    getEndpoint: ({ resource }) => resource, //get back the resource

    buildBodyParams: async ({ variables }) => variables, //6:19:37  takes in the variables and returns them

    //6:19:47 map out the responses
    mapResponse: async (response) => {
      const json: CreateResponse = await response.json(); //get acces to the json of a type  CreateResponse
      return json.data ?? {}; //once we get it we can simply return
    },
  },


//#                            - we ll have to define the dnpoint that proccesses the request on our behalf @
//                                     webstormproject/classroom-frontend/src/providers/data.ts
//                                 and provide us with the right data on that page 6:52:50 it will be the **getOne** endpoint
  getOne: { //gets the details of one resource
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
          //gets access to resource as well as the id of the resource 6:53:10

    mapResponse: async (response) => { //6:53:23 async func getting access to the response
      const json: GetOneResponse = await response.json(); //gets access to the json info of the response
      return json.data ?? {};
    },
  },
};

//3:50:53 create  a new Data provider
const { dataProvider } = createDataProvider(
    //'http://localhost:8000/api/',
    BACKEND_BASE_URL,//this is to be changed
    options);

export { dataProvider };
