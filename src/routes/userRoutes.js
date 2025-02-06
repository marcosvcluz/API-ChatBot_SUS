import express from "express";

import {getAllUsers} from "../controller/userController.js";
import {getUserByNumAndCEP} from "../controller/userController.js";
import {createUser} from "../controller/userController.js";
import {deleteUser} from "../controller/userController.js";
import {updateUser} from "../controller/userController.js";
import {handleTwilioWebhook} from "../controller/userController.js"

const router = express.Router();

// Rota para buscar a equipe pelo número e CEP
router.get("/equipe_ubs", getAllUsers);
router.get("/equipe_ubs/:numero/:cep/",getUserByNumAndCEP);
router.post("/equipe_ubs", createUser);//Rota para criar os usuários
router.delete("/equipe_ubs/:numinic/:numfin/:cep", deleteUser)
router.put("/equipe_ubs/:id", updateUser);

// Rota para o Twilio webhook
router.post("/equipe_ubs/twilio-webhook", handleTwilioWebhook);
export default router;