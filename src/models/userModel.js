import  pool  from  "../config/db.js";


//Selecionando todas as linhas da tabela equipe_ubs
export const getAllUsersService = async (req, res) => {
  try {
    console.log("Requisição recebida para /user/equipe_ubs");
    const result = await pool.query("SELECT * FROM equipe_ubs");
    console.log("Resultado da consulta:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Erro ao acessar o banco de dados:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
//Selecionando a equipe da tabela equipe_ubs com cep e numero do paciente
export const getUserByServiceNumAndCEP = async ( cep, numero) => {
  console.log(cep, numero);
  try{
      //Consulta no banco de dados
      const result = await pool.query(
        `SELECT cor_equipe FROM equipe_ubs 
        WHERE cep = $1 
        AND ($2 >= numinic AND $2 <= numfin)`,
        [cep,numero] // Passando os parâmetros CEP e NUMERO
      );
    
      //Se não houver resultados
      if(result.rows.length === 0){
        console.log("Equipe não encontrada", );
        return null;
      }

      //Se houver resultadosretorna a cor da equipe

      return result.rows[0].cor_equipe;
    } catch (error) {
      console.error("Erro ao acessar o banco de dados", error);
      throw error;
    }    
};

//Selecionando a equipe da tabela equipe_ubs com GPS
export const getUserByServiceGPS = async (latitude, longitude) => {
  try{
    //Margem de erro de distância de GPS ajustada em  110 metros
    const margem = 0.001;

    // Consulta no banco de dados
    const result = await pool.query(
      `SELECT * FROM equipe_ubs
      WHERE latitude BETWEEN $1::DOUBLE PRECISION - $3::DOUBLE PRECISION 
      AND $1::DOUBLE PRECISION + $3::DOUBLE PRECISION
      AND longitude BETWEEN $2::DOUBLE PRECISION - $3::DOUBLE PRECISION 
      AND $2::DOUBLE PRECISION + $3::DOUBLE PRECISION`,
      [latitude, longitude, margem]
    );

    //Retornando caso equipe não encontrada
    if (result.rows.length === 0) {
      console.log("Equipe não encontrada no banco de dados.");
      return null;
    }
    return result.rows[0].cor_equipe;
  }
  catch(error) {
    console.error("Erro ao acessar o banco de dados", error);
    throw error;
  }
};

// Creando um novo usuário na tabela do banco de dados
export const createUserService = async (logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude) => {
  if (isNaN(cep)){
    throw new Error ("Erro string");
  };
  const result = await pool.query(
    "INSERT INTO equipe_ubs(logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ",
    [logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude]
  );
  return result.rows[0];
};


//Deletando equipe do banco de dados com numero inicial, numero final e cep.
export const deleteUserService = async (numeroInicial, numeroFinal, cep) => {
  try{
    console.log(`Deletar objeto cor de equipe com os parâmetros 1° numero inicial, 2° numero final and 3° cep ${numeroInicial}, ${numeroFinal}, ${cep}`);
    
    const result = await pool.query(
      "DELETE FROM equipe_ubs WHERE numinic = $1 AND numfin = $2 AND cep = $3 RETURNING *",
      [numeroInicial, numeroFinal, cep]
    );

    if(result.rows.length === 0)
    {
      console.log("Equipe não encontrada");
      return null;
    }
    console.log(`Resultado: ${JSON.stringify(result.rows[0])}`);
    return result.rows[0];
  } 
  catch (error)
  {
    console.error("Erro cor de equipe não encontrada no banco de dados", error);
    throw error;
  }    
};

// Atualizando os dados da equipe através do ID.
export const updateUserService = async (req, res) => 
{
  try{
      
      const {id} = req.params;
      
      if(!id)
      {
        throw new Error("ID da equipe não fornecida!");
      }
        
      const { logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude } = req.body;
      
      const result = await pool.query
      (
        
        "UPDATE equipe_ubs SET logradouro = $2, numinic = $3, numfin=$4, cep = $5, cor_equipe = $6, latitude = $7, longitude = $8 WHERE id = $1 RETURNING *",
        [id, logradouro, numinic, numfin, cep, cor_equipe, latitude,  longitude]
      );
      
      if (result.rowCount === 0)
      {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      
      return res.status(200).json(result.rows[0]);
  }
  catch(err)
  {
    console.error.apply("Erro de updanting para equipe:", err);
    throw err;
  }
};