import express from "express";
import {getAllUsersService} from "../models/userModel.js";
import {getUserByNumAndCEP} from "../controller/userController.js";
import {createUser} from "../controller/userController.js";
import validateUser from "../middlewares/inputValidator.js";

const router = express.Router();

// Rota para buscar a equipe pelo número e CEP
router.get("/equipe_ubs", getAllUsersService);
router.get("/equipe_ubs/:cep/:numero",getUserByNumAndCEP);
router.post("/equipe_ubs", createUser);//preciso olhar para o banco de dados.

export default router;

//import validateUser from "../middlewares/inputValidator.js";


//import  createTeam  from "../models/userModel.js";
//import  updateTeam  from "../models/userModel.js";
//import  deleteTeam  from "../models/userModel.js";

//router.put("/equipe_ubs/:numero/:cep", updateTeam);
//router.delete("/equipe_ubs/:numero/:cep", deleteTeam);