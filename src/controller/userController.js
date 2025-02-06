import {deleteUserService, getAllUsersService} from "../models/userModel.js";
import {getUserByServiceNumAndCEP} from "../models/userModel.js";
import {createUserService} from "../models/userModel.js";
import {updateUserService} from "../models/userModel.js";
import {getUserByServiceGPS} from "../models/userModel.js";
import pkg from 'twilio';
const {MessagingResponse} = pkg;

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
      status,
      message,
      data,
    });
};

export const handleTwilioWebhook = async(req, res) => {
    const recebendoDados = req.body; //Dados enviados via Twilio

    //Extraindo dados do GPS
    const messageBody = recebendoDados.body; // Corpo do SMS
    const [latitude, longitude] = messageBody.splot(',').map(parseFloat);

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    try{
        //Comparando os dados de GPS com database
        const math = await getUserByServiceGPS(latitude, longitude);

        //Tratando o resultado
        if (math) {
            console.log("Equipe encontrada:", math);
        }
        else{
            console.log("Equipe não encontrada no banco de dados.")
        }

        //Repondendo o Twilio
        const twiliores = new MessagingResponse();
        twiliores.message("GPS data received and processed!");
        res.type("text/xml").send(twiliores.toString());
    }
    catch (error) {
        console.error("Error processing GPS data:", error);
        res.status(500).send("Internal Server Error");
    }
}

//Validacao e tratativa de erro na chamada da funcao getAllUsersService
export const getAllUsers = async (req, res, next) => {
    try{
        const user = await getAllUsersService();
        handleResponse(res, 200, "Users fetched successfully", user);
    } catch (err) {
        next(err);
    }
};

//Validacao e tratativa de erro na chamada da funcao getUserByNumAndCEP
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

//Validacao e tratativa de erro na chamada da funcao getUserByGPS
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

//Validacao e tratativa de erro na chamada da funcao createUserService
export const createUser = async (req, res, next) => {
    const {logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude} = req.body || req.params;
    try{
        const newUser = await createUserService(logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude);
        handleResponse(res, 201, "User created sucessfully", newUser);
    } catch(err) {
        next(err);
    }
};


//Validacao e tratativa de erro na chamada da funcao deleteUserService
export const deleteUser = async (req, res, next) => {
   try
   {
        const  {numinic, numfin, cep} = req.params;
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

//Validacao e tratativa de erro na chamada da funcao updateService
export const updateUser = async (req, res, next) => 
{
    try
    {
        const updatedUser = await updateUserService(req, res);
        
        if (!updatedUser) 
        {
            return handleResponse(res, 404, "Equipe não encontrado");
        }
        
        handleResponse(res, 200, "Usuario atualizado com sucesso", updatedUser);
    }
    
    catch (err)
    {
        next(err);
    }
};