DROP TABLE IF EXISTS characters;
CREATE TABLE characters(
    id SERIAL PRIMARY KEY NOT NULL,
    quote VARCHAR(256) NOT NULL,
    character VARCHAR(256) NOT NULL,
    image VARCHAR(256) NOT NULL,
    characterDirection VARCHAR(256) NOT NULL
) 