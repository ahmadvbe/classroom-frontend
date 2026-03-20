import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { Trash, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../../jsm-files/classroom-main/src/components/ui/button.tsx";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";

//- Dive into the 4:44:55 UPLOAD WIDGET
// - 1st we ll do the JSX part 4:45:00
function UploadWidget({ //lets 4:45:34 get access to the props we re passing into this comp
  value = null, //if it doesnt exist we ll set it to null
  onChange,
  disabled = false, ///by defualt to fault
}: UploadWidgetProps) {


  //we ll also need access to a widget ref 4:45:50
  // we ll use this to persist the widget accross renders
  const widgetRef = useRef<CloudinaryWidget | null>(null);
        //of a type cloudinarywidget and set it to null @start

    //need for another ref to handle the changes 4:46:10 so we can avoid stale closures
  const onChangeRef = useRef(onChange); //we ll pass the onChange prop

  //figure out whether we re previewing the file we re working with
  // or we re showing the upload widget for the 1st time ==>manage a state 4:45:15
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value); //@ the start set it to the value passed through props

  const [deleteToken, setDeleteToken] = useState<string | null>(null); //4:46:40 string or null used for client side deletion
  //if somebody uploaded smtg and then they wana delete it
  const [isRemoving, setIsRemoving] = useState(false); //4:47:00 if we re removing smtg we can change the UI

  // Always keep latest onChange parameter updates provided within Props
  useEffect(() => {
    onChangeRef.current = onChange; //set the Ref to onChnage value
  }, [onChange]);//4:50:00

  // Sync external value → internal preview
  //OPEN UP THE WIDGET 4:49:40 change whenever the value of the input changes
      //setPreview and setDeleteToken
  useEffect(() => {
    setPreview(value); //set the preview to b equal to the new value
    if (!value) { //there is ntg to delete
      setDeleteToken(null);
    }
  }, [value]);//change whenever the value of the input changes

  // 4:50:16 useEffect dealing with Initializing Cloudinary widget (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return; //this work only in the browser where there is a window opbject

      //create a sub function 4:50:36
    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false; //dnt initialize in this cases
      //we exist if cloudinary is nt loaded or if a widget already exists

      //new instance of the cloudinary upload widget 4:51:00
      //initializing begins here
      widgetRef.current = window.cloudinary.createUploadWidget(
        { //we set evg up by using our env variables - passing the parts
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET, //4:52:52
          multiple: false,//we only allow a single file upload
          folder: "uploads", //move the files over to the folder called uploads
          maxFileSize: 5_000_000, //5 megabytes
          clientAllowedFormats: ["png", "jpg", "jpeg","webp"],
        },
          //now we provide an error and result portion which is the callback 4:53:40
        (error, result) => { //here we ll define wt happens in these cases
          if (!error && result.event === "success") {//=>handle the successful upload 4:53:55
            const payload: UploadWidgetValue = { //getting access to the payload - we re extracting the required upload data 4:54:20
              url: result.info.secure_url, //the public image url of that image
              publicId: result.info.public_id,
            };
              //after extraction 4:54:26
            setPreview(payload);//provide the payload to the Preview state
            setDeleteToken(result.info.delete_token ?? null); //is there any deletion being processed???  allowing us to delete the uploaded image
            onChangeRef.current?.(payload); //we re modifying the onChange reference with the most recent payload
          }
        }
      );

      return true; //the upload is complete
    };
    //function just created 4:55:08 once called will return true or false

    if (initializeWidget()) return;
      //else if false 4:55:28 we will pause until cloudinary script finished loading
     //if we still didnt receive a true value that means the script is nt completed yet
        //set an interval for 500ms
    const intervalId = window.setInterval(() => {
      if (initializeWidget()) { //if true =>completion of script job
        window.clearInterval(intervalId); //=>clear interval
      }
    }, 500);

    //finally exit out of the function with and clear our interval 4:56:00
    return () => window.clearInterval(intervalId);
  }, []); //[] as dependacy array


  //couple of func needed 4:47:10
  const openWidget = () => {
    if (!disabled) {
      widgetRef.current?.open();
    }
  };

  //remove the uploaded image from cloudinary using the delete token()    4:47:37
  const removeFromCloudinary = async () => {
    if (!preview) return;

    setIsRemoving(true);

    try {
      if (deleteToken) {
        const params = new URLSearchParams();
        params.append("token", deleteToken);

        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: "POST",
            body: params,
          }
        );
      }
    } catch (error) {
      console.error("Failed to remove image from Cloudinary", error);
    } finally {
      setPreview(null);
      setDeleteToken(null);
      onChangeRef.current?.(null);
      setIsRemoving(false);
    }
  };

  return ( // - 1st we ll do the JSX part 4:45:00
    <div className="space-y-2">
      {preview ? ( //figure out whether we re previewing the file we re working with
          // or we re showing the upload widget for the 1st time ==>manage a state

        <div //4:47:46 if preview is turned on
              className="upload-preview">
          {/*   **upload preview** 4:58:17 even if it is uploaded correctly =>we wont b able to see it bcz*/}
          {/*we hvent yet implemented antg for the **upload preview***/}
          <img
                  src={preview.url}
                  alt="Uploaded file" />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeFromCloudinary}
            disabled={isRemoving || disabled}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ) : (//esle if ntg has been uploaded yet 4:48:00
        <div//allowing users to upload in the 1st place - how iwll the upload zone look like 4:28:20
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget} //=>open the widget - cal the func
          onKeyDown={(event) => { //when somebody presses=>which event was it?
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          {/*RIGHT WITHIN THE DIV WHERE WE RE SHOING THE WIDGET 4:49:00*/}
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadWidget;
