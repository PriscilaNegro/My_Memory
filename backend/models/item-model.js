import pool from "../config/db-postgres.js";

const ItemModel = {
    async create({ name, location_id, image, description, user_id }) {
        const result = await pool.query(
            `insert into items (name, location_id, image, description, user_id)
             values ($1, $2, $3, $4, $5)
             returning *`,
            [name, location_id, image, description, user_id]
        );
        return result.rows[0];
    },

    async findById(id, user_id) {
        const result = await pool.query(
            `select * from items where id = $1 and user_id = $2`,
            [id, user_id]
        );
        return result.rows[0];
    },

    async findAllByUser(user_id) {
        const result = await pool.query(
            `select i.*, l.name as location_name
             from items i
             join locations l on i.location_id = l.id
             where i.user_id = $1
             order by i.created_at desc`,
            [user_id]
        );
        return result.rows;
    },

    async update({ id, name, location_id, image, description, user_id }) {
        const result = await pool.query(
            `update items set name = $1, location_id = $2, image = $3, description = $4,
             updated_at = now()
             where id = $5 and user_id = $6 returning *`,
            [name, location_id, image, description, id, user_id]
        );
        return result.rows[0];
    },

    async delete(id, user_id) {
        const result = await pool.query(
            `delete from items
             where id = $1 and user_id = $2 returning *`,
            [id, user_id]
        );
        return result.rows[0];
    },
};

export default ItemModel;
