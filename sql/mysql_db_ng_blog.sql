create database db_ng_blog;
use db_ng_blog;

drop table if exists t_user;
create table t_user ( id varchar(50), name varchar(200),gender varchar(50), pwd varchar(200),create_date varchar(50) , image_id varchar(50), is_admin int);
-- admin : 123456
insert t_user value ('3a29beb0-2e4b-11e9-84f6-735f7f936533','admin','male','487eef13931d5517e50284795efc8e5539b0d1ce2daa235ee0c1f70967d4148f','2019-02-12 06:20:24',null,1);
drop table if exists t_blog;
create table t_blog ( id varchar(50), create_user_id varchar(50), title varchar(200), category_id varchar(50), key_word_ids varchar(1000), content longtext, watched int, create_date varchar(50), update_date varchar(50));
drop table if exists t_category;
create table t_category ( id varchar(50), name varchar(200),create_user_id varchar(50), create_date varchar(50));
drop table if exists t_key_word;
create table t_key_word ( id varchar(50), name varchar(200),create_user_id varchar(50), create_date varchar(50));
drop table if exists t_images;
create table t_images ( id varchar(50), path varchar(500),create_user_id varchar(50),create_date varchar(50));
