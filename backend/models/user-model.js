import pool from '../config/db-postgres.js'

//user model functions
const UserModel ={
    //cria novo usuário
    async create({name, email, passwordHash}){
        const result = await pool.query(
            `insert into users (name, email, password)
             values ($1, $2, $3) returning *`, 
             [name, email, passwordHash]
        );
        console.log(result.rows);
        return result.rows[0];
    },

    async findById(id){
        const result = await pool.query(
            `select * from users where id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async findByName(name){
        const result = await pool.query(
            `select * from users where name = $1`,
            [name]
        );
        return result.rows[0];
    },
    
    async findByEmail(email){
        const result = await pool.query(
            `select * from users where email = $1`,
            [email]
        );
        return result.rows[0];
    },

    async update({name, email, passwordHash,id}){
        const result = await pool.query(
            `update users set name = $1, email = $2, password = $3            
             where id = $4 returning *`, 
             [name, email, passwordHash, id]
        );
        console.log(result.rows);
        return result.rows[0];
    },

    async delete(id){
        const result = await pool.query(
            `delete from users where id = $1 returning *`, 
             [id]
        );

        if (result.rows.length === 0) {
        throw new Error(`Usuário com ID ${id} não encontrado`);
    }
        console.log(result.rows);
        return result.rows[0];
    },
};

export default UserModel;