import { useEffect, useRef } from "react";
import getParamsEnv from "../functions/getParamsEnv";
const { CLOUD_NAME, UPLOAD_PRESET } = getParamsEnv();

export const UploadWidgetCompany = ({ setCompany }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ["local"], // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        multiple: false,  //restrict upload to a single file
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;

          setCompany((prevInfo) => ({
            ...prevInfo,
            imgCompany: imageUrl
        }));
        } else {
          //console.error("Error al cargar la imagen:", error);
        }
      }
    );
  }, [setCompany]);

  return (
    <span
      className="px-10 py-2 flex items-center cursor-pointer shadow shadow-black bg-primaryPink text-black rounded-md hover:bg-primaryColor hover:text-white transition-colors duration-700 dark:text-darkText dark:shadow-darkText dark:bg-darkPrimary dark:hover:bg-zinc-800"
      onClick={() => widgetRef.current.open()}
    >
      Subir Imagen
    </span>
  );
};
