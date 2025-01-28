import express from "express";
import {getAllUsers} from "../controller/userController.js";
import {getUserByNumAndCEP} from "../controller/userController.js";
import {createUser} from "../controller/userController.js";
import {deleteUser} from "../controller/userController.js";

//Usando a funções do models
import {getAllUsersService} from "../models/userModel.js";
//import { getUserByServiceNumAndCEP} from "../models/userModel.js"; NÃO DEU CERTO
import validateUser from "../middlewares/inputValidator.js";

const router = express.Router();

// Rota para buscar a equipe pelo número e CEP
router.get("/equipe_ubs", getAllUsers);
router.get("/equipe_ubs/:numero/:cep/",getUserByNumAndCEP);
router.post("/equipe_ubs", createUser);//Rota para criar os usuários
router.delete("/equipe_ubs/:numinic/:numfin/:cep", deleteUser)

export default router;

//import validateUser from "../middlewares/inputValidator.js";


//import  createTeam  from "../models/userModel.js";
//import  updateTeam  from "../models/userModel.js";
//import  deleteTeam  from "../models/userModel.js";

//router.put("/equipe_ubs/:numero/:cep", updateTeam);
//router.delete("/equipe_ubs/:numero/:cep", deleteTeam);