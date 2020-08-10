use autoinmall;

drop table USER;
drop table ITEM;
drop table CART;
drop table CATEGORY;
drop table MODEL;
drop table MANUFACTURER;

CREATE TABLE USER(
    USER_ID VARCHAR(20),
    USER_PW VARCHAR(512),
    SALT VARCHAR(512),
    NAME VARCHAR(50),
    EMAIL VARCHAR(50),
    PHONE VARCHAR(30),
    ADDRESS VARCHAR(50),
    ZIPCODE VARCHAR(20),
    LOCK_ACC INT(1),
    TOKEN INT(1),
    PRIMARY KEY(USER_ID)
);

CREATE TABLE ITEM(
    ITEM_NAME VARCHAR(30),
    PIN VARCHAR(256),
    PARTS_NUM VARCHAR(30),
    VOLUME INT(20),
    PRICE VARCHAR(20),
    ITEM_DESC TEXT(10000),
    RATE INT(5),
    REVIEW_NUM INT(30),
    PRIMARY KEY(PIN)   
);

CREATE TABLE REVIEW(
    USER_NAME VARCHAR(50),
    USER_ID VARCHAR(20),
    ITEM_PIN VARCHAR(256),
    REVIEW TEXT(10000),
    RATE INT(5),
    REVIEW_ID VARCHAR(300),
    REVIEW_DATE DATE,
    PRIMARY KEY(REVIEW_ID),
    FOREIGN KEY(USER_ID) REFERENCES USER(USER_ID),
    FOREIGN KEY(ITEM_PIN) REFERENCES ITEM(PIN)
);

CREATE TABLE CART(
    CART_ID VARCHAR(30) default 'before',
    ID VARCHAR(20),
    ITEM VARCHAR(50),
    PRICE VARCHAR(20),
    PIN VARCHAR(256),
    VOLUME INT(20),
    PARTS_NUM VARCHAR(30),
    PRIMARY KEY (CART_ID),
    FOREIGN KEY (ID) REFERENCES USER (USER_ID)    
);

CREATE TABLE RECEIPT(
    RECIPIENT VARCHAR(50),
    ORDER_NUM VARCHAR(50),
    PIN VARCHAR(50),
    ADDRESS VARCHAR(50),
    ZIPCODE VARCHAR(20),
    EMAIL VARCHAR(50),
    TOTAL FLOAT(50),
    DATE varchar(30),
    CARD_APPLY_NUM VARCHAR(50),
    CART_NUM VARCHAR(30),
    PRIMARY KEY (ORDER_NUM),
    FOREIGN KEY (RECIPIENT) REFERENCES USER (USER_ID)    
);

CREATE TABLE ITEMINFO(
    IMG1 VARCHAR(50),
    IMG2 VARCHAR(50),
    IMG3 VARCHAR(50),
    IMG4 VARCHAR(50),
    IMG5 VARCHAR(50),
    FILE_LIST TEXT(8000),
    BRAND_I VARCHAR(50),
    MAIN_C VARCHAR(30),
    SUB_C VARCHAR(30),
    BASE_M VARCHAR(30),
    DETAIL_M VARCHAR(50),
    CAR_M VARCHAR(30),
    ITEM_M VARCHAR(30),
    ITEM_NUM VARCHAR(256),
    PRIMARY KEY (ITEM_NUM),
    FOREIGN KEY (ITEM_NUM) REFERENCES ITEM (PIN)
);

CREATE TABLE CATEGORY_LIST(
    MAIN VARCHAR(30),
    SUB VARCHAR(50),
    ID VARCHAR(90),
    PRIMARY KEY (ID)
);

CREATE TABLE CAR_BRAND(
    NAME VARCHAR(30),
    IMG VARCHAR(50),
    PRIMARY KEY(NAME)
);

CREATE TABLE ITEM_BRAND(
    NAME VARCHAR(50),
    IMG VARCHAR(50),
    COUNTRY VARCHAR(30),
    CITY VARCHAR(30),
  
    PRIMARY KEY(NAME)
);

CREATE TABLE RANKING(
    THEME VARCHAR(256),
    TOP1 VARCHAR(256),
    TOP2 VARCHAR(256),
    TOP3 VARCHAR(256),
    PRIMARY KEY(THEME)
);

INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'seat', ID = 'accessories_seat';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'mirror', ID = 'accessories_mirror';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'pedal', ID = 'accessories_pedal';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'gear', ID = 'accessories_gear';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'steering wheel', ID = 'accessories_steering wheel';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'cover', ID = 'accessories_cover';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'pad', ID = 'accessories_pad';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'holder', ID = 'accessories_holder';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'pocket', ID = 'accessories_pocket';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'handle', ID = 'accessories_handle';
INSERT INTO CATEGORY_LIST SET MAIN = 'accessories' , SUB = 'etc', ID = 'accessories_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'panel' , ID = 'body_panel';
INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'airbag' , ID = 'body_airbag';
INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'dash board' , ID = 'body_dash board';
INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'door' , ID = 'body_door';
INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'turnk' , ID = 'body_trunk';
INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'bonnet' , ID = 'body_bonnet';
INSERT INTO CATEGORY_LIST SET MAIN = 'body' , SUB = 'etc' , ID = 'body_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'brake' , SUB = 'brake', ID = 'brake_brake';
INSERT INTO CATEGORY_LIST SET MAIN = 'brake' , SUB = 'master cylinder', ID = 'brake_master cylinder';
INSERT INTO CATEGORY_LIST SET MAIN = 'brake' , SUB = 'etc', ID = 'brake_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'eletric parts' , SUB = 'control system',ID = 'eletric parts_control system';
INSERT INTO CATEGORY_LIST SET MAIN = 'eletric parts' , SUB = 'cooling system',ID = 'eletric parts_cooling system';
INSERT INTO CATEGORY_LIST SET MAIN = 'eletric parts' , SUB = 'lamp',ID = 'eletric parts_lamp';
INSERT INTO CATEGORY_LIST SET MAIN = 'eletric parts' , SUB = 'wiper',ID = 'eletric parts_wiper';
INSERT INTO CATEGORY_LIST SET MAIN = 'eletric parts' , SUB = 'etc',ID = 'eletric parts_etc';


INSERT INTO CATEGORY_LIST SET MAIN = 'power generater parts' , SUB = 'engine',ID = 'power generater parts_engine';
INSERT INTO CATEGORY_LIST SET MAIN = 'power generater parts' , SUB = 'fuel system',ID = 'power generater parts_fuel system';
INSERT INTO CATEGORY_LIST SET MAIN = 'power generater parts' , SUB = 'start',ID = 'power generater parts_start';
INSERT INTO CATEGORY_LIST SET MAIN = 'power generater parts' , SUB = 'ignition system',ID = 'power generater parts_ignition system';
INSERT INTO CATEGORY_LIST SET MAIN = 'power generater parts' , SUB = 'exhaust',ID = 'power generater parts_exhaust';
INSERT INTO CATEGORY_LIST SET MAIN = 'power generater parts' , SUB = 'etc',ID = 'power generater parts_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'power transfer parts' , SUB = 'clutch',ID = 'power transfer parts_clutch';
INSERT INTO CATEGORY_LIST SET MAIN = 'power transfer parts' , SUB = 'transmission',ID = 'power transfer parts_transmission';
INSERT INTO CATEGORY_LIST SET MAIN = 'power transfer parts' , SUB = 'differental system',ID = 'power transfer parts_differental system';
INSERT INTO CATEGORY_LIST SET MAIN = 'power transfer parts' , SUB = 'drive shaft',ID = 'power transfer parts_drive shaft';
INSERT INTO CATEGORY_LIST SET MAIN = 'power transfer parts' , SUB = 'wheel',ID = 'power transfer parts_wheel';
INSERT INTO CATEGORY_LIST SET MAIN = 'power transfer parts' , SUB = 'etc',ID = 'power transfer parts_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'steering parts' , SUB = 'steering wheel',ID = 'steering parts_steering wheel';
INSERT INTO CATEGORY_LIST SET MAIN = 'steering parts' , SUB = 'steering column',ID = 'steering parts_steering column';
INSERT INTO CATEGORY_LIST SET MAIN = 'steering parts' , SUB = 'steering gear',ID = 'steering parts_steering gear';
INSERT INTO CATEGORY_LIST SET MAIN = 'steering parts' , SUB = 'etc',ID = 'steering parts_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'suspention parts' , SUB = 'shock absorber',ID = 'suspention parts_shock absorber';
INSERT INTO CATEGORY_LIST SET MAIN = 'suspention parts' , SUB = 'etc',ID = 'suspention parts_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'tuning parts' , SUB = 'build up',ID = 'tuning parts_build up';
INSERT INTO CATEGORY_LIST SET MAIN = 'tuning parts' , SUB = 'tune up',ID = 'tuning parts_tune up';
INSERT INTO CATEGORY_LIST SET MAIN = 'tuning parts' , SUB = 'dress up',ID = 'tuning parts_dress up';
INSERT INTO CATEGORY_LIST SET MAIN = 'tuning parts' , SUB = 'etc',ID = 'tuning parts_etc';

INSERT INTO CATEGORY_LIST SET MAIN = 'etc',ID = 'etc_';