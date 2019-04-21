# -------------------------------------------------------------------------------
# Name:         ConnectionMysql
# Description:  连接数据库
#
#
# Author:       Admin
# Date:         2018/12/4
# -------------------------------------------------------------------------------
import pymysql


class ConnMysql:
    # 创建一个类，用来连接mysql 数据库
    # user,mysql的用户名和密码
    def __init__(self, user, pwa):
        db = pymysql.connect(host='localhost', user=user, password=pwa, port=3306)
        cursor = db.cursor()
        # 创建maoyan 数据库
        cursor.execute("CREATE DATABASE IF NOT EXISTS maoyan DEFAULT CHARACTER SET utf8mb4")
        db.close()

    def connectdb(self, uer, pwd, str):
        print("连接数据库。。。。。")
        # 创建数据库
        db = pymysql.connect(host='localhost', user=uer, password=pwd, port=3306, db=str)

        return db

    def createTable(self, db):
        print('创建film表。。。。')
        sql = 'CREATE TABLE IF NOT EXISTS films (name VARCHAR(32) NOT NULL, type VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, length VARCHAR(255) NOT NULL, released VARCHAR(255) NOT NULL, score VARCHAR(255) NOT NULL, people INT NOT NULL, box_office BIGINT NOT NULL, PRIMARY KEY (name))'
        cursor = db.cursor()

        # 如果不存在电影表就创建
        cursor.execute(sql)

    def closedb(self, db):
        db.close()


# 主函数运行开始的地方
if __name__ == '__main__':
    user = 'root'
    pwd = '111111'
    database = 'maoyan'
    # 创建数据库
    dbinit = ConnMysql(user, pwd)

    # 连接数据库
    db = dbinit.connectdb(user, pwd, database)

    # 创建表
    dbinit.createTable(db)

    # 关闭数据库
    dbinit.closedb(db)
