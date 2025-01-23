import  pool  from  "../config/db.js";


//Selecionando todas as linhas da tabela equipe_ubs
export const getAllUsersService = async (req, res) => {
  try {
    console.log("Requisição recebida para /user/equipe_ubs");
    const result = await pool.query("SELECT * FROM equipe_ubs");
    console.log("Resultado da consulta:", result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao acessar o banco de dados:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getUserByServiceNumAndCEP = async ( cep, numero) => {
  
  try{
      //Consulta no banco de dados
      const result = await pool.query(
        `SELECT cor_equipe FROM equipe_ubs 
        WHERE cep = $1 
        AND ($2 >= numinic
        AND $2 <= numfin)`,
        [cep, numero] // Passando os parâmetros CEP e NUMERO
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

export const createUserService = async (logradouro, numero, cep, cor_equipe, latitude, longitude) => {

  const result = await pool.query(
    "INSERT INTO equipe_ubs(logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ",
    [logradouro, numinic, numfin, cep, cor_equipe, latitude, longitude]
  );
  return result.rows[0];
};