CREATE DATABASE trails_db;
USE trails_db;

CREATE TABLE Trails (
        tid INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL,
        lat DECIMAL(10, 8) NOT NULL,
        lng DECIMAL(11, 8) NOT NULL,
        gps_data TEXT,
        PRIMARY KEY (tid)
);

CREATE TABLE Land_trails (
        tid INT REFERENCES Trails(tid),
        surface_type VARCHAR(64),
        elevation_change INT,
        PRIMARY KEY (tid)
);

CREATE TABLE Water_trails (
        tid INT REFERENCES Trails(tid),
        depth INT,
        waterbody_type VARCHAR(64),
        PRIMARY KEY (tid)
);

CREATE TABLE Photographs (
        pid INT NOT NULL AUTO_INCREMENT,
        file_path VARCHAR(256),
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        date DATE,
        tid INT,
        PRIMARY KEY (pid),
        FOREIGN KEY (tid) REFERENCES Trails(tid)
);

CREATE TABLE Comments (
        cid INT NOT NULL AUTO_INCREMENT,
        user VARCHAR(256) NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        rating INT,
        tid INT,
        comment TEXT NOT NULL,
        PRIMARY KEY (cid),
        FOREIGN KEY (tid) REFERENCES Trails(tid)
);


