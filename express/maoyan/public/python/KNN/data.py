import numpy as np

class datasets(object):
    def __init__(self):

        raw_data = np.loadtxt("./public/json/movie.txt", np.str, delimiter="\t",encoding='utf-8')
        # print(raw_data)

        self.movie_name = []
        self.movie_type = []
        self.movie_score = []
        for l in raw_data:
            self.movie_name.append(l[0])
            self.movie_type.append(l[1].split(","))
            self.movie_score.append(l[2].split("分")[0])
        # print(self.movie_name)
        # print(self.movie_type)
        # print(self.movie_score)

        self.movie_name_dict = dict(zip(self.movie_name, range(0, len(self.movie_name))))
        # print(self.movie_name_dict)

        self.movie_type_total = []
        for m_type in self.movie_type:
            for m in m_type:
                self.movie_type_total.append(m)
        self.movie_type_total = list(set(self.movie_type_total))
        # print("电影类型总数为：", len(self.movie_type_total))

        self.Onehot = []
        for m_type in self.movie_type:
            l = [0] * len(self.movie_type_total)
            for m in m_type:
                l[self.movie_type_total.index(m)] = 1
            self.Onehot.append(l)
        # print(self.Onehot)

    def get_movie_name(self):
        return np.array(self.movie_name)

    def get_OneHot(self):
        return np.reshape(self.Onehot, [-1,len(self.movie_type_total)])

    def get_movie_dict(self):
        return self.movie_name_dict

    def get_movie_score(self):
        return np.reshape(self.movie_score, [-1,1])