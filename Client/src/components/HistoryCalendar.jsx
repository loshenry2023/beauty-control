import React from 'react'
import converterGMT from "../functions/converteGMT";

const HistoryCalendar = ({ calendars }) => {

    // const transform = (fecha) => {
    //     const inputDate = new Date(fecha);

    //     const options = {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         second: 'numeric',
    //         timeZoneName: 'short'
    //     };
    //     //const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);
    //     const formattedDate = inputDate;
    //     return formattedDateminutos}-${maxutos}
    // }

    const calendarSortes = calendars.sort(
        (a, b) => new Date(b.date_from) - new Date(a.date_from)
      );
    

    return (
        <section className='mx-auto my-2 flex flex-col flex-wrap justify-evenly sm:w-1/2'>
            <div className='border-4 border-double border-primaryPink flex flex-col gap-1 flex-wrap p-4 h-fit rounded overflow-hidden shadow-lg dark:border-zinc-800'>
                {calendarSortes.length >= 1 ? <h2 className='font-medium text-center text-2xl dark:text-darkText'> Turnos anteriores </h2> : <h2 className='text-2xl font-medium text-center dark:text-darkText'> Sin turnos registrados </h2>}
                <div className='flex flex-col gap-2 justify-center sm:flex-row sm:flex-wrap sm:gap-5 sm:items-center'>
                {calendarSortes.map((calendar, index) => {
                    return (
                            <div key={index} className='w-60 h-28 scrollbar-container gap-1 flex flex-col shadow-sm shadow-black px-2 py-0.5 hover:scale-[1.02] transition-colors duration-700 dark:bg-darkPrimary dark:hover:bg-zinc-800'>
                                <p className='text-md tracking-wide font-medium dark:text-darkText'> <span className='font-bold dark:text-darkText'>Fecha de turno: <br /></span> {converterGMT(calendar.date_from).split(" ")[0]} </p>
                                <p className='text-md tracking-wide font-medium dark:text-darkText'> <span className='font-bold dark:text-darkText'>Observaciones: <br /></span> {calendar.obs !== " " ? calendar.obs : " - "}  </p>
                            </div>
                    );
                })}
                </div>

            </div>
        </section>
    );
}

export default HistoryCalendar