import React from "react";

const Restricted = () => {
  return (
    <div className="flex flex-col gap-10 w-full justify-center items-center dark:bg-darkBackground">
      <div>
        <h1 className="text-3xl tracking-wide text-center font-fontTitle  dark:text-darkText">
          Acceso restringido{" "}
        </h1>
        <h5 className="text-xl tracking-wide text-center text-gray-700 dark:text-darkText">
          Lo sentimos pero no tienes acceso a esta página.
        </h5>
      </div>
      <img
        src="https://cdn-icons-png.flaticon.com/512/345/345535.png"
        alt="denied-access"
        className="h-96 dark:invert"
      />
    </div>
  );
};

export default Restricted;
