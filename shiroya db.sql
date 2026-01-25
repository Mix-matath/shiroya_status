use shiroya_status;
show tables

SELECT* FROM admins;

drop tables admins;

SELECT customer_id, status FROM orders;

select* from admins;
delete from orders where id = 7;

create database shiroya_status;

create table orders (
id int auto_increment primary key,
customer_id varchar(10) unique,
status varchar(50),
create_at datetime default current_timestamp,
updated_at datetime default current_timestamp on update current_timestamp
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(15) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE order_status_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  old_status VARCHAR(255),
  new_status VARCHAR(255),
  admin_id INT,
  admin_username VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  action VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select* from admin_logs;

insert into admins (username, password)
values ('admin1','11111111')
