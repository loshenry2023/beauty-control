const router = require("express").Router();
//Controllers:
const getMain = require("../controllers/getMain");
const getUser = require("../controllers/getUser");

// const { getVideogames } = require("../controllers/getVideogames");
// const getGenres = require("../controllers/getGenres");
// const getPlatforms = require("../controllers/getPlatforms");
// const postVideoGame = require("../controllers/postVideoGame");
// const getVersionBack = require("../controllers/getVersionBack");
// const deleteVideoGame = require("../controllers/deleteVideoGame");
// const putVideoGame = require("../controllers/putVideoGame");

//Rutas:
router.get("/", getMain);
router.get("/Users", getUser);
//router.get("/laura-vargas", getVideogames); // obtiene un arreglo de objetos con los videojuegos
// router.get("/videogames/:id", getVideogames); // obtiene el detalle de un videojuego por id
// router.get("/genres", getGenres); // obtiene el listado de géneros
// router.get("/platforms", getPlatforms); //  obtiene el listado de plataformas
// router.post("/videogames", postVideoGame); //  crea un nuevo videojuego
// router.put("/edit/:id", putVideoGame); //  edita un videojuego
// router.delete("/remove/:id", deleteVideoGame); //  elimina un videojuego
// router.get("/versionback", getVersionBack); // obtiene la versión del backend para que el front lo muestre en el about

module.exports = router;
