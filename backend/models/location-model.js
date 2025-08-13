import db from "../config/db-postgres.js";

const LocationModel = {

    async create({ name, userId }) {
        const result = await pool.query(
            `insert into locations (name, user_id)
            values ($1, $2) returning *`
            [name, userId]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query(
            `select * from locations where id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async findByUserId(userId){
        const result = await pool.query(
            `select * from locations where user_id = $1`,
            [userId]
        );
    },

    async findAll() {
        const result = await pool.query(
            `select * from locations`
        );
        return result.rows;
    },

    async update({id,name}) {
        const result = await pool.query(
            `update locations set name = $1, update_at = now()
            where id = $2 returning *`,
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await pool.query(
            `delete from locations where id = $1 returning *`,
            [id]
        );

        if (result.rows.length ===0) {
            throw new Error(`Local com ID ${id} não encontrado`);
        }

        return result.rows[0];
    },
};

export default LocationModel;