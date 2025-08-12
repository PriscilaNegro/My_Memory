import pool from '../config/db-postgres.js'

//user model functions
const UserModel ={
    //cria novo usuário
    async create({name, email, passwordHash}){
        const emailLower = email.toLowerCase();
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

   async findByName(name) {
    const searchTerm = `%${name.toLowerCase()}%`;
    const result = await pool.query(
        `SELECT * FROM users WHERE LOWER(name) LIKE $1`,
        [searchTerm]
    );
    return result.rows;
},
    
    async findByEmail(email){
        const emailLower = email.toLowerCase(); 
        const result = await pool.query(
            `select * from users where email = $1`,
            [emailLower]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query(
            `select * from users`);
        return result.rows;
    },

    async update({ id, name, email, passwordHash }) {
        const fields = [];
        const values = [];
        let index = 1;

    if (name !== undefined) {
        fields.push(`name = $${index++}`);
        values.push(name);
    }
    if (email !== undefined) {
        fields.push(`email = $${index++}`);
        values.push(email.toLowerCase());
    }
    if (passwordHash !== undefined) {
        fields.push(`password = $${index++}`);
        values.push(passwordHash);
    }

    if (fields.length === 0) {
        throw new Error("Nenhum dado para atualizar.");
    }

    values.push(id);
    const result = await pool.query(
        `update users set ${fields.join(", ")} 
         where id = $${index} returning *`,
         values
    );

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