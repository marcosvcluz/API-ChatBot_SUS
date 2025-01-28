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

      console.log('Cor da equipe', result);
    
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


//TRABALHAR NESSA FUNÇÃO*******************(1)
/*   1) RESEARCH geospatial queries function -> ST_Distance
/*   2) ALTERAR O BANCO DE DADOS
/*   3) FUNÇÃO PARADA MOMENTANEAMENTE 


export const getUserByServiceGPS = async(latitude, longitude) =>{
  console.log(typeof latitude, typeof longitude, typeof radius);
  try{
      //Consulta no banco de dados
      const result = await pool.query(
        `SELECT cor_equipe FROM equipe_ubs 
        WHERE latitude = $1 
        AND longitude = $2,
        [latitude, longitude]` // Passando os parâmetros latitude e longitude
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
}
**/


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


//TRABALHAR NESSA FUNÇÃO*******************(2)
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

//TRABALHAR NESSA FUNÇÃO*******************(3)
export const updateUserService = async (req, res, next) => {

}