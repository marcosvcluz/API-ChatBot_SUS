import {getAllUsersService} from "../models/userModel.js";
import {getUserByServiceNumAndCEP} from "../models/userModel.js";
import {createUserService} from "../models/userModel.js";
 

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
      status,
      message,
      data,
    });
};

export const getAllUsers = async (req, res, next) => {
    try{
        const user = await getAllUsersService();
        handleResponse(res, 200, "Users fetched successfully", users);
    } catch (err) {
        next(err);
    }
};

export const getUserByNumAndCEP = async (req, res, next) => {
    const { cep, numero } = req.params;
    
    try{
                       
        // Chamando a função
        const corEquipe = await getUserByServiceNumAndCEP(cep, numero);

        //se usuário não encontrado
        if(!corEquipe){
            return res.status(404).json({message: "Equipe não encontrada para esse CEP e número"});
        }
        //retornando a resposta com sucesso 
        return res.status(200).json({ cor_equipe: corEquipe});
    }   catch (err) {
        //Passando erros para o próximo middleware
        next(err);
    }
};

export const createUser = async (req, res, next) => {
    const {logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude} = req.body;
    try{
        const newUser = await createUserService(logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude);
        handleResponse(res, 201, "User created sucessfully", newUser);
    } catch(err) {
        next(err);
    }
};


