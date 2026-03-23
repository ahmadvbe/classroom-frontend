import { useForm } from "@refinedev/react-hook-form"; //5:03:30 COderaabit fix
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

//4:25:10 brinf all the imports needed to create a form
import {
  Form, //to be used within JSX
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { Textarea } from "@/components/ui/textarea";
import { useBack, useList } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import { classSchema } from "@/lib/schema";
import UploadWidget from "@/components/upload-widget";
import { Subject, User } from "@/types";
import z from "zod";

// 4:14:26 src/pages/classes/create.tsx
//                     responsible for rendering a form through which we re gonna create a new class
//4:18:36 begin with the dev

const ClassesCreate = () => {

  const back = useBack(); //4:19:35

    //4:23:26  define the form
    //4:23:12 define the form itself by importing the zod resolver
    //use form coming from react-hook-form
  const form = useForm({ //4:23:30
    resolver: zodResolver(classSchema), //define the resolver that is resolving in a clasSchema
                                    // - which has been created at the schema.ts
    refineCoreProps: { //4:23:54 will let refine now exactly wt we re gonna do with
                        // that form and it will handle the rest
      resource: "classes",
      action: "create",
    },
    defaultValues: { //define the default values 4:23:45
      status: "active",
    },
  });

  const { //4:26:53 extraction of fields to be used in JSX
      //we hve to have access to fields - by destructuring them from the form
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting, errors }, //we hve to have access to form errors - by destructuring them from the form state 4:44:30
    control,
  } = form;

  //4:41:25 define the bannerPublicId whis is gonna be used in the field value of the Cloudinary Upload Widget
  const bannerPublicId = form.watch("bannerCldPubId");

  //4:24:13 onsubmit func definition
  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
        console.log(values); //4:25:07
      await onFinish(values);
    } catch (error) { //4:24:55
      console.error("Error creating class:", error);
    }
  };

  // Fetch subjects list
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  // Fetch teachers list
  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const teachers = teachersQuery.data?.data || [];
  const teachersLoading = teachersQuery.isLoading;

  const subjects = subjectsQuery.data?.data || [];
  const subjectsLoading = subjectsQuery.isLoading;

  return ( //4:18:35
    <CreateView className="class-view">
      <Breadcrumb  //refine UI
        />

      <h1 className="page-title">Create a Class</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a class.</p>

          <Button //4:19:20 use of useBack hook to work coming from Refine-CORE
                    onClick={() => back()}>Go Back</Button>
      </div>

      <Separator  //4:20:48
        />

      <div  //the card form  UI begins now - render the card component
            className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader //4:21:25
              className="relative z-10">
            <CardTitle
                    className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent  //4:22:00
                className="mt-7">
            <Form  //4:22:17 Render a classic React Hook form   - shadcn cmd+k (form): anatomy of a form
                    // import a z from zod
                    // define a form schema
                    {...form} //we spread out the form information
            >
              <form //will contain several FIELDS :
                        // banner(using the cloudinary widget),
                        // name
                        // subjects
                        // Teachers , capacuty, status, Description
                    onSubmit={handleSubmit(onSubmit)} //4:25:35
                    className="space-y-5">



                <FormField //4:39:39 field for uploading
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel  //4:26:09 banner image is needed
                        >
                        Banner Image <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>

                          {/*4:38:50 create the **upload widget component***/}
                          {/*- src/components/upload-widget.tsx*/}
                          {/*and import this component within src/pages/classes/create.tsx*/}
                        <UploadWidget //4:39:27 4:41:00
                          value={
                            field.value
                              ? { //if that exists ?
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                          onChange={(file) => {    //4:41:45     accepts a file 5:04:40 coderabbit fix
                            if (file) { //4:42:06 if a file exists
                              field.onChange(file.url); //we ll call the field.onChange and pass in the url of that file
                                    //then  use the form to set a value 4:42:50
                              form.setValue("bannerCldPubId", //here we re modifying the banner.. with the file
                                  file.publicId,
                                  { //additional options 4:43:00
                                shouldValidate: true, //rerun zod validation after we submit it
                                shouldDirty: true, //mark the forma s modified as soon as the image is uploaded
                              });
                            } else { //if a file doesnt exists
                              field.onChange("");
                              form.setValue("bannerCldPubId", "", {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage  //4:43:42  we hve to have access to form errors - by destructuring them from the form state
                         />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control} //4:27:15
                  name="name" //4:27:20
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel //required 4:27:35
                        >
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input //4:27:39
                          placeholder="Introduction to Biology - Section A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div //4:28:10 2 fields will fit into a single row -subject and teachers
                        className="grid sm:grid-cols-2 gap-4">
                  <FormField //Subjects form field
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select //4:28:53
                          onValueChange={(value) =>
                            field.onChange(Number(value)) //convert he value into a number before passing it
                          }
                          value={field.value?.toString()} //so we can properly display it
                          disabled={subjectsLoading}
                        >
                          <FormControl>
                                {/*4:28:42 instead of rendering an input we will render a select component */}
                            <SelectTrigger  //4:29:34
                                    className="w-full">
                              <SelectValue
                                        placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent //4:30:15 we ll fetch the real values by querying the data from the BE
                              //4:30:25 at the beginning we will generate some fake values using junie /prompt
                              //junie will add the mock data file @ the constants/index.ts 4:31:23
                              //4:32:12 we can map over those subjects
                            >
                            {subjects.map((subject) => (
                              <SelectItem //for each return this component
                                key={subject.id}
                                value={subject.id.toString()}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField //4:33:20 Teachers form field
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                          disabled={teachersLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div //2 fields will fit into a single row -capacity and status
                        className="grid sm:grid-cols-2 gap-4">
                  <FormField //capacity
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Capacity <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="30"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Creating Class...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : (
                    "Create Class"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default ClassesCreate;
