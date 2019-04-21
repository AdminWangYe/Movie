# -------------------------------------------------------------------------------
# Name:         mongocreate
# Description:  mongoDB 数据库构建，以及一些配置
#
#
# Author:       Admin
# Date:         2018/11/25
# -------------------------------------------------------------------------------
import pymongo


class mongoDB(object):
    # 创建数据库
    def __init__(self,dbname,collectionname):
        # 主机名
        host = '127.0.0.1'
        # 端口号
        port = 27017
        # 数据库名称
        dbname = dbname
        # 存放电影表的名称
        sheetmoves = collectionname
        # 存放 用户表的名称
        sheetusers = 'maoyanusers'

        # 创建MongoDB 数据库连接
        client = pymongo.MongoClient(host=host, port=port)
        # 指定数据库
        mydb = client[dbname]

        # 存放数据的数据库表名
        self.moves = mydb[sheetmoves]
        self.users = mydb[sheetusers]

    def process_item(self, item, ismoves):
        # 判断插入的数据是电影还是用户评论
        data = dict(item)
        if ismoves:
            # 插入的数据是电影
            self.moves.insert(data)
        else:
            # 插入的数据是用户
            self.users.insert(data)

        return item
