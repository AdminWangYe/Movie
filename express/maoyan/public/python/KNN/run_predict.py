from model import KNN_model
import sys


class Knn_Run:

    def __init__(self, name='我不是药神', num=5):
        # 电影名称
        self.movie_name = name
        # 筛选同类型电影数
        self.netghbors = 10
        # 按照评分由高到低排列之后推荐的电影数
        self.out_number = num

    # 运行KNN 算法，根据用户输入的名字，推荐电影,并返回结果
    def Canlution(self):
        nn = KNN_model()
        rst = nn.knn_predict(self.movie_name, neighbors=self.netghbors, out_number=self.out_number)
        print("你输入的电影是:", self.movie_name)
        print("#为您推荐的电影数量为 :", self.out_number)
        print("#为您推荐的电影是 : ", rst[0])
        


if __name__ == '__main__':
    # 通过命令窗口，获得用户输入的电影名字
    name = str(sys.argv[1])
    run = Knn_Run(name)
    run.Canlution()
