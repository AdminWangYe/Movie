# -------------------------------------------------------------------------------
# Name:         testMogodb
# Description:  mogodb 压力测试
#
#
# Author:       Admin
# Date:         2018/12/13
# -------------------------------------------------------------------------------
import datetime

import mongodb
import multiprocessing
import time
from pymongo import MongoReplicaSetClient


class testmongoDB:
    def __init__(self, dbname, collection):
        # 连接数据库
        self.db = mongodb.mongoDB(dbname, collection)

    # 时间记录器
    def func_time(self, func):
        def _wrapper(*args, **kwargs):
            start = time.time()
            func(*args, **kwargs)
            print(func._name_ + 'run:' + time.time() - start)

        return _wrapper

    # @func_time
    def insert(self, num):
        start = time.time()
        for x in range(num):
            post = {
                '_id': str(x),
                'name': str(x) + '斗罗大陆',
                'type': '动漫',
                'country': '中国',
                'lenght': '180分钟',
                'socre': '8分',
                'data': datetime.datetime.utcnow()
            }
            self.db.process_item(post, True)
            print("插入成功：%s"% post)
        usertime = time.time() - start

        print("数据插入结束,用时：%s"%usertime)

    # 查询测试
    def query(self, num):
        get = self.db.device
        for i in range(num):
            get.find_one({"scanid": "010000138101010000009aaaaa"})

    # @func_time
    def main(self, process_num, num):

        pool = multiprocessing.Pool(processes=process_num)
        for i in range(num):
            pool.apply_async(self.query(num))
        pool.close()
        pool.join()
        print("sub_process(es) done.")


# 主函数运行开始的地方
if __name__ == '__main__':
    dbname = 'maoyan'
    collectionName = 'maoyanusers'
    test = testmongoDB(dbname, collectionName)
    # 设定循环5000次
    num = 5000
    test.insert(num)

    # test.main(800, 500)
