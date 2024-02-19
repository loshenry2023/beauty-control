import React from 'react'

const Pagination = ({page, size, setPage, setSize, count}) => {
  const pagination = Math.ceil(count / size);
  return (
    <section className="mt-10 flex flex-col items-center gap-3">
    <select
        name=""
        id=""
        defaultValue={10}
        onChange={(e) => {
          setSize(e.target.value);
          setPage(0);
        }}
        className="shadow shadow-black rounded-md dark:text-darkText dark:bg-darkPrimary"
      >
        {" "}
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
      </select>
        <div>
        <button
          onClick={
            page
              ? () => {
                setPage(page - 1);
              }
              : null
          }
          className="dark:text-darkText"
        >
          {" "}
          {"<"}
        </button>
        <span className="dark:text-darkText"> Página {pagination === 0 ? `${page} de ${pagination}` : `${page + 1} de ${pagination}`} </span>
        <button
          onClick={
            page < pagination - 1
              ? () => {
                setPage(page + 1);
              }
              : null
          }
          className="dark:text-darkText"
        >
          {">"}
        </button>
        </div>
    </section>
  )
}

export default Pagination