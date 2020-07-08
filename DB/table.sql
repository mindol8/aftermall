use autoinmall;

drop table USER;
drop table ITEM;

CREATE TABLE USER(
    USER_ID VARCHAR(20),
    USER_PW VARCHAR(512),
    SALT VARCHAR(512),
    NAME VARCHAR(50),
    EMAIL VARCHAR(50),
    PHONE VARCHAR(30),
    ADDRESS VARCHAR(50),
    ZIPCODE VARCHAR(20),
    TOKEN INT(1),
    PRIMARY KEY(USER_ID)
);

CREATE TABLE ITEM(
    NAME VARCHAR(30),
    PIN INT(20),
    MODEL VARCHAR(50),
    MOD_DET VARCHAR(50),
    MANUFACTURER VARCHAR(30),
    PRICE INT(20),
    MAINC VARCHAR(50),
    SUBC VARCHAR(50),
    PRIMARY KEY(PIN)   
);

