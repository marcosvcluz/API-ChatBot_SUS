import {deleteUserService, getAllUsersService} from "../models/userModel.js";
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
        handleResponse(res, 200, "Users fetched successfully", user);
    } catch (err) {
        next(err);
    }
};

export const getUserByNumAndCEP = async (req, res, next) => {
    const { cep, numero } = req.params || req.body;
    
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

export const getUserByGPS = async (req, res, next) => {
    const { longitude, latitude} = req.params  || req.body;
    
    try{
                       
        // Chamando a função
        const corEquipe = await getUserByServiceGPS(longitude, latitude);

        //se usuário não encontrado
        if(!corEquipe){
            return res.status(404).json({message: "Equipe não encontrada para esse GPS informado"});
        }
        //retornando a resposta com sucesso 
        return res.status(200).json({ cor_equipe: corEquipe});
    }   catch (err) {
        //Passando erros para o próximo middleware
        next(err);
    }
};


export const createUser = async (req, res, next) => {
    const {logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude} = req.body || req.params;
    try{
        const newUser = await createUserService(logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude);
        handleResponse(res, 201, "User created sucessfully", newUser);
    } catch(err) {
        next(err);
    }
};


//TRABALHAR NESSA FUNÇÃO*******************(2)
export const deleteUser = async (req, res, next) => {
   try
   {
        const  {numinic, numfin, cep} = req.body || req.params;
        if (!numinic || !numfin || !cep)
        {
            return handleResponse(res, 400, "Equipe não encontrada");
        }
        
        console.log(`Requisição: deletetar cor de equipe com numero inicial, numero final e cep: ${numinic}, numero final: ${numfin}, cep: ${cep}`);
    
        //Chamando service delete do arquivo userModel
        const deletedUser = await deleteUserService (numinic, numfin, cep);
        
        //Caso não encontre
        if(!deletedUser)
        {
            console.log("Equipe não encontrada");
            return handleResponse(res, 404, "Usuario não encontrado");
        }

        //Se encontrar
        console.log("Usuario deletado com sucesso!");
        return handleResponse(res, 200, "Equipe deletada do banco de dados!");
    }
   catch(err) 
   {
        next(err);
   }
};

//TRABALHAR NESSA FUNÇÃO*******************(3)
export const updateeUser = async (req, res, next) => {

}