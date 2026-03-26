import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";

import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { format, quality, dpr } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { Position } from "@cloudinary/url-gen/qualifiers/position";


import { CLOUDINARY_CLOUD_NAME } from "@/constants";

//define wt to do as tranformations within the image being called at show.tsx
//use the below advanced image from cloudinary 7:14:58


// Cloudinary instance. 7:11:19

const cld = new Cloudinary({ //7:12:06 additional options
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});


////7:09:00 cloudinary transformations
// 7:10:40 webstormproject/classroom-frontend/src/lib/cloudinary.ts
//to be used within the webstormproject/classroom-frontend/src/pages/classes/show.tsx
export const bannerPhoto = (imageCldPubId: string, name: string) => {//7:11:00
  return (
    cld //automatic return of the instance of the cloudinary
        //7:12:28 define wt to do as tranformations within this image
      .image(imageCldPubId)

      .resize( //resize it 7:12:45
        fill().width(1200).height(297) // Aspect ratio 5:1
      )
        // Optimize for web 7:12:50
      .delivery(format("auto"))
      .delivery(quality("auto"))
      .delivery(dpr("auto"))

        // Text overlay with name 7:13:16
      .overlay(
        source(
          text(name,
          new TextStyle("roboto",
                  42)
                   .fontWeight("bold"))
                   .textColor("white"))
                   .position( //7:14:08
                              new Position()
                                .gravity(compass("south_west")) //7:14:20 7:16:30 modify values
                                .offsetY(0.2)
                                .offsetX(0.02)
        )
      )
  );
};
