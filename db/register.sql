insert into users2 (email, password, isadmin)
values ($1, $2, $3)
returning *;